import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eye, ShieldCheck, Send } from "lucide-react";
import { Eyebrow } from "./Eyebrow";
import { AnimatedHeading } from "./anim/AnimatedHeading";

const steps = [
  {
    n: "01",
    icon: Eye,
    title: "We watch every source",
    body: "100+ NYC rental sites monitored around the clock. Brokerages, listing platforms, private portals — nothing slips by.",
    bullets: ["Compass · Corcoran · Serhant", "StreetEasy · RentHop · Zillow", "StuyTown · Glenwood · Avalon"],
    tag: "Live 24/7 · +90 more",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "We check city records",
    body: "Every listing verified against official NYC data before it hits your inbox.",
    bullets: ["Rent-stabilized status", "DOB violations · 311 complaints", "Health inspections · Bedbug history"],
    tag: "DOB · HPD · HCR · DOHMH",
  },
  {
    n: "03",
    icon: Send,
    title: "You hear about it first",
    body: "Email and text the second a listing matches your filters. No noise, no delay.",
    bullets: ["Email alerts", "Delivered in seconds", "One-tap to view"],
    tag: "Average lead: 18 minutes",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Horizontal pan: -0% -> -66.66% (3 panels)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section id="how" ref={ref} className="relative bg-surface" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 pt-20 pb-6 shrink-0">
          <Eyebrow>How it works</Eyebrow>
          <AnimatedHeading
            as="h2"
            className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 max-w-3xl"
          >
            We watch every source, check every listing, and{" "}
            <span className="accent-italic">alert you first.</span>
          </AnimatedHeading>
        </div>

        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-6 lg:gap-10 px-6 lg:px-10 pb-12">
            {steps.map((s) => (
              <StepCard key={s.n} {...s} />
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 pb-6 shrink-0">
          <div className="h-1 bg-charcoal-100 rounded-pill overflow-hidden">
            <motion.div
              style={{ width: useTransform(scrollYProgress, [0, 1], ["33%", "100%"]) }}
              className="h-full bg-sage-500 rounded-pill"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  body,
  bullets,
  tag,
}: {
  n: string;
  icon: typeof Eye;
  title: string;
  body: string;
  bullets: string[];
  tag: string;
}) {
  return (
    <div className="shrink-0 w-[85vw] lg:w-[60vw] max-w-3xl bg-surface-elevated rounded-card border border-border shadow-card overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1.2fr]">
        <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-sage-700 font-semibold">
              Step {n}
            </div>
            <div className="w-10 h-10 rounded-pill bg-sage-100 flex items-center justify-center">
              <Icon className="h-5 w-5 text-sage-700" />
            </div>
          </div>
          <h3 className="font-display font-bold text-3xl lg:text-4xl tracking-[-0.02em] text-charcoal-950 mb-4 leading-tight">
            {title}
          </h3>
          <p className="text-charcoal-600 leading-relaxed">{body}</p>
        </div>

        <div className="p-8 lg:p-12 bg-paper-warm relative">
          <div className="absolute inset-0 pattern-grid opacity-40 pointer-events-none" />
          <ul className="relative space-y-3 mb-6">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-charcoal-800">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-pill bg-sage-500 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="relative inline-flex items-center px-3 py-1.5 rounded-pill bg-charcoal-950 text-paper text-[11px] font-mono uppercase tracking-[0.15em] font-semibold">
            {tag}
          </div>
        </div>
      </div>
    </div>
  );
}
