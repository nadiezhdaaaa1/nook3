import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { useLandingStore } from "@/lib/landing/landingStore";
import { getCity } from "@/data/cities";

export function HowItWorksThreeSteps() {
  const reduce = useReducedMotion();
  const { city } = useLandingStore();
  const cityConfig = getCity(city)!;
  const samplePills =
    Object.values(cityConfig.neighborhoodGroups ?? {})[0]?.slice(0, 4) ?? [
      "Williamsburg",
      "East Village",
      "Park Slope",
      "Astoria",
    ];

  return (
    <section
      id="how"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-soft)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            From scrolling to signing —{" "}
            <span className="italic text-[var(--color-brand-sage)]">in days, not months.</span>
          </h2>
          <p className="mt-5 text-base lg:text-lg text-[var(--color-charcoal-600)]">
            Three things happen the moment you sign up.
          </p>
        </div>

        <div className="mt-16 lg:mt-20 grid gap-10 lg:gap-8 lg:grid-cols-3">
          <Step
            n="01"
            title="Tell us what you want"
            badge="Set up in 60 seconds"
            body="Budget, bedrooms, neighborhoods, deal-breakers. Save up to 3 searches at once."
            reduce={reduce}
            mock={<FormMock pills={samplePills} />}
            delay={0}
          />
          <Step
            n="02"
            title="We do the watching"
            badge="Updates every few minutes"
            body="We scan the market 24/7 and check every listing against public records — violations, regulation status, complaints. The noise gets filtered out."
            reduce={reduce}
            mock={<FeedMock />}
            delay={0.1}
          />
          <Step
            n="03"
            title="You get pinged. You go see it."
            badge="Alerts within 30 minutes"
            body="Email alert the second a match drops. Full address, real rent, one-tap to contact the landlord. You're usually first."
            reduce={reduce}
            mock={<NotificationMock />}
            delay={0.2}
          />
        </div>

        <div className="mt-20 text-center">
          <div className="font-display text-xl lg:text-2xl text-[var(--color-brand-charcoal)]">
            Most users find their place{" "}
            <span className="italic text-[var(--color-brand-sage)]">within 3 weeks.</span>
          </div>
          <Link
            to="/onboarding"
            className="mt-6 group inline-flex items-center justify-center gap-2 h-13 px-7 rounded-pill text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--color-brand-terracotta)" }}
          >
            Start free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <div className="mt-3 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-charcoal-500)]">
            Email alerts included
          </div>
        </div>
      </div>
    </section>
  );
}

interface StepProps {
  n: string;
  title: string;
  body: string;
  badge: string;
  mock: React.ReactNode;
  delay: number;
  reduce: boolean | null;
}

function Step({ n, title, body, badge, mock, delay, reduce }: StepProps) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-card border p-7 flex flex-col h-full"
      style={{
        borderColor: "var(--color-brand-clay)",
        backgroundColor: "var(--color-brand-cream)",
      }}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-medium text-[var(--color-brand-terracotta)] tabular-nums">
          {n}
        </span>
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-charcoal-500)]">
          Step {n}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-medium text-[var(--color-brand-charcoal)] leading-tight">
        {title}
      </h3>
      <p className="mt-3 text-sm text-[var(--color-charcoal-700)] leading-relaxed">{body}</p>

      <div className="mt-6 flex-1">{mock}</div>

      <div
        className="mt-5 inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-pill text-[11px] font-mono uppercase tracking-[0.14em] font-semibold"
        style={{
          backgroundColor: "color-mix(in oklab, var(--color-brand-sage) 18%, transparent)",
          color: "var(--color-sage-900)",
        }}
      >
        <Check className="h-3 w-3" />
        {badge}
      </div>
    </motion.div>
  );
}

function FormMock({ pills }: { pills: string[] }) {
  return (
    <div
      className="rounded-md border p-4 space-y-4"
      style={{
        borderColor: "var(--color-brand-clay)",
        backgroundColor: "var(--color-brand-soft)",
      }}
    >
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-charcoal-500)]">
          Budget
        </div>
        <div className="mt-2 relative h-2 rounded-pill bg-[var(--color-brand-clay)]">
          <div
            className="absolute top-0 left-[20%] h-2 rounded-pill"
            style={{ width: "55%", backgroundColor: "var(--color-brand-charcoal)" }}
          />
          <span
            className="absolute -top-1.5 left-[20%] h-5 w-5 rounded-full border-2 border-white"
            style={{ backgroundColor: "var(--color-brand-charcoal)" }}
          />
          <span
            className="absolute -top-1.5 left-[73%] h-5 w-5 rounded-full border-2 border-white"
            style={{ backgroundColor: "var(--color-brand-charcoal)" }}
          />
        </div>
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-charcoal-500)]">
          Bedrooms
        </div>
        <div className="mt-2 inline-flex gap-1.5 text-[11px]">
          {["1+", "2", "3"].map((b, i) => (
            <span
              key={b}
              className={`px-2.5 py-1 rounded-pill border ${
                i === 0 ? "text-white" : ""
              }`}
              style={{
                borderColor: "var(--color-brand-clay)",
                backgroundColor: i === 0 ? "var(--color-brand-charcoal)" : "transparent",
                color: i === 0 ? "white" : "var(--color-charcoal-700)",
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-charcoal-500)]">
          Neighborhoods
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          {pills.map((p) => (
            <span
              key={p}
              className="px-2.5 py-1 rounded-pill border text-[var(--color-charcoal-700)]"
              style={{ borderColor: "var(--color-brand-clay)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-1.5 text-[11px] text-[var(--color-charcoal-700)]">
        <Checkrow>Pet-friendly</Checkrow>
        <Checkrow>Rent-regulated only</Checkrow>
        <Checkrow>No broker fee</Checkrow>
      </div>
    </div>
  );
}

function Checkrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mr-3">
      <span
        className="h-3.5 w-3.5 rounded-tight inline-flex items-center justify-center"
        style={{ backgroundColor: "var(--color-brand-charcoal)" }}
      >
        <Check className="h-2.5 w-2.5 text-white" />
      </span>
      {children}
    </div>
  );
}

function FeedMock() {
  const lines = [
    "Scanning rental market…",
    "Checking building records…",
    "Verifying regulated units…",
    "Filtering for your match…",
  ];
  return (
    <div
      className="rounded-md border p-4 space-y-2.5"
      style={{
        borderColor: "var(--color-brand-clay)",
        backgroundColor: "var(--color-brand-soft)",
      }}
    >
      {lines.map((l, i) => (
        <div
          key={l}
          className="flex items-center gap-2.5 text-[12px] text-[var(--color-charcoal-700)]"
        >
          <span className="relative h-2 w-2">
            <span
              className="absolute inset-0 rounded-pill animate-ping opacity-75"
              style={{ backgroundColor: "var(--color-brand-terracotta)", animationDelay: `${i * 0.4}s` }}
            />
            <span
              className="relative block h-2 w-2 rounded-pill"
              style={{ backgroundColor: "var(--color-brand-terracotta)" }}
            />
          </span>
          <span className="font-mono text-[11px]">{l}</span>
        </div>
      ))}
      <div
        className="mt-3 pt-3 border-t text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-charcoal-500)]"
        style={{ borderColor: "var(--color-brand-clay)" }}
      >
        Last sweep · 47 seconds ago
      </div>
    </div>
  );
}

function NotificationMock() {
  return (
    <div className="relative">
      <div
        className="rounded-[28px] border-[6px] p-3"
        style={{ borderColor: "var(--color-brand-charcoal)" }}
      >
        <div
          className="rounded-2xl p-3.5 space-y-1.5"
          style={{ backgroundColor: "var(--color-brand-cream)" }}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-charcoal-500)]">
            <span className="font-semibold text-[var(--color-brand-charcoal)]">Nook</span>
            <span>now</span>
          </div>
          <div className="font-display text-[15px] font-medium text-[var(--color-brand-charcoal)]">
            New match 🏠
          </div>
          <div className="text-[12px] text-[var(--color-charcoal-700)]">
            $2,850 · 2BR · Rent-stabilized
          </div>
          <div className="text-[11px] text-[var(--color-brand-terracotta)] font-semibold">
            Tap to view →
          </div>
        </div>
      </div>
    </div>
  );
}
