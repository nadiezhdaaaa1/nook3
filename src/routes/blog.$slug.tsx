import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Clock, Printer } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { BlogBody, extractToc } from "@/components/blog/BlogBody";
import { AuthorByline } from "@/components/blog/AuthorByline";
import {
  ARTICLES,
  CATEGORY_LABEL,
  getArticle,
  getRelated,
  type BlogArticle,
  type BlogFaq,
} from "@/data/blog/articles";
import { cn } from "@/lib/utils";

const SITE = "https://nook3.lovable.app";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    const a = loaderData?.article;
    if (!a) return {};
    const url = `${SITE}/blog/${a.slug}`;
    const categoryName = CATEGORY_LABEL[a.category];
    return {
      meta: [
        { title: `${a.title} — Nook Blog` },
        { name: "description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:url", content: url },
        { property: "article:published_time", content: a.publishedAt },
        { property: "article:modified_time", content: a.updatedAt ?? a.publishedAt },
        { property: "article:author", content: "Nook Team" },
        { property: "article:section", content: categoryName },
        ...a.tags.map((t) => ({ property: "article:tag", content: t })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: a.excerpt },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            datePublished: a.publishedAt,
            dateModified: a.updatedAt ?? a.publishedAt,
            author: {
              "@type": "Organization",
              name: "Nook Team",
              url: `${SITE}/blog`,
            },
            publisher: {
              "@type": "Organization",
              name: "Nook",
              logo: { "@type": "ImageObject", url: `${SITE}/favicon.ico` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            articleSection: categoryName,
            keywords: a.tags.join(", "),
            timeRequired: `PT${a.readingTimeMin}M`,
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
              {
                "@type": "ListItem",
                position: 3,
                name: categoryName,
                item: `${SITE}/blog?category=${a.category}`,
              },
              { "@type": "ListItem", position: 4, name: a.title },
            ],
          }),
        },
        ...(a.faq && a.faq.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: a.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  component: ArticleDetailPage,
  notFoundComponent: () => (
    <MarketingLayout>
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-[var(--color-brand-charcoal)]">
          Article not found
        </h1>
        <p className="mt-4 text-[var(--color-charcoal-600)]">
          That post may have moved or been retired.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-block font-semibold"
          style={{ color: "var(--color-brand-terracotta)" }}
        >
          ← Back to blog
        </Link>
      </div>
    </MarketingLayout>
  ),
});

function ArticleDetailPage() {
  const { article } = Route.useLoaderData();
  const toc = extractToc(article.body);
  const related = getRelated(article.slug);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <MarketingLayout>
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60]"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className="h-full transition-[width] duration-150"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--color-brand-terracotta)",
          }}
        />
      </div>

      <article className="py-12 lg:py-20" style={{ backgroundColor: "var(--color-brand-cream)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-[var(--color-charcoal-500)] mb-8 flex flex-wrap gap-2"
          >
            <Link to="/" className="hover:text-[var(--color-brand-sage)]">
              Home
            </Link>
            <span>›</span>
            <Link to="/blog" className="hover:text-[var(--color-brand-sage)]">
              Blog
            </Link>
            <span>›</span>
            <Link
              to="/blog"
              search={{ category: article.category }}
              className="hover:text-[var(--color-brand-sage)]"
            >
              {CATEGORY_LABEL[article.category]}
            </Link>
            <span>›</span>
            <span className="text-[var(--color-charcoal-700)] truncate max-w-[40ch]">
              {article.title}
            </span>
          </nav>

          {/* Header */}
          <header className="max-w-3xl">
            <div className="flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
              <span>{CATEGORY_LABEL[article.category]}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readingTimeMin} min read
              </span>
              <span>·</span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <h1 className="mt-5 font-display font-medium text-4xl lg:text-6xl tracking-[-0.02em] leading-[1.05] text-[var(--color-brand-charcoal)]">
              {article.title}
            </h1>
            <p className="mt-6 text-xl text-[var(--color-charcoal-600)] leading-relaxed">
              {article.excerpt}
            </p>
            <div className="mt-6">
              <AuthorByline />
            </div>
          </header>

          {/* Cover */}
          <div
            className="mt-12 aspect-[16/9] relative rounded-card overflow-hidden"
            style={{ background: article.coverGradient }}
            role="img"
            aria-label={article.coverImageAlt}
          >
            <div className="absolute inset-0 pattern-dots opacity-20" />
          </div>
        </div>
      </article>

      {/* Body + sidebars */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[200px_minmax(0,1fr)_240px] gap-10">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)] mb-4">
                On this page
              </div>
              <ul className="space-y-2">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className={cn(
                        "block text-sm pl-3 border-l-2 transition-colors",
                        activeId === t.id
                          ? "border-[var(--color-brand-sage)] text-[var(--color-brand-charcoal)] font-medium"
                          : "border-transparent text-[var(--color-charcoal-500)] hover:text-[var(--color-brand-sage)]",
                      )}
                    >
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Body */}
          <div className="max-w-[720px] mx-auto w-full">
            {toc.length > 0 && (
              <details className="lg:hidden mb-8 rounded-card border p-4" style={{ borderColor: "var(--color-brand-clay)" }}>
                <summary className="cursor-pointer text-sm font-semibold flex items-center justify-between">
                  Table of contents
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-[var(--color-charcoal-700)]">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <BlogBody blocks={article.body} />

            {/* Tags */}
            <div className="mt-16 pt-8 border-t" style={{ borderColor: "var(--color-brand-clay)" }}>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)] mb-3">
                Tagged
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-mono uppercase tracking-[0.1em] font-semibold px-3 py-1.5 rounded-pill"
                    style={{
                      backgroundColor: "var(--color-sage-100, #E8EEE3)",
                      color: "var(--color-brand-sage)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQ */}
            {article.faq && article.faq.length > 0 && (
              <div className="mt-16">
                <h2 className="font-display text-3xl font-medium text-[var(--color-brand-charcoal)] mb-6">
                  Frequently asked
                </h2>
                <div className="divide-y border-y" style={{ borderColor: "var(--color-brand-clay)" }}>
                  {article.faq.map((f, i) => (
                    <details key={i} className="py-5 group">
                      <summary className="cursor-pointer flex items-center justify-between gap-4 font-display text-lg font-medium text-[var(--color-brand-charcoal)]">
                        {f.q}
                        <ChevronDown className="h-4 w-4 shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-3 text-[var(--color-charcoal-700)] leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar right */}
          <aside className="space-y-6">
            <div
              className="rounded-card p-5 border"
              style={{
                backgroundColor: "var(--color-brand-soft)",
                borderColor: "var(--color-brand-clay)",
              }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
                About the author
              </div>
              <div className="mt-3">
                <AuthorByline />
              </div>
              <p className="mt-3 text-sm text-[var(--color-charcoal-700)]">
                The Nook editorial team covers US rental markets, tenant rights, and apartment search strategies.
              </p>
            </div>

            <div
              className="rounded-card p-5 border"
              style={{
                backgroundColor: "var(--color-sage-100, #E8EEE3)",
                borderColor: "var(--color-brand-sage)",
              }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
                Try Nook
              </div>
              <div className="mt-2 font-display text-lg font-medium text-[var(--color-brand-charcoal)]">
                Get rental alerts within minutes
              </div>
              <p className="mt-2 text-sm text-[var(--color-charcoal-700)]">
                Nook watches the US market 24/7 and emails you the moment new listings match your criteria.
              </p>
              <Link
                to="/onboarding"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: "var(--color-brand-terracotta)" }}
              >
                Start free →
              </Link>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-charcoal-600)] hover:text-[var(--color-brand-sage)]"
            >
              <Printer className="h-4 w-4" /> Print this article
            </button>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 border-t" style={{ borderColor: "var(--color-brand-clay)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display text-3xl font-medium text-[var(--color-brand-charcoal)] mb-8">
              Related reading
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-card border overflow-hidden hover-lift flex flex-col"
                  style={{
                    borderColor: "var(--color-brand-clay)",
                    backgroundColor: "var(--color-brand-soft)",
                  }}
                >
                  <div className="aspect-[4/3]" style={{ background: r.coverGradient }} />
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
                      {CATEGORY_LABEL[r.category]}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-medium text-[var(--color-brand-charcoal)] leading-snug">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Link
                to="/blog"
                className="text-sm font-semibold"
                style={{ color: "var(--color-brand-terracotta)" }}
              >
                ← Back to all articles
              </Link>
            </div>
          </div>
        </section>
      )}
    </MarketingLayout>
  );
}

// Reference ARTICLES so static analyzers know the data backs all slugs.
void ARTICLES;
