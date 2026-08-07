import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { z } from "zod";
import { Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { NewsletterCardDark } from "@/components/blog/NewsletterCardDark";
import {
  ARTICLES,
  CATEGORIES,
  CATEGORY_LABEL,
  getFeatured,
  type BlogArticle,
} from "@/data/blog/articles";

const SITE = "https://thenook.rent";

const searchSchema = z.object({
  category: z
    .enum(["all", "renter-rights", "guides", "tools-comparisons", "market-intelligence"])
    .catch("all")
    .optional(),
});


type BlogSearch = z.infer<typeof searchSchema>;


export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Partial<Record<string, unknown>>): BlogSearch =>
    searchSchema.parse(search),

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
  const { category: rawCategory } = Route.useSearch();
  const category = rawCategory ?? "all";
  const navigate = useNavigate({ from: "/blog/" });
  const featured = getFeatured();
  const filtered =
    category === "all"
      ? ARTICLES.filter((a) => !a.featured)
      : ARTICLES.filter((a) => a.category === category && a.slug !== featured.slug);


  return (
    <MarketingLayout>
      <section className="blog-hd">
        <div className="blog-hd-inner">
          <div className="blog-eyebrow">
            <span className="blog-eyebrow-dot" aria-hidden="true" />
            The Nook Blog
          </div>
          <h1 className="blog-h1">Renting, demystified</h1>
          <p className="blog-lede">
            Honest guides, real data, and practical tools for finding a home — without the noise.
          </p>
        </div>
      </section>

      <div className="blog-tabsbar">
        <div className="blog-tabsbar-inner">
          <nav className="blog-tabs" aria-label="Article categories">
            {CATEGORIES.map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => navigate({ search: { category: c.slug } })}
                  className="blog-tab"
                  data-active={active ? "true" : "false"}
                >
                  {c.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <section className="blog-main">
        <div className="blog-main-inner">
          <div className="blog-col">
            {category === "all" && <FeaturedCard article={featured} />}

            <h2 className="blog-latest">Latest</h2>
            {filtered.length === 0 ? (
              <p className="blog-empty">More articles in this category are on the way.</p>
            ) : (
              <div className="blog-grid">
                {filtered.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </div>

          <aside className="blog-side">
            <NewsletterCardDark source="blog-index" />
            <AboutNookCard />
          </aside>
        </div>
      </section>

      <style>{`
        .blog-hd { background: #faf6ee; padding: 80px 0 64px; }
        .blog-hd-inner, .blog-tabsbar-inner, .blog-main-inner {
          margin: 0 auto; width: 100%; padding: 0 40px;
        }
        .blog-hd-inner { max-width: 1280px; }
        .blog-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 500; font-size: 14px; color: #3a3a37;
        }
        .blog-eyebrow-dot {
          width: 8px; height: 8px; border-radius: 999px; background: #cb4a0a;
        }
        .blog-h1 {
          margin-top: 20px;
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 56px; line-height: 1.4;
          letter-spacing: -1.2px; color: #2b2521;
        }
        .blog-lede {
          margin-top: 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 18px; line-height: 1.6; color: #4a4a46;
        }

        .blog-tabsbar {
          border-top: 1px solid rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(0,0,0,0.2);
        }
        .blog-tabsbar-inner { max-width: 1280px; }
        .blog-tabs {
          display: flex; align-items: center; gap: 32px;
          height: 58px; padding: 16px 0;
        }
        .blog-tab {
          background: none; border: none; cursor: pointer;
          padding: 0 0 4px; white-space: nowrap;
          border-bottom: 2px solid transparent;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 500; font-size: 14px; color: #5a5a55;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .blog-tab:hover { color: #2b2521; }
        .blog-tab[data-active="true"] { color: #2b2521; border-bottom-color: #2b2521; }
        .blog-tab:focus-visible { outline: 2px solid #241c12; outline-offset: 3px; }

        .blog-main { padding: 80px 0; }
        .blog-main-inner {
          max-width: 1280px;
          display: grid; grid-template-columns: minmax(0,1fr) 320px;
          gap: 48px; align-items: start;
        }
        .blog-col { min-width: 0; }
        .blog-latest {
          margin-top: 48px;
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 24px; line-height: 32px;
          letter-spacing: -0.36px; color: #2b2521;
        }
        .blog-empty {
          margin-top: 24px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-size: 16px; color: #7a6f5c;
        }
        .blog-grid {
          margin-top: 24px;
          display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 24px;
        }
        .blog-side { display: flex; flex-direction: column; gap: 32px; }

        /* Featured card */
        .blog-feat {
          display: grid; grid-template-columns: 1fr 1fr;
          background: #ffffff; border: 1px solid rgba(0,0,0,0.2);
          border-radius: 20px; overflow: hidden; text-decoration: none;
          transition: border-color 0.2s ease;
        }
        .blog-feat:hover { border-color: rgba(0,0,0,0.32); }
        .blog-feat:focus-visible { outline: 2px solid #241c12; outline-offset: 3px; }
        .blog-feat-img { position: relative; min-height: 100%; overflow: hidden; }
        .blog-feat-img img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
        }
        .blog-feat-body {
          padding: 40px; display: flex; flex-direction: column; justify-content: center;
        }
        .blog-feat-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .blog-cat {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 750; font-size: 11.5px; letter-spacing: 1.61px;
          text-transform: uppercase; color: #6a820a;
        }
        .blog-chip {
          background: #d66c38; border-radius: 4px; padding: 4px 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 800; font-size: 10px; letter-spacing: 1.8px;
          text-transform: uppercase; color: #f5ede0;
        }
        .blog-feat-title {
          margin-top: 16px;
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 36px; line-height: 39.6px;
          letter-spacing: -0.36px; color: #2b2521;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-feat-excerpt {
          margin-top: 16px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 16px; line-height: 26px; color: #7a6f5c;
          display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-feat-meta {
          margin-top: 20px; display: flex; align-items: center; gap: 12px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 12px; color: #6e6e68;
        }
        .blog-feat-cta {
          margin-top: 20px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 600; font-size: 14px; color: #c2664e;
        }

        /* Article card */
        .blog-card {
          display: flex; flex-direction: column; text-decoration: none;
          background: #ffffff; border: 1px solid rgba(0,0,0,0.2);
          border-radius: 28px; overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .blog-card:hover { border-color: rgba(0,0,0,0.32); }
        .blog-card:focus-visible { outline: 2px solid #241c12; outline-offset: 3px; }
        .blog-card-img { height: 176px; width: 100%; overflow: hidden; }
        .blog-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .blog-card-body {
          padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 16px; flex: 1;
        }
        .blog-card-title {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 19px; line-height: 24.32px;
          letter-spacing: -0.19px; color: #241c12;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-card-excerpt {
          margin-top: 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 14px; line-height: 21px; color: #7a6f5c;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-card-meta {
          margin-top: auto; padding-top: 16px;
          border-top: 1px solid rgba(36,28,18,0.09);
          display: flex; align-items: center; gap: 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 13px; line-height: 19.5px; color: #7a6f5c;
        }

        /* About card */
        .blog-about {
          display: flex; flex-direction: column; gap: 20px;
          background: #ffffff; border: 1px solid rgba(36,28,18,0.2);
          border-radius: 24px; padding: 32px;
        }
        .blog-about-eyebrow {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 700; font-size: 13px; letter-spacing: 1.82px;
          text-transform: uppercase; color: #241c12;
        }
        .blog-about-title {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 24px; line-height: 28px;
          letter-spacing: -0.3px; color: #241c12;
        }
        .blog-about-text {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 14px; line-height: 24px; color: #4a4a46;
        }
        .blog-about-btn {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 16px 24px; border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1); text-decoration: none;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 500; font-size: 16px; color: #241c12;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .blog-about-btn:hover { border-color: rgba(0,0,0,0.32); background: #f8f3e1; }
        .blog-about-btn:focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }

        @media (max-width: 1100px) {
          .blog-main-inner { grid-template-columns: minmax(0,1fr); }
          .blog-side { width: 100%; max-width: 480px; margin: 0 auto; }
          .blog-feat { grid-template-columns: 1fr; }
          .blog-feat-img { height: 240px; min-height: 240px; }
          .blog-feat-body { padding: 28px; }
          .blog-feat-title { font-size: 30px; line-height: 34px; }
        }
        @media (max-width: 820px) {
          .blog-grid { grid-template-columns: minmax(0,1fr); }
        }
        @media (max-width: 680px) {
          .blog-hd { padding: 56px 0 40px; }
          .blog-hd-inner, .blog-tabsbar-inner, .blog-main-inner { padding: 0 20px; }
          .blog-h1 { font-size: clamp(36px, 7vw, 44px); }
          .blog-main { padding: 56px 0; }
          .blog-tabs { flex-wrap: nowrap; overflow-x: auto; }
          .blog-tabsbar-inner { overflow: hidden; }
        }
      `}</style>
    </MarketingLayout>
  );
}

function FeaturedCard({ article }: { article: BlogArticle }) {
  return (
    <Link to="/blog/$slug" params={{ slug: article.slug }} className="blog-feat">
      <div className="blog-feat-img" style={{ background: article.coverGradient }}>
        <img src={article.coverImage} alt={article.coverImageAlt} loading="lazy" />
      </div>
      <div className="blog-feat-body">
        <div className="blog-feat-top">
          <span className="blog-cat">{CATEGORY_LABEL[article.category]}</span>
          <span className="blog-chip">Featured</span>
        </div>
        <h3 className="blog-feat-title">{article.title}</h3>
        <p className="blog-feat-excerpt">{article.excerpt}</p>
        <div className="blog-feat-meta">
          <span className="inline-flex items-center gap-1.5">
            <Clock style={{ width: 12, height: 12 }} aria-hidden="true" />
            {article.readingTimeMin} min read
          </span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
        <span className="blog-feat-cta">Read the article →</span>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link to="/blog/$slug" params={{ slug: article.slug }} className="blog-card">
      <div className="blog-card-img" style={{ background: article.coverGradient }}>
        <img src={article.coverImage} alt={article.coverImageAlt} loading="lazy" />
      </div>
      <div className="blog-card-body">
        <div>
          <div className="blog-cat">{CATEGORY_LABEL[article.category]}</div>
          <h3 className="blog-card-title" style={{ marginTop: 8 }}>
            {article.title}
          </h3>
          <p className="blog-card-excerpt">{article.excerpt}</p>
        </div>
        <div className="blog-card-meta">
          <span>Nook Team ·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock style={{ width: 13, height: 13 }} aria-hidden="true" />
            {article.readingTimeMin} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

function AboutNookCard() {
  return (
    <div className="blog-about">
      <div className="blog-about-eyebrow">About Nook</div>
      <div>
        <div className="blog-about-title">A calmer rental search</div>
        <p className="blog-about-text" style={{ marginTop: 8 }}>
          Nook watches the US rental market 24/7 and pings you the moment a match appears. Verified
          listings, rent-regulated units flagged, no spam.
        </p>
      </div>
      <Link to="/onboarding" className="blog-about-btn">
        Start free
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
