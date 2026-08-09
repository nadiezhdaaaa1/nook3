import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { useEffect, useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { BlogBody, extractToc } from "@/components/blog/BlogBody";
import { NewsletterDigestBand } from "@/components/blog/NewsletterDigestBand";
import { RelatedReading } from "@/components/blog/RelatedReading";
import { ShareRow } from "@/components/blog/ShareRow";
import { OriginButton } from "@/components/ui/origin-button";

import {
  ARTICLES,
  CATEGORY_LABEL,
  getArticle,
  getRelated,
  type BlogArticle,

} from "@/data/blog/articles";



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
    const absImage = a.coverImage?.startsWith("http")
      ? a.coverImage
      : `${SITE}${a.coverImage ?? ""}`;
    return {
      meta: [
        { title: `${a.title} — Nook Blog` },
        { name: "description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:url", content: url },
        { property: "og:image", content: absImage },
        { property: "article:published_time", content: a.publishedAt },
        { property: "article:modified_time", content: a.updatedAt ?? a.publishedAt },
        { property: "article:author", content: "Nook Team" },
        { property: "article:section", content: categoryName },
        ...a.tags.map((t) => ({ property: "article:tag", content: t })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: a.excerpt },
        { name: "twitter:image", content: absImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: a.title,
            description: a.excerpt,
            image: [absImage],
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
              logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
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
      ],
    };
  },
  component: ArticleDetailPage,
  errorComponent: ({ error, reset }) => {
    if (typeof console !== "undefined") console.error(error);
    return (
      <MarketingLayout>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-4xl text-[var(--color-brand-charcoal)]">
            This article didn't load
          </h1>
          <p className="mt-4 text-[var(--color-charcoal-600)]">
            Something went wrong on our end. Try again, or head back to the blog.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-pill h-11 px-5 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--color-brand-terracotta)" }}
            >
              Try again
            </button>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center rounded-pill h-11 px-5 text-sm font-semibold border"
              style={{ borderColor: "var(--color-brand-clay)", color: "var(--color-brand-charcoal)" }}
            >
              Back to blog
            </Link>
          </div>
        </div>
      </MarketingLayout>
    );
  },
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
  const data = Route.useLoaderData() as { article: BlogArticle };
  const article = data.article;
  const navigate = useNavigate();
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

  const authorName = "Nook Team";
  const authorInitial = "N";

  return (
    <MarketingLayout>
      <style>{PAGE_CSS}</style>

      <div className="apg-progress" aria-hidden="true">
        <div className="apg-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <article className="apg">
        <div className="apg-inner">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="apg-crumb">
            <Link to="/" className="apg-crumb-link">
              Home
            </Link>
            <span className="apg-crumb-sep">›</span>
            <Link to="/blog" className="apg-crumb-link">
              Blog
            </Link>
            <span className="apg-crumb-sep">›</span>
            <Link to="/blog" search={{ category: article.category }} className="apg-crumb-link">
              {CATEGORY_LABEL[article.category]}
            </Link>
            <span className="apg-crumb-sep">›</span>
            <span className="apg-crumb-current">{article.title}</span>
          </nav>

          {/* Header */}
          <header className="apg-head">
            <div className="apg-meta">
              <span>{CATEGORY_LABEL[article.category]}</span>
              <span>·</span>
              <span className="apg-meta-read">
                <Clock aria-hidden="true" />
                {article.readingTimeMin} min read
              </span>
              <span>·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
            <h1 className="apg-h1">{article.title}</h1>
            <p className="apg-lede">{article.excerpt}</p>
            <div className="apg-author">
              <span className="apg-avatar" aria-hidden="true">
                {authorInitial}
              </span>
              <span className="apg-author-name">By {authorName}</span>
            </div>
          </header>

          {/* Hero */}
          <div className="apg-hero" style={{ background: article.coverGradient }}>
            <img src={article.coverImage} alt={article.coverImageAlt} />
          </div>

          {/* Body layout */}
          <div className="apg-cols">
            {/* TOC */}
            <nav className="apg-toc" aria-label="On this page">
              <div className="apg-toc-sticky">
                <div className="apg-toc-title">On this page</div>
                <ul className="apg-toc-list">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="apg-toc-link"
                        data-active={activeId === t.id ? "true" : "false"}
                      >
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Article column */}
            <div className="apg-col">
              {toc.length > 0 && (
                <details className="apg-toc-mobile">
                  <summary>
                    Table of contents
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <ul>
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`}>{t.text}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <BlogBody blocks={article.body} />

              {/* Tags */}
              <div className="apg-tags">
                <div className="apg-tags-label">Tagged</div>
                <div className="apg-tags-row">
                  {article.tags.map((t: string) => (
                    <span key={t} className="apg-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right rail */}
            <aside className="apg-rail" aria-label="About and sharing">
              <div className="apg-rail-card">
                <div className="apg-rail-label">About the author</div>
                <div className="apg-author" style={{ marginTop: 16 }}>
                  <span className="apg-avatar" aria-hidden="true">
                    {authorInitial}
                  </span>
                  <span className="apg-author-name">By {authorName}</span>
                </div>
                <p className="apg-rail-text">
                  The Nook editorial team covers US rental markets, tenant rights, and apartment
                  search strategies.
                </p>
              </div>

              <div className="apg-rail-dark">
                <div className="apg-rail-label apg-rail-label-light">Try Nook</div>
                <div className="apg-rail-dark-title">Get rental alerts within minutes</div>
                <p className="apg-rail-dark-text">
                  Nook watches the US market 24/7 and emails you the moment new listings match your
                  criteria.
                </p>
                <OriginButton
                  variant="main"
                  size="medium"
                  className="w-full mt-5"
                  onClick={() => navigate({ to: "/onboarding" })}
                >
                  Start Free
                </OriginButton>
              </div>

              <ShareRow
                url={`${SITE}/blog/${article.slug}`}
                title={article.title}
                excerpt={article.excerpt}
              />
            </aside>
          </div>
        </div>
      </article>

      <NewsletterDigestBand source={`blog-article:${article.slug}`} />

      {related.length > 0 && <RelatedReading articles={related} />}
    </MarketingLayout>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PAGE_CSS = `
.apg-progress { position:fixed; top:0; left:0; right:0; height:3px; z-index:60; background:transparent; }
.apg-progress-bar { height:100%; background:#d66c38; transition:width .15s linear; }

.apg { background:#faf6ee; padding:40px 0 104px; }
.apg-inner { max-width:1280px; margin:0 auto; padding:0 40px; }

.apg-crumb {
  display:flex; align-items:center; gap:8px; min-width:0; white-space:nowrap;
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:14px; line-height:20px;
}
.apg-crumb-link { color:#6e6e68; text-decoration:none; transition:color .2s ease; flex:0 0 auto; }
.apg-crumb-link:hover { color:#2b2521; }
.apg-crumb-link:focus-visible { outline:2px solid #241c12; outline-offset:3px; }
.apg-crumb-sep { color:#6e6e68; flex:0 0 auto; }
.apg-crumb-current { color:#4a4a46; min-width:0; overflow:hidden; text-overflow:ellipsis; }

.apg-head { margin-top:20px; max-width:768px; }
.apg-meta {
  display:flex; align-items:center; flex-wrap:wrap; gap:8px;
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:700; font-size:10px; line-height:15px; letter-spacing:1.8px;
  text-transform:uppercase; color:#7a6f5c;
}
.apg-meta-read { display:inline-flex; align-items:center; gap:6px; }
.apg-meta-read svg { width:12px; height:12px; }
.apg-h1 {
  margin:16px 0 0; font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:60px; line-height:64px; letter-spacing:-1.2px; color:#2b2521;
}
.apg-lede {
  margin:24px 0 0; font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:20px; line-height:32px; color:#5a5a55;
}
.apg-author { margin-top:24px; display:flex; align-items:center; gap:12px; }
.apg-avatar {
  width:40px; height:40px; flex:0 0 40px; border-radius:9999px; background:#809917;
  display:inline-flex; align-items:center; justify-content:center;
  font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:14px; color:#f5ede0;
}
.apg-author-name {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:600; font-size:16px; line-height:24px; color:#4a4a46;
}

.apg-hero {
  margin-top:48px; width:100%; max-width:1200px; aspect-ratio:16/9; position:relative;
  border-radius:20px; overflow:hidden;
}
.apg-hero::after {
  content:""; position:absolute; inset:0; border-radius:20px; pointer-events:none;
  border:1px solid rgba(0,0,0,0.2); z-index:1;
}
.apg-hero img {
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
}

.apg-cols {
  margin-top:80px; max-width:1200px;
  display:grid; grid-template-columns:200px 680px 240px; gap:40px; align-items:start;
}
.apg-col { min-width:0; }

.apg-toc { align-self:stretch; }
.apg-toc-sticky { position:sticky; top:112px; }
.apg-toc-title {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:700; font-size:10px; line-height:15px; letter-spacing:1.8px;
  text-transform:uppercase; color:#809917;
}
.apg-toc-list { margin-top:16px; display:flex; flex-direction:column; gap:8px; list-style:none; padding:0; }
.apg-toc-link {
  display:block; padding-left:14px; border-left:2px solid transparent; text-decoration:none;
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:14px; line-height:20px; color:#5a5a55;
  transition:color .2s ease, border-color .2s ease;
}
.apg-toc-link:hover { color:#2b2521; }
.apg-toc-link:focus-visible { outline:2px solid #241c12; outline-offset:3px; }
.apg-toc-link[data-active="true"] { font-weight:500; color:#2b2521; border-left-color:#809917; }

.apg-toc-mobile { display:none; }

.apg-tags { margin-top:40px; }
.apg-tags-label {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:700; font-size:13px; letter-spacing:1.82px; text-transform:uppercase; color:#241c12;
}
.apg-tags-row { margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; }
.apg-tag {
  background:#ebf0d5; border-radius:8px; padding:6px 12px;
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:700; font-size:12px; line-height:16px; letter-spacing:1.1px; color:#809917;
}

.apg-rail { align-self:stretch; display:flex; flex-direction:column; gap:24px; min-width:0; }
.apg-rail-card {
  background:#ffffff; border:1px solid rgba(36,28,18,0.2); border-radius:16px; padding:20px;
}
.apg-rail-label {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:700; font-size:12px; letter-spacing:1.82px; text-transform:uppercase; color:#241c12;
}
.apg-rail-label-light { color:#ffffff; }
.apg-rail-text {
  margin-top:16px; font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:14px; line-height:24px; color:#4a4a46;
}
.apg-rail-dark { background:#2c2415; border-radius:20px; padding:20px; }
.apg-rail-dark-title {
  margin-top:12px; font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:24px; line-height:28px; letter-spacing:-0.3px; color:#ffffff;
}
.apg-rail-dark-text {
  margin-top:12px; font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:14px; line-height:24px; color:#f8f3e1;
}

@media (max-width:1280px) {
  .apg-cols { grid-template-columns:200px minmax(0,1fr) 240px; }
}
@media (max-width:1100px) {
  .apg-cols { grid-template-columns:minmax(0,1fr); }
  .apg-toc { display:none; }
  .apg-rail { width:100%; max-width:480px; margin:0 auto; }
  .apg-toc-mobile {
    display:block; margin-bottom:24px; border:1px solid rgba(0,0,0,0.2);
    border-radius:16px; padding:16px; background:#ffffff;
  }
  .apg-toc-mobile summary {
    cursor:pointer; display:flex; align-items:center; justify-content:space-between;
    font-family:"Google Sans Flex",system-ui,sans-serif;
    font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
    font-weight:500; font-size:15px; color:#2b2521; list-style:none;
  }
  .apg-toc-mobile summary svg { width:16px; height:16px; }
  .apg-toc-mobile ul { margin:12px 0 0; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; }
  .apg-toc-mobile a {
    font-family:"Google Sans Flex",system-ui,sans-serif;
    font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
    font-size:14px; line-height:20px; color:#5a5a55; text-decoration:none;
  }
  .apg-h1 { font-size:clamp(40px,5.4vw,60px); line-height:1.08; }
}
@media (max-width:680px) {
  .apg { padding:24px 0 64px; }
  .apg-inner { padding:0 20px; }
  .apg-h1 { font-size:clamp(36px,8vw,44px); line-height:1.1; }
  .apg-lede { font-size:18px; line-height:28px; }
  .apg-hero { margin-top:32px; border-radius:16px; }
  .apg-cols { margin-top:48px; }
}
`;

// Reference ARTICLES so static analyzers know the data backs all slugs.
void ARTICLES;
