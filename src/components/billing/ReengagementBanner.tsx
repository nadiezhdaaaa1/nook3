import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { OriginButton } from "@/components/ui/origin-button";
import type { AccessState } from "@/lib/profile.functions";
import { accessQueryOptions } from "@/lib/queries/access";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

export type ReengagementCause = "after_trial" | "voluntary" | "after_dunning";

type ReengagementCopy = {
  cause: ReengagementCause;
  headline: string;
  body: string;
  cta: string;
};

export function getReengagementCopy(
  access: Pick<
    AccessState,
    "status" | "onboarded" | "hasEverSubscribed" | "pastDueSince"
  > | null | undefined,
): ReengagementCopy | null {
  if (!access?.onboarded || access.status === "active" || access.status === "trialing") {
    return null;
  }

  if (access.pastDueSince) {
    return {
      cause: "after_dunning",
      headline: "Your plan ended because we couldn't charge your card.",
      body: "Nothing's lost — renew with a working card and new matches resume.",
      cta: "Update card & renew",
    };
  }

  if (!access.hasEverSubscribed) {
    return {
      cause: "after_trial",
      headline: "Your free trial has ended.",
      body: "Subscribe to keep getting new apartments the moment they're listed.",
      cta: "Start my subscription",
    };
  }

  return {
    cause: "voluntary",
    headline: "Your plan has ended — new matches are paused.",
    body: "Your searches and saved places are all still here. Renew and we'll start sending matches again.",
    cta: "Renew my plan",
  };
}

export function ReengagementBanner({
  access: suppliedAccess,
  className,
  id,
}: {
  access?: AccessState | null;
  className?: string;
  id?: string;
}) {
  const accessQuery = useQuery({
    ...accessQueryOptions(),
    enabled: suppliedAccess === undefined,
    retry: false,
  });
  const access = suppliedAccess === undefined
    ? accessQuery.data ?? accessQueryOptions().initialData
    : suppliedAccess;
  const copy = getReengagementCopy(access);
  const navigate = useNavigate();

  if (!copy || !access) return null;

  const restart = () => {
    const plan = copy.cause === "after_trial" ? "pro" : access.plan;
    const cycle = copy.cause === "after_trial" ? "monthly" : access.billingCycle;
    const store = useOnboardingStore.getState();
    store.set("selectedPlan", plan);
    store.set("billingCycle", cycle);
    store.set("trialActive", false);
    navigate({ to: "/checkout/mock" });
  };

  return (
    <section
      id={id}
      role="status"
      className={cn(
        "rounded-card border border-primary/35 bg-paper-warm p-5 sm:flex sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-xl font-semibold text-charcoal-950">
          {copy.headline}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal-700">{copy.body}</p>
      </div>
      <OriginButton
        type="button"
        variant="main"
        size="medium"
        onClick={restart}
        className="mt-4 shrink-0 sm:mt-0"
      >
        {copy.cta}
      </OriginButton>
    </section>
  );
}