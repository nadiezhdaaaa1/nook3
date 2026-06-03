import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { ARTICLES, CATEGORY_LABEL } from "@/data/blog/articles";

const TEASER_ARTICLES = ARTICLES.slice(0, 3);

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
          {TEASER_ARTICLES.map((a, i) => (
            <motion.article
              key={a.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-card border overflow-hidden flex flex-col hover-lift"
              style={{
                borderColor: "var(--color-brand-clay)",
                backgroundColor: "var(--color-brand-soft)",
              }}
            >
              <Link to="/blog/$slug" params={{ slug: a.slug }} className="flex flex-col h-full">
                <div
                  className="aspect-[16/9] relative overflow-hidden"
                  style={{ background: a.coverGradient }}
                >
                  <img
                    src={a.coverImage}
                    alt={a.coverImageAlt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-sage)] font-semibold">
                    {CATEGORY_LABEL[a.category]}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-medium leading-snug text-[var(--color-brand-charcoal)]">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-charcoal-700)] line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div
                    className="mt-5 pt-4 border-t flex items-center gap-3 text-[12px] text-[var(--color-charcoal-500)]"
                    style={{ borderColor: "var(--color-brand-clay)" }}
                  >
                    <span>Nook Team</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {a.readingTimeMin} min read
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-brand-terracotta)" }}
          >
            See all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
