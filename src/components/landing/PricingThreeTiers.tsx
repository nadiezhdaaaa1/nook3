import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "annual";

interface FeatureItem {
  text: string;
  included: boolean;
}

interface Tier {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: string;
  priceAnnual: string;
  priceSuffix: string;
  annualNote?: string;
  cta: string;
  ctaTo: string;
  footnote?: string;
  highlight?: boolean;
  badge?: string;
  features: FeatureItem[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get a feel for what's out there.",
    priceMonthly: "$0",
    priceAnnual: "$0",
    priceSuffix: "forever",
    cta: "Get started",
    ctaTo: "/onboarding",
    features: [
      { text: "1 saved search", included: true },
      { text: "Email alerts (3-hour delay)", included: true },
      { text: "Up to 2 emails per day", included: true },
      { text: "Verified regulated unit badges", included: true },
      { text: "Browse Nook web app", included: true },
      { text: "Real-time alerts", included: false },
      { text: "Wren AI assistant", included: false },
      { text: "Search pause/resume", included: false },
      { text: "Move-out listing tool", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "When you're actively looking.",
    priceMonthly: "$14.99",
    priceAnnual: "$9.92",
    priceSuffix: "/month",
    annualNote: "$119/yr · Save 34%",
    cta: "Start 3-day trial",
    ctaTo: "/signup",
    footnote: "Cancel anytime.",
    highlight: true,
    badge: "Most popular",
    features: [
      { text: "3 saved searches (run parallel)", included: true },
      { text: "Real-time email alerts (within minutes)", included: true },
      { text: "Unlimited email frequency", included: true },
      { text: "Verified regulated unit badges", included: true },
      { text: "Wren AI assistant — chat about any listing", included: true },
      { text: "Pause/resume searches anytime", included: true },
      { text: "Submit move-out listings ($50 reward)", included: true },
      { text: "Email support", included: true },
      { text: "Cross-search Wren comparison", included: false },
    ],
  },
  {
    id: "max",
    name: "Max",
    tagline: "For relocators and serious hunters.",
    priceMonthly: "$29",
    priceAnnual: "$19.08",
    priceSuffix: "/month",
    annualNote: "$229/yr · Save 34%",
    cta: "Start 3-day trial",
    ctaTo: "/signup",
    footnote: "Cancel anytime.",
    features: [
      { text: "Unlimited saved searches", included: true },
      { text: "Real-time email alerts", included: true },
      { text: "Verified regulated unit badges", included: true },
      { text: "Wren AI assistant", included: true },
      { text: "Cross-search Wren comparison", included: true },
      { text: "Roommate mode — 3 user seats", included: true },
      { text: "Pause/resume searches", included: true },
      { text: "Submit move-out listings ($50 reward)", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new cities", included: true },
    ],
  },
];

export function PricingThreeTiers() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const reduce = useReducedMotion();

  return (
    <section
      id="pricing"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-cream)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            Three ways to use Nook.
          </h2>
          <p className="mt-5 text-base lg:text-lg text-[var(--color-charcoal-600)]">
            Start free. Upgrade when you're serious about moving.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex justify-center">
          <div
            className="inline-flex p-1 rounded-pill border"
            style={{
              borderColor: "var(--color-brand-clay)",
              backgroundColor: "var(--color-brand-soft)",
            }}
          >
            <CycleBtn active={cycle === "monthly"} onClick={() => setCycle("monthly")}>
              Monthly
            </CycleBtn>
            <CycleBtn active={cycle === "annual"} onClick={() => setCycle("annual")}>
              Annual
              <span
                className="ml-2 px-1.5 py-0.5 rounded-pill text-[10px] font-mono uppercase tracking-[0.12em]"
                style={{
                  backgroundColor: "var(--color-brand-sage)",
                  color: "var(--color-brand-charcoal)",
                }}
              >
                Save 34%
              </span>
            </CycleBtn>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative rounded-card border p-8 flex flex-col h-full",
                t.highlight && "lg:scale-[1.02] lg:-my-2 shadow-elevated",
              )}
              style={{
                borderColor: t.highlight
                  ? "var(--color-brand-terracotta)"
                  : "var(--color-brand-clay)",
                backgroundColor: t.highlight
                  ? "var(--color-brand-charcoal)"
                  : "var(--color-brand-soft)",
                color: t.highlight ? "var(--color-brand-cream)" : "var(--color-brand-charcoal)",
              }}
            >
              {t.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-pill text-[10px] font-mono uppercase tracking-[0.18em] font-semibold whitespace-nowrap"
                  style={{
                    backgroundColor: "var(--color-brand-terracotta)",
                    color: "white",
                  }}
                >
                  {t.badge}
                </span>
              )}

              <div
                className="text-[11px] font-mono uppercase tracking-[0.18em] font-semibold"
                style={{
                  color: t.highlight
                    ? "var(--color-brand-sage)"
                    : "var(--color-charcoal-500)",
                }}
              >
                {t.name}
              </div>
              <p
                className="mt-2 text-sm"
                style={{
                  color: t.highlight
                    ? "color-mix(in oklab, var(--color-brand-cream) 75%, transparent)"
                    : "var(--color-charcoal-600)",
                }}
              >
                {t.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium tabular-nums">
                  {cycle === "monthly" ? t.priceMonthly : t.priceAnnual}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: t.highlight
                      ? "color-mix(in oklab, var(--color-brand-cream) 65%, transparent)"
                      : "var(--color-charcoal-500)",
                  }}
                >
                  {t.priceSuffix}
                </span>
              </div>
              {cycle === "annual" && t.annualNote && (
                <div
                  className="mt-1 text-[12px] font-mono"
                  style={{ color: "var(--color-brand-sage)" }}
                >
                  {t.annualNote}
                </div>
              )}

              <Link
                to={t.ctaTo}
                className={cn(
                  "mt-7 inline-flex items-center justify-center h-12 px-6 rounded-pill text-sm font-semibold transition-all hover:opacity-90",
                )}
                style={{
                  backgroundColor: t.highlight
                    ? "var(--color-brand-sage)"
                    : "var(--color-brand-charcoal)",
                  color: "white",
                }}
              >
                {t.cta}
              </Link>
              {t.footnote && (
                <div
                  className="mt-2 text-center text-[12px]"
                  style={{
                    color: t.highlight
                      ? "color-mix(in oklab, var(--color-brand-cream) 60%, transparent)"
                      : "var(--color-charcoal-500)",
                  }}
                >
                  {t.footnote}
                </div>
              )}

              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-start gap-2.5 text-sm"
                    style={{
                      color: f.included
                        ? t.highlight
                          ? "var(--color-brand-cream)"
                          : "var(--color-charcoal-800)"
                        : t.highlight
                          ? "color-mix(in oklab, var(--color-brand-cream) 40%, transparent)"
                          : "var(--color-charcoal-400)",
                    }}
                  >
                    {f.included ? (
                      <Check
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{
                          color: t.highlight
                            ? "var(--color-brand-sage)"
                            : "var(--color-brand-terracotta)",
                        }}
                      />
                    ) : (
                      <X className="h-4 w-4 mt-0.5 shrink-0 opacity-50" />
                    )}
                    <span className={cn(!f.included && "line-through opacity-70")}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto text-center space-y-2 text-sm text-[var(--color-charcoal-600)]">
          <p>All plans include 24/7 monitoring of the rental market in your city.</p>
          <p>Cancel within 7 days for a full refund. After that, prorated.</p>
        </div>
      </div>
    </section>
  );
}

function CycleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center h-10 px-5 rounded-pill text-sm font-semibold transition-colors",
        active ? "text-white" : "text-[var(--color-charcoal-600)] hover:text-[var(--color-brand-charcoal)]",
      )}
      style={active ? { backgroundColor: "var(--color-brand-charcoal)" } : undefined}
    >
      {children}
    </button>
  );
}
