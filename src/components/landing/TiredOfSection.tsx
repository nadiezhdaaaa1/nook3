import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const CARDS = [
  {
    pain: "Refreshing rental sites every 30 minutes hoping something new appears.",
    fix: "Get a text when it does.",
  },
  {
    pain: "Showing up to a viewing and finding the listing was a bait price.",
    fix: "We strip out 'starting from' pricing before you ever see the listing.",
  },
  {
    pain: "Asking a landlord about rent-stabilization and hearing 'oh that's not really regulated'.",
    fix: "We verify against public records. The badge means it's real.",
  },
  {
    pain: "Losing the apartment because you saw it 4 hours after it posted.",
    fix: "Median alert time: minutes after listing goes live.",
  },
];

export function TiredOfSection() {
  const reduce = useReducedMotion();
  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-brand-charcoal)" }}
    >
      <div
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--color-brand-terracotta)" }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: "var(--color-brand-sage)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow color="cream">Built for active renters</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-cream)]">
            You probably know this feeling.
          </h2>
          <p className="mt-5 text-base lg:text-lg italic text-[var(--color-brand-sage)]">
            Apartment hunting is broken. We rebuilt the part you actually use.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.pain}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-card p-7 flex flex-col gap-5 border"
              style={{
                borderColor: "color-mix(in oklab, var(--color-brand-cream) 14%, transparent)",
                backgroundColor: "color-mix(in oklab, var(--color-brand-cream) 5%, transparent)",
              }}
            >
              <p className="font-display text-xl leading-snug text-[var(--color-brand-cream)]">
                {c.pain}
              </p>
              <p className="text-sm text-[var(--color-brand-sage)] leading-relaxed mt-auto">
                → {c.fix}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="font-display text-2xl lg:text-3xl text-[var(--color-brand-cream)] leading-snug max-w-xl">
            Start free — see what comes in this week.
          </div>
          <Link
            to="/onboarding"
            className="group inline-flex items-center justify-center gap-2 h-13 px-7 rounded-pill text-sm font-semibold text-[var(--color-brand-charcoal)] transition-all hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "var(--color-brand-cream)" }}
          >
            Get started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
