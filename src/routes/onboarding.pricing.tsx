import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PricingThreeTiers, type Tier } from "@/components/landing/PricingThreeTiers";
import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";

export const Route = createFileRoute("/onboarding/pricing")({
  component: PricingScreen,
});

function PricingScreen() {
  const navigate = useNavigate();
  const { billingCycle, set } = useOnboardingStore();

  const handleTierSelect = (tier: Tier) => {
    set("selectedPlan", tier.plan as Plan);
    set("billingCycle", tier.billingCycle);
    set("trialActive", tier.id === "intro");
    navigate({ to: "/onboarding/success" });
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
        compactTop
        tierCta={{
          intro: "Find My Apartment",
          pro: "Get Pro now",
          pro_annual: "Get Pro annual",
        }}
      />
    </div>
  );
}
