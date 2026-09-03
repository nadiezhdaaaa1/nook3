import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";
import { useHasSession } from "@/lib/queries/useHasSession";
import { accessQueryOptions } from "@/lib/queries/access";
import { commitOnboarding } from "@/lib/onboarding.functions";
import { commitOnboardingFromStore } from "@/lib/onboarding/commit";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import type { RegistrationSource } from "@/components/auth/RegistrationModal";

export type Cycle = "monthly" | "annual";

export interface PlanIntent {
  plan: Plan;
  billingCycle: Cycle;
  /** The intro tier is the 3-day trial. */
  trial: boolean;
}

const CHECKOUT_PATH = "/checkout/mock";

/**
 * One decision tree for every plan decision in the app.
 *
 * The plan intent is saved to the store at the click — before any navigation
 * or auth — so an abandoned checkout, an OAuth round-trip, or a modal close
 * all leave the choice intact. A visitor who already has an active or trialing
 * subscription is sent to Account, never to a second checkout.
 */
export function usePlanFlow(source: RegistrationSource, opts?: { commitBeforeCheckout?: boolean }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const hasSession = useHasSession();
  const accessQ = useQuery({ ...accessQueryOptions(), enabled: hasSession, retry: false });
  const commit = useServerFn(commitOnboarding);
  const set = useOnboardingStore((s) => s.set);

  const [modalOpen, setModalOpen] = useState(false);
  const [intent, setIntent] = useState<PlanIntent | null>(null);

  const subscribed = accessQ.data?.status === "active" || accessQ.data?.status === "trialing";

  const maybeCommit = useCallback(async () => {
    if (!opts?.commitBeforeCheckout) return true;
    try {
      await commitOnboardingFromStore(commit as never, qc);
      return true;
    } catch (e) {
      toast.error("We couldn't finish setting up", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
      return false;
    }
  }, [commit, opts?.commitBeforeCheckout, qc]);

  const goCheckout = useCallback(
    async (i: PlanIntent | null) => {
      if (!(await maybeCommit())) return;
      trackEvent(ANALYTICS_EVENTS.planCheckoutRedirect, {
        source,
        plan: i?.plan,
        cycle: i?.billingCycle,
      });
      navigate({ to: CHECKOUT_PATH });
    },
    [maybeCommit, navigate, source],
  );

  /** Save the intent, then route by session + subscription state. */
  const selectPlan = useCallback(
    async (i: PlanIntent) => {
      set("selectedPlan", i.plan);
      set("billingCycle", i.billingCycle);
      set("trialActive", i.trial);
      setIntent(i);

      if (!hasSession) {
        trackEvent(ANALYTICS_EVENTS.registrationModalOpened, {
          source,
          plan: i.plan,
          cycle: i.billingCycle,
        });
        setModalOpen(true);
        return;
      }

      // Do not treat a still-loading access query as an unsubscribed account.
      let alreadySubscribed = subscribed;
      if (!accessQ.data) {
        const refreshed = await accessQ.refetch();
        alreadySubscribed =
          refreshed.data?.status === "active" || refreshed.data?.status === "trialing";
      }

      if (alreadySubscribed) {
        if (opts?.commitBeforeCheckout) {
          if (!(await maybeCommit())) return;
          navigate({ to: "/home" });
          return;
        }
        navigate({ to: "/account", hash: "subscription" });
        return;
      }

      await goCheckout(i);
    },
    [
      accessQ,
      goCheckout,
      hasSession,
      maybeCommit,
      navigate,
      opts?.commitBeforeCheckout,
      set,
      source,
      subscribed,
    ],
  );

  const modalProps = {
    open: modalOpen,
    onOpenChange: setModalOpen,
    // Google's redirect variant loses this component, so the continuation has
    // to live in sessionStorage for /auth/callback to pick up.
    postAuthPath: CHECKOUT_PATH,
    onAuthed: () => void goCheckout(intent),
    source,
    plan: intent?.plan ?? null,
    cycle: intent?.billingCycle,
  };

  return { selectPlan, modalProps, subscribed, hasSession };
}
