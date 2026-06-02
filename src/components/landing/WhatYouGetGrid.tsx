import { ShieldCheck, Zap, Filter, Sparkles, Layers, Pause } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified regulated units",
    body: "We cross-check every listing against public regulation databases. If a unit is genuinely rent-stabilized or rent-controlled, you'll see the badge. If a landlord is claiming it falsely — you'll know.",
  },
  {
    icon: Zap,
    title: "First-mover advantage",
    body: "The best apartments are gone in 2–6 hours. We notify you within minutes of a listing going live — so you're inquiring before the crowd shows up to the open house.",
  },
  {
    icon: Filter,
    title: "Filters that actually filter",
    body: "Pet-friendly that means pet-friendly. Budget that means budget. We strip out 'starting from' bait pricing and listings that don't match your hard requirements.",
  },
  {
    icon: Sparkles,
    title: "Wren AI on every match",
    body: "Ask Wren about any listing — 'is this overpriced?', 'how's the neighborhood after dark?', 'what about the commute?'. You get answers, not just listings.",
  },
  {
    icon: Layers,
    title: "3 searches at once",
    body: "Looking in one neighborhood but also open to another? Considering a 1BR or splitting a 2BR? Run parallel searches without resetting filters every time.",
  },
  {
    icon: Pause,
    title: "Pause whenever",
    body: "Took a break to think? Pause your search. No alerts while you're paused. Resume in one click when you're ready again.",
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
