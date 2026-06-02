import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

interface Article {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  gradient: string;
}

const ARTICLES: Article[] = [
  {
    category: "Guides",
    title: "How to spot a bait listing in 30 seconds",
    excerpt:
      "Bait pricing is the oldest trick in the rental playbook. Here's how to recognize one before you waste an afternoon driving across town.",
    author: "Nook Team",
    readTime: "4 min read",
    gradient: "linear-gradient(135deg, var(--color-brand-terracotta) 0%, var(--color-brand-clay) 100%)",
  },
  {
    category: "Renter rights",
    title: "What rent-stabilization actually gets you (and what it doesn't)",
    excerpt:
      "Most renters know the term but not the mechanics. We break down what protections you actually have once you sign a stabilized lease.",
    author: "Nook Team",
    readTime: "7 min read",
    gradient: "linear-gradient(135deg, var(--color-brand-sage) 0%, var(--color-brand-cream) 100%)",
  },
  {
    category: "Move-out tips",
    title: "The 6-week move-out timeline that actually works",
    excerpt:
      "Most people start packing too late and lose their security deposit on rushed cleaning. Here's the schedule we recommend.",
    author: "Nook Team",
    readTime: "5 min read",
    gradient: "linear-gradient(135deg, var(--color-brand-charcoal) 0%, var(--color-brand-terracotta) 100%)",
  },
];

export function BlogTeaser() {
  const reduce = useReducedMotion();
  return (
    <section
      id="blog"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-brand-cream)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>Reading</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            Notes from the{" "}
            <span className="italic text-[var(--color-brand-sage)]">rental market.</span>
          </h2>
          <p className="mt-5 text-base lg:text-lg text-[var(--color-charcoal-600)]">
            Guides, neighborhood deep-dives, and what we've learned from helping renters move.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <motion.article
              key={a.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-card border overflow-hidden flex flex-col hover-lift cursor-pointer"
              style={{
                borderColor: "var(--color-brand-clay)",
                backgroundColor: "var(--color-brand-soft)",
              }}
            >
              <div
                className="aspect-[16/9] relative"
                style={{ background: a.gradient }}
              >
                <div className="absolute inset-0 pattern-dots opacity-20" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-sage)] font-semibold">
                  {a.category}
                </div>
                <h3 className="mt-2 font-display text-xl font-medium leading-snug text-[var(--color-brand-charcoal)]">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-charcoal-700)] line-clamp-3">
                  {a.excerpt}
                </p>
                <div className="mt-5 pt-4 border-t flex items-center gap-3 text-[12px] text-[var(--color-charcoal-500)]"
                  style={{ borderColor: "var(--color-brand-clay)" }}
                >
                  <span>{a.author}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {a.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold opacity-60 cursor-not-allowed"
            style={{ color: "var(--color-brand-terracotta)" }}
            title="Blog launching soon"
          >
            See all articles →
          </span>
        </div>
      </div>
    </section>
  );
}
