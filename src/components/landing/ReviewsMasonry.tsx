import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const REVIEWS = [
  {
    quote:
      "I'd been looking for 4 months. Set up Nook on Friday, got a match Saturday morning at 8am, signed the lease Tuesday. The rent-stabilized badge sold me — I verified it against city records myself and it was legit.",
    name: "Maya R.",
    context: "Found apartment in 4 days",
  },
  {
    quote:
      "Sent me a 1BR at $2,400 twelve minutes after it posted. Got there at noon. Signed the lease that night. Two friends I told about Nook had the same speed of result.",
    name: "Daniel K.",
  },
  {
    quote:
      "The 'pet-friendly' filter actually means pet-friendly. I had a hard time with other apps' pet filters — half the 'pet-friendly' listings would say 'small dogs only' or 'cats only' once you called. Nook strips that out.",
    name: "Priya S.",
  },
  {
    quote:
      "I'll be honest — I signed up expecting to cancel after the trial. But the alerts were actually relevant. I got 4 matches in the first week that fit my exact budget and neighborhoods. Two were apartments I would have missed.",
    name: "Jake M.",
    context: "Currently subscribed 3 months",
  },
  {
    quote:
      "The AI assistant is genuinely useful. I sent it a listing I was unsure about and it pulled up the building's permit history, recent rent changes, and pointed out the unit had been listed twice in 6 months — which made me ask the landlord questions I wouldn't have thought of.",
    name: "Sara L.",
  },
  {
    quote:
      "Moving cross-country, didn't know which neighborhood I wanted. Set up three searches in different areas. Killed two after a week, found my place through the third.",
    name: "Chris D.",
    context: "Relocated for work",
  },
];

export function ReviewsMasonry() {
  const reduce = useReducedMotion();
  return (
    <section
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-soft)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            What renters are{" "}
            <span className="italic text-[var(--color-brand-sage)]">actually saying.</span>
          </h2>
        </div>

        <div className="mt-14 columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name + i}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 break-inside-avoid rounded-card border p-7 hover-lift"
              style={{
                borderColor: "var(--color-brand-clay)",
                backgroundColor: "var(--color-brand-cream)",
              }}
            >
              <span
                className="font-display text-5xl leading-none italic block"
                style={{ color: "var(--color-brand-terracotta)" }}
              >
                "
              </span>
              <blockquote className="mt-2 font-display text-[17px] leading-[1.5] italic text-[var(--color-brand-charcoal)]">
                {r.quote}
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <div className="font-semibold text-[var(--color-brand-charcoal)]">{r.name}</div>
                {r.context && (
                  <div className="text-[12px] text-[var(--color-charcoal-500)] mt-0.5">
                    {r.context}
                  </div>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
