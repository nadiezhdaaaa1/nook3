import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { AutoRenewalDisclosure } from "@/components/legal/AutoRenewalDisclosure";
import { useLandingStore } from "@/lib/landing/landingStore";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "annual";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    tagline: "Start hunting today.",
    features: [
      "2 email alerts/day",
      "3-hour delay",
      "Top matches only",
      "104+ sources monitored",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    monthly: 14.99,
    annual: 124,
    tagline: "Real-time alerts, zero delay.",
    features: [
      "Unlimited email alerts",
      "Real-time (median 47s)",
      "Rent-stabilized verification",
      "DOB / HPD violations",
      "Price drop alerts",
      "Priority support",
    ],
    cta: "Start 3-day free trial",
    highlight: true,
  },
  {
    id: "max",
    name: "Max",
    monthly: 29,
    annual: 239,
    tagline: "First to every listing.",
    features: [
      "Unlimited email alerts",
      "Upcoming-listings forecast",
      "Roommate mode (2 profiles)",
      "Direct landlord intros",
      "Concierge tour booking",
    ],
    cta: "Start 3-day free trial",
    highlight: false,
  },
] as const;

export function PricingLanding() {
  const { city } = useLandingStore();
  const cityConfig = getCity(city);
  const [cycle, setCycle] = useState<Cycle>("annual");

  const priceLabel = (p: (typeof PLANS)[number]) => {
    if (p.monthly === 0) return { big: "$0", unit: "forever" };
    if (cycle === "annual") {
      const perMonth = (p.annual / 12).toFixed(2).replace(/\.00$/, "");
      return { big: `$${perMonth}`, unit: "/mo · billed annually" };
    }
    return { big: `$${p.monthly}`, unit: "/mo" };
  };

  const savings = (p: (typeof PLANS)[number]) => {
    if (p.monthly === 0) return null;
    const yearly = p.monthly * 12;
    const pct = Math.round(((yearly - p.annual) / yearly) * 100);
    return pct;
  };

  return (
    <section
      id="pricing"
      className="relative bg-paper-warm py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 pattern-dots opacity-40 pattern-fade-mask pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 leading-[1.05]">
            One apartment{" "}
            <span className="accent-italic">pays for years.</span>
          </h2>
          {cityConfig?.pricingAnchor && (
            <p className="mt-6 text-lg text-charcoal-700 leading-relaxed max-w-2xl">
              <span className="font-semibold text-charcoal-950">
                {cityConfig.displayName}:
              </span>{" "}
              {cityConfig.pricingAnchor}
            </p>
          )}
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-10 lg:mb-12">
          <div
            role="radiogroup"
            aria-label="Billing cycle"
            className="inline-flex rounded-pill border border-border p-1 bg-surface-elevated"
          >
            {(["monthly", "annual"] as Cycle[]).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={cycle === c}
                onClick={() => setCycle(c)}
                className={cn(
                  "px-5 h-9 rounded-pill text-sm font-semibold transition-colors flex items-center gap-2",
                  cycle === c
                    ? "bg-charcoal-950 text-paper"
                    : "text-charcoal-700 hover:text-charcoal-950",
                )}
              >
                <span className="capitalize">{c}</span>
                {c === "annual" && (
                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded",
                      cycle === c
                        ? "bg-sage-500 text-paper"
                        : "bg-sage-100 text-sage-700",
                    )}
                  >
                    Save 30%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-6 max-w-6xl mx-auto">
          {PLANS.map((p) => {
            const { big, unit } = priceLabel(p);
            const save = savings(p);
            return (
              <div
                key={p.id}
                className={cn(
                  "relative rounded-card p-8 lg:p-9 flex flex-col",
                  p.highlight
                    ? "bg-charcoal-950 text-paper shadow-elevated border-2 border-sage-500 md:scale-[1.02]"
                    : "bg-surface-elevated text-charcoal-950 border border-border",
                )}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-8 inline-flex items-center px-3 py-1 rounded-pill bg-sage-500 text-paper text-[10px] font-mono uppercase tracking-[0.15em] font-semibold">
                    Most popular
                  </div>
                )}
                <div
                  className={cn(
                    "text-[11px] font-mono uppercase tracking-[0.2em] font-semibold mb-3",
                    p.highlight ? "text-paper/70" : "text-charcoal-600",
                  )}
                >
                  {p.name}
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display font-bold text-5xl lg:text-6xl tracking-[-0.02em]">
                    {big}
                  </span>
                </div>
                <div
                  className={cn(
                    "text-xs mb-2",
                    p.highlight ? "text-paper/60" : "text-charcoal-500",
                  )}
                >
                  {unit}
                </div>
                {save !== null && cycle === "annual" && (
                  <div
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-[0.14em] font-semibold mb-4",
                      p.highlight ? "text-sage-300" : "text-sage-700",
                    )}
                  >
                    Save ${(p.monthly * 12 - p.annual).toFixed(0)}/yr · {save}% off
                  </div>
                )}
                <p
                  className={cn(
                    "mb-6 text-sm",
                    p.highlight ? "text-paper/70" : "text-charcoal-600",
                  )}
                >
                  {p.tagline}
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm leading-snug"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0 mt-0.5",
                          p.highlight ? "text-sage-300" : "text-sage-700",
                        )}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/onboarding/step/$step"
                  params={{ step: "1" }}
                  className={cn(
                    "group inline-flex w-full items-center justify-center gap-2 h-12 rounded-pill text-sm font-semibold transition-colors",
                    p.highlight
                      ? "bg-sage-500 text-paper hover:bg-sage-700"
                      : "border-2 border-charcoal-950 text-charcoal-950 text-charcoal-950 hover:bg-charcoal-950 hover:text-paper",
                  )}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                {p.monthly > 0 ? (
                  <AutoRenewalDisclosure
                    price={cycle === "annual" ? `$${p.annual}` : `$${p.monthly}`}
                    cadence={cycle === "annual" ? "year" : "month"}
                    tone={p.highlight ? "onDark" : "default"}
                  />
                ) : (
                  p.highlight && (
                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-paper/50 text-center mt-3">
                      No credit card required
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-xs text-charcoal-500">
          Cancel anytime · Refund within 7 days · Pause when you find a place
        </div>
      </div>
    </section>
  );
}
