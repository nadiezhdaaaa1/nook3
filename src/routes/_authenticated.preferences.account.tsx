import { createFileRoute } from "@tanstack/react-router";
import { useOnboardingStore } from "@/lib/onboarding/store";

export const Route = createFileRoute("/preferences/account")({
  component: AccountPage,
});

function AccountPage() {
  const { email, phone, selectedPlan, trialActive } = useOnboardingStore();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">
          <span className="accent-italic">Account</span>
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">Your plan and contact details.</p>
      </div>
      <div className="rounded-card bg-surface-elevated border border-border divide-y divide-border">
        <Row label="Email" value={email || "—"} />
        <Row label="Phone" value={phone || "—"} />
        <Row
          label="Plan"
          value={
            selectedPlan === "premium"
              ? `Premium${trialActive ? " (trial)" : ""}`
              : selectedPlan === "max"
                ? `Max${trialActive ? " (trial)" : ""}`
                : "Free"
          }
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between">
      <div className="text-xs font-mono uppercase tracking-wider text-charcoal-500">{label}</div>
      <div className="text-sm font-medium text-charcoal-950">{value}</div>
    </div>
  );
}
