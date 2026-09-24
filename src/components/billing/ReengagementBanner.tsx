import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import pausedIllustrationAsset from "@/assets/paused-illustration.png.asset.json";
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
      headline: "Your plan ended because we couldn't charge your card",
      body: "Nothing's lost — renew with a working card and new matches resume",
      cta: "Update card & renew",
    };
  }

  if (!access.hasEverSubscribed) {
    return {
      cause: "after_trial",
      headline: "Your free trial has ended",
      body: "Subscribe to keep getting new apartments the moment they're listed",
      cta: "Start my subscription",
    };
  }

  return {
    cause: "voluntary",
    headline: "Your plan has ended — new matches are paused",
    body: "Your searches and saved places are all still here. Renew and we'll start sending matches again",
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
  const access = suppliedAccess === undefined ? accessQuery.data : suppliedAccess;
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
        "relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-[16px] border-0 bg-[#D66C38] p-5 shadow-none",
        className,
      )}
    >
      <div className="relative z-10 min-w-0 max-w-[640px] min-[680px]:pr-[72px]">
        <h2 className="font-display text-[20px] font-semibold leading-7 tracking-[-0.3px] text-white">
          {copy.headline}
        </h2>
        <p className="max-w-[640px] pt-1 font-sans text-[14px] font-normal leading-6 text-white">
          {copy.body}
        </p>
      </div>
      <OriginButton
        type="button"
        variant="dark"
        size="medium"
        onClick={restart}
        className="relative z-10 h-12 w-fit shrink-0 rounded-[12px] bg-[#241C12] px-5 font-sans text-[15px] font-medium leading-[22.5px] tracking-[-0.3px] text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#D66C38]"
      >
        {copy.cta}
      </OriginButton>
      <img
        src={pausedIllustrationAsset.url}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[calc(50%+33px)] hidden h-[90px] w-[90px] translate-y-[-50%] object-contain min-[680px]:block"
      />
    </section>
  );
}