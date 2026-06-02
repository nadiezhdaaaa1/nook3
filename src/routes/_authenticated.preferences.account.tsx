import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { useAppStore, type Plan, type BillingCycle } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preferences/account")({
  component: AccountPage,
});

type PlanDef = {
  id: Plan;
  label: string;
  tagline: string;
  monthly: number;
  annual: number;
  icon: typeof Sparkles;
  features: string[];
};

const PLANS: PlanDef[] = [
  {
    id: "free",
    label: "Free",
    tagline: "Get a feel for what's out there.",
    monthly: 0,
    annual: 0,
    icon: Sparkles,
    features: ["1 saved search", "Email alerts", "Daily digest"],
  },
  {
    id: "premium",
    label: "Premium",
    tagline: "When you're actively looking.",
    monthly: 14.99,
    annual: 119,
    icon: Zap,
    features: ["3 saved searches", "Real-time alerts", "Email + SMS", "All filters", "Wren AI Chat"],
  },
  {
    id: "max",
    label: "Max",
    tagline: "For relocators and serious hunters.",
    monthly: 29,
    annual: 229,
    icon: Crown,
    features: ["Unlimited searches", "Priority alerts", "Concierge matches", "Early access"],
  },
];

function AccountPage() {
  const { email, phone } = useOnboardingStore();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const trialActive = useAppStore((s) => s.user?.trialActive ?? false);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const currentPlan = PLANS.find((p) => p.id === plan) ?? PLANS[0];

  return (
    <div className="space-y-12">
      {/* Profile summary */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">Profile</h2>
        <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
          <Row label="Email" value={email || "—"} />
          <Row label="Phone" value={phone || "—"} />
        </div>
      </section>

      {/* Current plan */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
          Subscription & billing
        </h2>
        <div className="rounded-card bg-paper-warm border border-charcoal-950/12 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-sage-700">
                Current plan
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-charcoal-950">
                {currentPlan.label}
                {trialActive && plan !== "free" && (
                  <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.14em] text-peach-700">
                    Trial active
                  </span>
                )}
              </div>
              <div className="text-sm text-charcoal-600 mt-1">
                {plan === "free"
                  ? "$0 / forever"
                  : cycle === "annual"
                    ? `$${currentPlan.annual}/year`
                    : `$${currentPlan.monthly}/mo`}
              </div>
            </div>
            <div className="text-xs text-charcoal-600">
              Next billing: <span className="text-charcoal-900 font-semibold">{plan === "free" ? "N/A" : "—"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade */}
      <section>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal-950">
              Upgrade your plan
            </h2>
            <p className="text-sm text-charcoal-600 mt-1">
              Get faster alerts, more searches, and Wren AI.
            </p>
          </div>
          <BillingToggle cycle={cycle} onChange={setCycle} />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} currentPlan={plan} cycle={cycle} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) {
  return (
    <div className="inline-flex items-center bg-paper-warm border border-charcoal-950/10 rounded-pill p-1">
      {(["monthly", "annual"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            "h-8 px-4 rounded-pill text-xs font-semibold transition-colors capitalize",
            cycle === c ? "bg-charcoal-950 text-paper" : "text-charcoal-700",
          )}
        >
          {c}
          {c === "annual" && <span className="ml-1 text-sage-400">−2mo</span>}
        </button>
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  currentPlan,
  cycle,
}: {
  plan: PlanDef;
  currentPlan: Plan;
  cycle: BillingCycle;
}) {
  const isCurrent = plan.id === currentPlan;
  const Icon = plan.icon;
  const price = plan.id === "free" ? 0 : cycle === "annual" ? plan.annual : plan.monthly;
  const priceLabel =
    plan.id === "free" ? "Free" : `$${price}${cycle === "annual" ? "/yr" : "/mo"}`;

  return (
    <div
      className={cn(
        "rounded-card border p-6 flex flex-col gap-4 transition-colors",
        isCurrent
          ? "border-charcoal-950 bg-paper-warm"
          : "border-charcoal-950/12 bg-paper hover:border-charcoal-400",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-sage-700" />
        <div className="font-display text-lg font-bold text-charcoal-950">{plan.label}</div>
        {isCurrent && (
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-sage-200 text-[9px] font-mono uppercase tracking-[0.16em] text-sage-900">
            <Check className="h-2.5 w-2.5" /> Your plan
          </span>
        )}
      </div>

      <div>
        <div className="font-display text-3xl font-bold text-charcoal-950 tabular-nums">
          {priceLabel}
        </div>
        <div className="text-xs text-charcoal-600 mt-1">{plan.tagline}</div>
      </div>

      <ul className="space-y-1.5 text-sm text-charcoal-700">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-sage-700 mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={isCurrent}
        className={cn(
          "mt-auto h-10 rounded-pill text-sm font-semibold transition-colors",
          isCurrent
            ? "bg-paper-warm text-charcoal-500 cursor-default border border-charcoal-950/10"
            : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
        )}
      >
        {isCurrent ? "Current plan" : `Upgrade to ${plan.label}`}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between">
      <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-500">
        {label}
      </div>
      <div className="text-sm font-medium text-charcoal-950">{value}</div>
    </div>
  );
}
