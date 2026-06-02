import { ShieldCheck, Zap, Filter, Sparkles, Layers, Pause } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified regulated units",
    body: "Every listing cross-checked against public databases. Real regulation gets a badge. Fake claims don't.",
  },
  {
    icon: Zap,
    title: "First-mover advantage",
    body: "Best apartments vanish in hours. We ping you within minutes — before the open house crowd shows up.",
  },
  {
    icon: Filter,
    title: "Filters that actually filter",
    body: "Pet-friendly that means pet-friendly. Budget that means budget. No bait pricing, no fake matches.",
  },
  {
    icon: Sparkles,
    title: "Wren AI on every match",
    body: "Ask Wren anything about a listing — price, neighborhood, commute. Answers, not just listings.",
  },
  {
    icon: Layers,
    title: "3 searches at once",
    body: "Two neighborhoods? 1BR or split 2BR? Run searches in parallel, no filter resets.",
  },
  {
    icon: Pause,
    title: "Pause whenever",
    body: "Need a break? Pause. No alerts while paused. One click to resume.",
  },
];

export function WhatYouGetGrid() {
  const reduce = useReducedMotion();
  return (
    <section
      id="what"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-cream)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>What's inside</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            More than alerts.{" "}
            <span className="italic text-[var(--color-brand-sage)]">A full search assistant.</span>
          </h2>
          <p className="mt-5 text-base lg:text-lg text-[var(--color-charcoal-600)]">
            Here's what Nook does that a free site refresh doesn't.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-card border p-7 hover-lift"
              style={{
                borderColor: "var(--color-brand-clay)",
                backgroundColor: "var(--color-brand-soft)",
              }}
            >
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-pill"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--color-brand-terracotta) 14%, transparent)",
                  color: "var(--color-brand-terracotta)",
                }}
              >
                <it.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-medium text-[var(--color-brand-charcoal)] leading-tight">
                {it.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-charcoal-700)]">
                {it.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
