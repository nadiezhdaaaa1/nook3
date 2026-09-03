import { createFileRoute } from "@tanstack/react-router";
import { PricingThreeTiers, type Tier } from "@/components/landing/PricingThreeTiers";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { usePlanFlow } from "@/lib/onboarding/usePlanFlow";
import { useOnboardingStore } from "@/lib/onboarding/store";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const { billingCycle, set } = useOnboardingStore();
  const flow = usePlanFlow("pricing_page");

  const select = (tier: Tier) =>
    void flow.selectPlan({
      plan: tier.plan,
      billingCycle: tier.billingCycle,
      trial: tier.id === "intro",
    });

  return (
    <main className="min-h-dvh bg-paper">
      <PricingThreeTiers
        cycle={billingCycle}
        onCycleChange={(next) => set("billingCycle", next)}
        onTierSelect={select}
      />
      <RegistrationModal {...flow.modalProps} />
    </main>
  );
}
