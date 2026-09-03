import { createFileRoute } from "@tanstack/react-router";
import { PricingThreeTiers, type Tier } from "@/components/landing/PricingThreeTiers";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { usePlanFlow } from "@/lib/onboarding/usePlanFlow";

export const Route = createFileRoute("/onboarding/pricing")({
  component: PricingScreen,
});

function PricingScreen() {
  const { billingCycle, set } = useOnboardingStore();
  // The onboarding answers are committed here (search insert + completed_at)
  // before checkout, so an abandoned payment returns as an onboarded account
  // that owes payment — not back into the wizard.
  const flow = usePlanFlow("onboarding_pricing", { commitBeforeCheckout: true });

  const handleTierSelect = (tier: Tier) =>
    void flow.selectPlan({
      plan: tier.plan,
      billingCycle: tier.billingCycle,
      trial: tier.id === "intro",
    });

  return (
    <div className="pricing-full-width" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
      <PricingThreeTiers
        cycle={billingCycle}
        onCycleChange={(c) => set("billingCycle", c)}
        onTierSelect={handleTierSelect}
        compactTop
        tierCta={{
          intro: "Start 3 days free",
          pro: "Get Pro now",
          pro_annual: "Get Pro annual",
        }}
      />
      <RegistrationModal {...flow.modalProps} />
    </div>
  );
}
