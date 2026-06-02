import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

/* ----------------------------- shared bits ----------------------------- */

const ease = [0.16, 1, 0.3, 1] as const;

function useCardVariants(): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };
}

function Divider({ tone = "sage" }: { tone?: "sage" | "cream" }) {
  return (
    <div
      className="h-px w-10 my-4"
      style={{
        backgroundColor:
          tone === "sage" ? "var(--color-brand-sage)" : "color-mix(in oklab, var(--color-brand-cream) 60%, transparent)",
      }}
    />
  );
}

function InlineQuote({
  children,
  markColor,
  className = "",
}: {
  children: string;
  markColor: string;
  className?: string;
}) {
  return (
    <blockquote className={className}>
      <span
        aria-hidden="true"
        className="font-display"
        style={{ color: markColor, fontWeight: 500 }}
      >
        “
      </span>
      {children}
      <span
        aria-hidden="true"
        className="font-display"
        style={{ color: markColor, fontWeight: 500 }}
      >
        ”
      </span>
    </blockquote>
  );
}

/* --------------------------------- data -------------------------------- */

const HERO = {
  quote:
    "I'll be honest — I signed up expecting to cancel after the trial. But the alerts were actually relevant. I got 4 matches in the first week that fit my exact budget. Two were apartments I would have missed.",
  name: "Jake M.",
  meta: "Premium · 3 months",
};

const STAT_MAYA = {
  big: "4 days",
  sub: "from setup to signed lease.",
  quote:
    "Set up Nook on Friday, got a match Saturday morning at 8am, signed the lease Tuesday. The rent-stabilized badge sold me.",
  name: "Maya R.",
  meta: "Williamsburg",
};

const STAT_DANIEL = {
  big: "12 min",
  sub: "from listing to first inquiry.",
  quote:
    "Sent me a 1BR at $2,400 twelve minutes after it posted. Got there at noon. Signed the lease that night.",
  name: "Daniel K.",
  meta: "Brooklyn",
};

const COMPACT_PRIYA = {
  quote:
    "The 'pet-friendly' filter actually means pet-friendly. I had a hard time with other apps' pet filters.",
  name: "Priya S.",
  bg: "sage" as const,
};

const COMPACT_SARA = {
  quote:
    "The AI assistant is genuinely useful. I sent it a listing and it pulled the building's permit history and recent rent changes — made me ask the landlord questions I wouldn't have thought of.",
  name: "Sara L.",
  bg: "cream" as const,
};

const COMPACT_CHRIS = {
  quote:
    "Moving cross-country, didn't know which neighborhood I wanted. Set up three searches in different areas. Killed two after a week, found my place through the third.",
  name: "Chris D.",
  bg: "terracotta" as const,
};

/* ------------------------------- cards --------------------------------- */

function HeroCard() {
  const variants = useCardVariants();
  return (
    <motion.figure
      variants={variants}
      className="relative overflow-hidden rounded-[16px] p-10 transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgba(194,102,78,0.35)]"
      style={{ backgroundColor: "var(--color-brand-charcoal)" }}
    >
      {/* decorative background quote */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -left-2 font-display select-none pointer-events-none"
        style={{
          fontSize: "180px",
          lineHeight: 1,
          color: "var(--color-brand-sage)",
          opacity: 0.12,
          fontStyle: "italic",
        }}
      >
        “
      </span>

      <div
        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] relative"
        style={{ color: "var(--color-brand-sage)" }}
      >
        <Star className="h-3 w-3 fill-current" />
        Featured
      </div>

      <blockquote
        className="relative mt-5 font-display italic"
        style={{
          color: "var(--color-brand-cream)",
          fontSize: "22px",
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        <span
          aria-hidden="true"
          style={{ color: "var(--color-brand-terracotta)", fontWeight: 500 }}
        >
          “
        </span>
        {HERO.quote}
        <span
          aria-hidden="true"
          style={{ color: "var(--color-brand-terracotta)", fontWeight: 500 }}
        >
          ”
        </span>
      </blockquote>

      <Divider tone="cream" />

      <figcaption className="relative">
        <div
          className="text-[15px] font-medium"
          style={{ color: "var(--color-brand-cream)", fontFamily: "var(--font-sans, Inter), sans-serif" }}
        >
          {HERO.name}
        </div>
        <div
          className="text-[13px] mt-0.5"
          style={{ color: "var(--color-brand-sage)", fontFamily: "var(--font-sans, Inter), sans-serif" }}
        >
          {HERO.meta}
        </div>
      </figcaption>
    </motion.figure>
  );
}

function StatCard({ data }: { data: typeof STAT_MAYA }) {
  const variants = useCardVariants();
  return (
    <motion.figure
      variants={variants}
      className="rounded-[16px] border p-8 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-18px_rgba(43,37,33,0.25)]"
      style={{
        backgroundColor: "var(--color-brand-soft)",
        borderColor: "var(--color-brand-clay)",
      }}
    >
      <div
        className="font-display leading-[0.95] tracking-[-0.02em]"
        style={{
          color: "var(--color-brand-charcoal)",
          fontSize: "clamp(48px, 6vw, 68px)",
          fontWeight: 500,
        }}
      >
        {data.big}
      </div>
      <div
        className="mt-2 text-[16px]"
        style={{
          color: "var(--color-brand-charcoal)",
          fontFamily: "var(--font-sans, Inter), sans-serif",
        }}
      >
        {data.sub}
      </div>

      <InlineQuote
        markColor="var(--color-brand-terracotta)"
        className="mt-5 font-display italic text-[15px] leading-[1.55]"
      >
        {data.quote}
      </InlineQuote>

      <Divider />

      <figcaption>
        <div
          className="text-[14px] font-medium"
          style={{ color: "var(--color-brand-charcoal)", fontFamily: "var(--font-sans, Inter), sans-serif" }}
        >
          {data.name}
        </div>
        <div
          className="text-[12px] mt-0.5"
          style={{ color: "var(--color-brand-sage)", fontFamily: "var(--font-sans, Inter), sans-serif" }}
        >
          {data.meta}
        </div>
      </figcaption>
    </motion.figure>
  );
}

function CompactCard({
  data,
}: {
  data: { quote: string; name: string; bg: "cream" | "sage" | "terracotta" };
}) {
  const variants = useCardVariants();
  const bgMap = {
    cream: { bg: "var(--color-brand-cream)", border: "color-mix(in oklab, var(--color-brand-clay) 70%, transparent)" },
    sage: { bg: "color-mix(in oklab, var(--color-brand-sage) 22%, var(--color-brand-soft))", border: "color-mix(in oklab, var(--color-brand-sage) 45%, transparent)" },
    terracotta: { bg: "color-mix(in oklab, var(--color-brand-terracotta) 14%, var(--color-brand-soft))", border: "color-mix(in oklab, var(--color-brand-terracotta) 35%, transparent)" },
  };
  const tone = bgMap[data.bg];

  return (
    <motion.figure
      variants={variants}
      className="rounded-[12px] border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-16px_rgba(43,37,33,0.25)]"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      <InlineQuote
        markColor="var(--color-brand-terracotta)"
        className="font-display italic text-[15px] leading-[1.55]"
      >
        {data.quote}
      </InlineQuote>

      <Divider />

      <figcaption>
        <div
          className="text-[14px] font-medium"
          style={{ color: "var(--color-brand-charcoal)", fontFamily: "var(--font-sans, Inter), sans-serif" }}
        >
          {data.name}
        </div>
      </figcaption>
    </motion.figure>
  );
}

/* ------------------------------- section ------------------------------- */

export function ReviewsMasonry() {
  const reduce = useReducedMotion();

  const column = (children: React.ReactNode, orderMobile: number) => (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.08 }}
      className="flex flex-col gap-4 lg:gap-5"
      style={{ order: orderMobile }}
    >
      {children}
    </motion.div>
  );

  return (
    <section
      className="py-24 lg:py-28"
      style={{ backgroundColor: "var(--color-brand-soft)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>Reviews</Eyebrow>
            <h2 className="mt-3 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
              What renters are{" "}
              <span className="italic text-[var(--color-brand-sage)]">actually saying.</span>
            </h2>
          </div>
          <div
            className="text-[13px] italic lg:text-right"
            style={{ color: "var(--color-brand-sage)", fontFamily: "var(--font-sans, Inter), sans-serif" }}
          >
            Sourced from beta users · 6 of 200+
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 lg:items-start">
          {/* Left column */}
          <div className="contents lg:block">
            {column(
              <>
                <CompactCard data={COMPACT_PRIYA} />
                <StatCard data={STAT_DANIEL} />
              </>,
              2,
            )}
          </div>

          {/* Center column (hero first on mobile) */}
          <div className="contents lg:block">
            {column(
              <>
                <HeroCard />
                <StatCard data={STAT_MAYA} />
              </>,
              1,
            )}
          </div>

          {/* Right column */}
          <div className="contents lg:block">
            {column(
              <>
                <CompactCard data={COMPACT_SARA} />
                <CompactCard data={COMPACT_CHRIS} />
              </>,
              3,
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="mt-8 text-[11px] font-mono uppercase tracking-[0.16em] text-center"
          style={{ color: "color-mix(in oklab, var(--color-brand-charcoal) 45%, transparent)" }}
        >
          Beta tester program · names shortened for privacy
        </p>
      </div>
    </section>
  );
}
