import { createFileRoute } from "@tanstack/react-router";
import { PricingThreeTiers, type Tier } from "@/components/landing/PricingThreeTiers";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { usePlanFlow } from "@/lib/onboarding/usePlanFlow";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
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
        onTierSelect={select}
      />
      <RegistrationModal {...flow.modalProps} />
    </main>
  );
}
