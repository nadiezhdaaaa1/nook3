import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { AccountDeletionBanner } from "@/components/account/AccountDeletionBanner";
import { AppHeader } from "@/components/app/AppHeader";
import { useDbSync } from "@/lib/queries/useDbSync";
import { HydrationSkeleton } from "@/components/system/HydrationSkeleton";

/**
 * Pathless layout route that gates every child under `_authenticated`.
 *
 * Supabase persists the session in `localStorage`, so on the SERVER
 * `getUser()` always returns null and would bounce every direct navigation
 * to /login. We skip the check during SSR and rely on the client-side re-run
 * after hydration — that's when the session is actually available.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { userId: data.user.id };
  },
  component: AppLayout,
});

function AppLayout() {
  const { isHydrating } = useDbSync();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideHeader = pathname.startsWith("/search/new");

  return (
    <div className="min-h-dvh bg-paper">
      <AccountDeletionBanner />
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
