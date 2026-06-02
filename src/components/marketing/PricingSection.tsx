import { Check, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Eyebrow } from "./Eyebrow";
import { SectionReveal } from "./anim/SectionReveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Start hunting today.",
    features: [
      "Up to 2 saved searches",
      "Email alerts",
      "Daily digest",
      "104+ sources monitored",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$12",
    cadence: "per month",
    blurb: "Real-time alerts and city records.",
    features: [
      "Unlimited saved searches",
      "Instant email alerts",
      "Rent-stabilized verification",
      "Building violation history",
      "Price drop alerts",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative bg-paper-warm py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-40 pattern-fade-mask pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <SectionReveal className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 mb-6 max-w-3xl mx-auto">
            One apartment{" "}
            <span className="accent-italic">pays for years.</span>
          </h2>
          <p className="text-lg text-charcoal-600 max-w-xl mx-auto mb-16">
            Find a place under market once and Nook pays for itself for a decade.
          </p>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((p) => (
            <SectionReveal key={p.name}>
              <div
                className={
                  p.highlighted
                    ? "relative bg-charcoal-950 text-paper rounded-card p-8 lg:p-10 shadow-elevated border-2 border-sage-500"
                    : "relative bg-surface-elevated rounded-card p-8 lg:p-10 border border-border"
                }
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-8 inline-flex items-center px-3 py-1 rounded-pill bg-sage-500 text-paper text-[10px] font-mono uppercase tracking-[0.15em] font-semibold">
                    Most popular
                  </div>
                )}
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold mb-3 opacity-70">
                  {p.name}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display font-bold text-6xl tracking-[-0.02em]">{p.price}</span>
                  <span className="text-sm opacity-60">/ {p.cadence}</span>
                </div>
                <p className={p.highlighted ? "text-paper/70 mb-8" : "text-charcoal-600 mb-8"}>
                  {p.blurb}
                </p>
                <ul className="space-y-3 mb-10">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        className={
                          p.highlighted
                            ? "h-4 w-4 text-sage-300 shrink-0 mt-0.5"
                            : "h-4 w-4 text-sage-700 shrink-0 mt-0.5"
                        }
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.href}
                  className={
                    p.highlighted
                      ? "group inline-flex w-full items-center justify-center gap-2 h-12 rounded-pill bg-sage-500 text-paper text-sm font-semibold hover:bg-sage-700 transition-colors"
                      : "group inline-flex w-full items-center justify-center gap-2 h-12 rounded-pill border-2 border-charcoal-950 text-charcoal-950 text-sm font-semibold hover:bg-charcoal-950 hover:text-paper transition-colors"
                  }
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
