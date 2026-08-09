import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PricingThreeTiers, type Tier } from "@/components/landing/PricingThreeTiers";
import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";
import { TrialModal } from "@/components/onboarding/TrialModal";

export const Route = createFileRoute("/onboarding/pricing")({
  component: PricingScreen,
});

function PricingScreen() {
  const navigate = useNavigate();
  const { billingCycle, set } = useOnboardingStore();
  const [trialFor, setTrialFor] = useState<Plan | null>(null);

  const handleTierSelect = (tier: Tier) => {
    if (tier.id === "free") {
      set("selectedPlan", "free");
      set("trialActive", false);
      navigate({ to: "/onboarding/success" });
    } else {
      setTrialFor(tier.id as Plan);
    }
  };

  return (
    <div
      className="pricing-full-width"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <PricingThreeTiers
        cycle={billingCycle}
        onCycleChange={(c) => set("billingCycle", c)}
        onTierSelect={handleTierSelect}
        tierCta={{
          free: "Continue with free",
          premium: "Start 3-day trial",
          max: "Start 3-day trial",
        }}
      />

      {trialFor && (
        <TrialModal
          plan={trialFor}
          onClose={() => setTrialFor(null)}
          onConfirm={() => {
            setTrialFor(null);
            navigate({ to: "/onboarding/success" });
          }}
        />
      )}
    </div>
  );
}
