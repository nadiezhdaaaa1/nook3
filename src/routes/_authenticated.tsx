import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
  useRouterState,
} from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { AccountDeletionBanner } from "@/components/account/AccountDeletionBanner";
import { BillingDunningBanner } from "@/components/billing/BillingDunningBanner";
import { AppHeader } from "@/components/app/AppHeader";
import { useDbSync } from "@/lib/queries/useDbSync";
import { HydrationSkeleton } from "@/components/system/HydrationSkeleton";
import { accessQueryOptions, accessQueryKey, clampOnboardingStep } from "@/lib/queries/access";
import { isUnauthorizedError } from "@/lib/queries/authError";
import type { AccessState } from "@/lib/profile.functions";
import { useOnboardingStore } from "@/lib/onboarding/store";

/**
 * Pathless layout route that gates every child under `_authenticated`.
 *
 * Supabase persists the session in `localStorage`, so on the SERVER
 * `getUser()` always returns null and would bounce every direct navigation
 * to /login. The whole subtree is `ssr: false`, so both the session check and
 * the access-state fetch run client-side after hydration — that's when the
 * session (and therefore the bearer token) is actually available.
 *
 * Access gate. Three server-derived flags (see getAccessState):
 *   credentials  — the account can sign in on its own (password OR social).
 *   subscription — trialing/active grant access; past_due grants a 7-day
 *                  grace period; none/canceled do not.
 *   onboarded    — `completed_at` is set. Means "finished setting up", not
 *                  "finished paying". Set once, never unset — deleting every
 *                  search does not send a returning user back to onboarding.
 *
 * `/account` is exempt: a canceled or deletion-scheduled user must still be
 * able to pay, export their data, reverse a deletion, or sign out.
 */
const GATE_EXEMPT_PREFIXES = ["/account"];

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location, context }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    if (GATE_EXEMPT_PREFIXES.some((p) => location.pathname.startsWith(p))) {
      return { userId: data.user.id };
    }

    // Awaited here, so the route does not render until access resolves — no
    // flash of app content. `pendingComponent` covers the wait.
    let access: AccessState;
    try {
      access = await context.queryClient.ensureQueryData(accessQueryOptions());
    } catch (err) {
      if (isRedirect(err)) throw err;
      // A session that exists locally but is rejected by the server (expired /
      // revoked token) must land on /login, not blank the app with an
      // unhandled loader error.
      if (isUnauthorizedError(err)) {
        context.queryClient.removeQueries({ queryKey: accessQueryKey });
        throw redirect({ to: "/login", search: { redirect: location.href } });
      }
      throw err;
    }

    const step = clampOnboardingStep(useOnboardingStore.getState().lastStep);

    // No credentials of their own: the account exists and may already be paid
    // for (e.g. created by a checkout webhook from a Stripe customer email,
    // reached through an emailed sign-in token). Their next step is setting up
    // credentials on the account that already exists.
    if (!access.credentials) {
      throw redirect({ to: "/signup", search: { lockEmail: 1 } });
    }

    if (!access.accessAllowed) {
      if (!access.onboarded) {
        throw redirect({ to: "/onboarding/step/$step", params: { step: String(step) } });
      }
      // All onboarded no-access cases belong in Account. The subscription
      // section distinguishes voluntary churn from dunning cancellation.
      throw redirect({ to: "/account", hash: "subscription" });
    }

    if (!access.onboarded) {
      throw redirect({ to: "/onboarding/step/$step", params: { step: String(step) } });
    }

    return { userId: data.user.id, access };
  },
  pendingComponent: GatePending,
  component: AppLayout,
});

function GatePending() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        <HydrationSkeleton />
      </div>
    </div>
  );
}

function AppLayout() {
  const { isHydrating } = useDbSync();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideHeader = pathname.startsWith("/search/new");

  return (
    <div className="min-h-dvh bg-paper">
      <AccountDeletionBanner />
      <BillingDunningBanner />
      <EmailVerificationBanner />
      {!hideHeader && <AppHeader />}
      {isHydrating ? (
        <div className="mx-auto max-w-[1440px] px-6 py-10">
          <HydrationSkeleton />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
