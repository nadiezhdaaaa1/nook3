import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, Mail, Zap } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { AutoRenewalDisclosure } from "@/components/legal/AutoRenewalDisclosure";
import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";
import { TrialModal } from "@/components/onboarding/TrialModal";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/pricing")({
  component: PricingScreen,
});

const PLANS: Array<{
  id: Plan;
  name: string;
  monthly: number;
  annual: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
}> = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    tagline: "Basic alerts for browsing",
    features: ["2 email alerts/day", "3-hour delay", "Top matches only"],
  },
  {
    id: "premium",
    name: "Premium",
    monthly: 14.99,
    annual: 124,
    tagline: "Real-time alerts, zero delay",
    features: ["Unlimited email", "Real-time", "1 text/day"],
    highlight: true,
  },
  {
    id: "max",
    name: "Max",
    monthly: 29,
    annual: 239,
    tagline: "First to every listing",
    features: ["Unlimited texts", "Upcoming listings forecast", "Roommate mode"],
  },
];

function PricingScreen() {
  const navigate = useNavigate();
  const { billingCycle, set } = useOnboardingStore();
  const [trialFor, setTrialFor] = useState<Plan | null>(null);

  const handleSelect = (plan: Plan) => {
    if (plan === "free") {
      set("selectedPlan", "free");
      set("trialActive", false);
      navigate({ to: "/onboarding/success" });
    } else {
      setTrialFor(plan);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950">
          Choose your <span className="accent-italic">plan</span>
        </h1>
        <p className="mt-3 text-charcoal-600">Start free, upgrade anytime.</p>

        <div className="mt-6 inline-flex rounded-pill border border-border p-1 bg-surface-elevated">
          {(["monthly", "annual"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("billingCycle", c)}
              className={cn(
                "h-9 px-4 rounded-pill text-xs font-semibold uppercase tracking-wider transition-colors",
                billingCycle === c ? "bg-charcoal-950 text-paper" : "text-charcoal-600",
              )}
            >
              {c} {c === "annual" && <span className="text-peach-300 ml-1">-31%</span>}
            </button>
          ))}
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const price =
            billingCycle === "annual" && p.annual > 0
              ? `$${p.annual}/yr`
              : p.monthly === 0
                ? "$0"
                : `$${p.monthly}/mo`;
          return (
            <div
              key={p.id}
              className={cn(
                "p-6 rounded-card border-2 flex flex-col",
                p.highlight
                  ? "border-charcoal-950 bg-surface-elevated shadow-elevated"
                  : "border-border bg-surface-elevated",
              )}
            >
              {p.highlight && (
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-peach-700 mb-2">
                  Most popular
                </div>
              )}
              <div className="font-display text-2xl font-bold text-charcoal-950">{p.name}</div>
              <div className="text-sm text-charcoal-600 mt-1">{p.tagline}</div>
              <div className="font-display text-3xl font-bold mt-4 text-charcoal-950">{price}</div>
              <ul className="mt-4 space-y-2 text-sm text-charcoal-700 flex-1">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSelect(p.id)}
                className={cn(
                  "mt-6 h-11 rounded-pill text-sm font-semibold transition-colors",
                  p.highlight
                    ? "bg-peach-700 text-paper hover:bg-peach-900"
                    : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
                )}
              >
                {p.id === "free" ? "Continue with free" : "Start 3-day free trial"}
              </button>
              {p.id !== "free" && (
                <AutoRenewalDisclosure
                  price={billingCycle === "annual" ? `$${p.annual}` : `$${p.monthly}`}
                  cadence={billingCycle === "annual" ? "year" : "month"}
                  align="left"
                />
              )}
            </div>
          );
        })}
      </div>

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
