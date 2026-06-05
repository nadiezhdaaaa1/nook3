import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { z } from "zod";
import { Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { AuthorByline } from "@/components/blog/AuthorByline";
import {
  ARTICLES,
  CATEGORIES,
  CATEGORY_LABEL,
  getFeatured,
  type BlogArticle,
} from "@/data/blog/articles";
import { cn } from "@/lib/utils";

const SITE = "https://thenook.rent";

const searchSchema = z.object({
  category: z
    .enum(["all", "renter-rights", "guides", "tools-comparisons", "market-intelligence"])
    .catch("all")
    .default("all"),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Nook Blog — Honest guides to US apartment hunting" },
      {
        name: "description",
        content:
          "Renter rights, market data, and practical guides for finding an apartment in the US — without the noise.",
      },
      { property: "og:title", content: "Nook Blog — Honest guides to US apartment hunting" },
      {
        property: "og:description",
        content:
          "Renter rights, market data, and practical guides for finding an apartment in the US — without the noise.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/blog` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Nook Blog",
          url: `${SITE}/blog`,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE}/blog?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          ],
        }),
      },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/blog" });
  const featured = getFeatured();
  const filtered =
    category === "all"
      ? ARTICLES.filter((a) => !a.featured)
      : ARTICLES.filter((a) => a.category === category && a.slug !== featured.slug);

  return (
    <MarketingLayout>
      <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--color-brand-cream)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <Eyebrow>The Nook Blog</Eyebrow>
          <h1 className="mt-4 font-display font-medium text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
            Renting,{" "}
            <span className="italic text-[var(--color-brand-terracotta)]">demystified.</span>
          </h1>
          <p className="mt-5 text-lg text-[var(--color-charcoal-600)]">
            Honest guides, real data, and practical tools for finding a home — without the noise.
          </p>
        </div>
      </section>

      <section className="border-y" style={{ borderColor: "var(--color-brand-clay)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <nav className="flex flex-wrap gap-x-8 gap-y-2 py-4 overflow-x-auto">
            {CATEGORIES.map((c) => {
              const active = (category ?? "all") === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => navigate({ search: { category: c.slug } })}
                  className={cn(
                    "text-sm font-medium pb-1 border-b-2 transition-colors whitespace-nowrap",
                    active
                      ? "border-[var(--color-brand-charcoal)] text-[var(--color-brand-charcoal)]"
                      : "border-transparent text-[var(--color-charcoal-600)] hover:text-[var(--color-brand-sage)]",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            {category === "all" && <FeaturedCard article={featured} />}

            <div className="mt-12">
              <h2 className="font-display text-2xl font-medium text-[var(--color-brand-charcoal)] mb-6">
                Latest
              </h2>
              {filtered.length === 0 ? (
                <p className="text-[var(--color-charcoal-600)]">
                  More articles in this category are on the way.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filtered.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
            <NewsletterCard />
            <AboutNookCard />
          </aside>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FeaturedCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className="grid md:grid-cols-2 gap-0 rounded-card border overflow-hidden hover-lift"
      style={{
        borderColor: "var(--color-brand-clay)",
        backgroundColor: "var(--color-brand-soft)",
      }}
    >
      <div className="aspect-[4/3] md:aspect-auto relative overflow-hidden" style={{ background: article.coverGradient }}>
        <img
          src={article.coverImage}
          alt={article.coverImageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-8 lg:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <span
            className="inline-block text-[10px] font-mono uppercase tracking-[0.18em] font-semibold px-2 py-1 rounded"
            style={{
              backgroundColor: "var(--color-brand-terracotta)",
              color: "var(--color-brand-cream)",
            }}
          >
            Featured
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
            {CATEGORY_LABEL[article.category]}
          </span>
        </div>
        <h3 className="mt-4 font-display text-3xl lg:text-4xl font-medium tracking-[-0.01em] text-[var(--color-brand-charcoal)] leading-[1.1]">
          {article.title}
        </h3>
        <p className="mt-4 text-[var(--color-charcoal-700)] leading-relaxed">{article.excerpt}</p>
        <div className="mt-5 flex items-center gap-3 text-xs text-[var(--color-charcoal-500)]">
          <Clock className="h-3 w-3" />
          {article.readingTimeMin} min read
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
        <span
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: "var(--color-brand-terracotta)" }}
        >
          Read the article →
        </span>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className="flex flex-col rounded-card border overflow-hidden hover-lift"
      style={{
        borderColor: "var(--color-brand-clay)",
        backgroundColor: "var(--color-brand-soft)",
      }}
    >
      <div className="aspect-[4/3] relative overflow-hidden" style={{ background: article.coverGradient }}>
        <img
          src={article.coverImage}
          alt={article.coverImageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
          {CATEGORY_LABEL[article.category]}
        </div>
        <h3 className="mt-2 font-display text-xl font-medium text-[var(--color-brand-charcoal)] leading-snug">
          {article.title}
        </h3>
        <p className="mt-3 text-sm text-[var(--color-charcoal-700)] line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-5 flex items-center gap-3 text-[11px] text-[var(--color-charcoal-500)]">
          <AuthorByline size="sm" />
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTimeMin} min
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsletterCard() {
  return <NewsletterSignup source="blog-index" />;
}

function AboutNookCard() {
  return (
    <div
      className="rounded-card p-6 border"
      style={{
        backgroundColor: "var(--color-brand-soft)",
        borderColor: "var(--color-brand-clay)",
      }}
    >
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
        About Nook
      </div>
      <div className="mt-2 font-display text-xl font-medium text-[var(--color-brand-charcoal)]">
        A calmer rental search.
      </div>
      <p className="mt-2 text-sm text-[var(--color-charcoal-700)]">
        Nook watches the US rental market 24/7 and pings you the moment a match
        appears. Verified listings, rent-regulated units flagged, no spam.
      </p>
      <Link
        to="/onboarding"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
        style={{ color: "var(--color-brand-terracotta)" }}
      >
        Start free →
      </Link>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
