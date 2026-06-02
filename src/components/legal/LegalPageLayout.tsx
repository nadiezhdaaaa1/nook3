import { type ReactNode } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  effective?: string;
  children: ReactNode;
  /** Show the "draft placeholder" banner. Defaults to true. */
  draft?: boolean;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  effective,
  children,
  draft = true,
}: LegalPageLayoutProps) {
  return (
    <MarketingLayout>
      <article className="max-w-[760px] mx-auto px-6 pt-16 lg:pt-24 pb-24 lg:pb-32">
        <header className="mb-12 pb-8 border-b border-charcoal-200/60">
          <h1 className="font-display text-4xl lg:text-5xl tracking-[-0.02em] text-charcoal-950 leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-sm text-charcoal-500 font-mono tracking-wide">
            Last updated: {lastUpdated}
            {effective ? ` · Effective: ${effective}` : ""}
          </p>
        </header>

        {draft && (
          <div
            role="alert"
            className="mb-10 rounded-xl border-2 px-5 py-4 text-sm flex gap-3"
            style={{
              borderColor: "#d4a017",
              backgroundColor: "#fff8e1",
              color: "#5c4a00",
            }}
          >
            <span aria-hidden className="text-lg leading-none mt-0.5">⚠️</span>
            <div className="space-y-1">
              <p className="font-semibold">
                This document is a draft pending legal review.
              </p>
              <p className="text-[13px] opacity-90">
                Effective date will be set upon publication. Do not rely on
                this language — it has not been reviewed by counsel.
              </p>
            </div>
          </div>
        )}


        <div className="legal-prose text-charcoal-800">{children}</div>

        <footer className="mt-16 pt-8 border-t border-charcoal-200/60 text-sm text-charcoal-500">
          Questions?{" "}
          <a
            href="mailto:legal@thenook.rent"
            className="text-charcoal-950 underline underline-offset-2 hover:text-brand-terracotta"
          >
            legal@thenook.rent
          </a>
        </footer>
      </article>

      <style>{`
        .legal-prose { font-size: 16px; line-height: 1.7; }
        .legal-prose p { margin: 0 0 1.1em; }
        .legal-prose h2 {
          font-family: var(--font-display, "Fraunces", serif);
          font-size: 24px;
          font-weight: 500;
          margin: 2.4em 0 0.6em;
          letter-spacing: -0.01em;
          color: var(--color-brand-charcoal);
        }
        .legal-prose h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 1.8em 0 0.4em;
          color: var(--color-brand-charcoal);
        }
        .legal-prose ul, .legal-prose ol {
          margin: 0 0 1.2em 1.4em;
          list-style: disc;
        }
        .legal-prose ol { list-style: decimal; }
        .legal-prose li { margin-bottom: 0.4em; }
        .legal-prose a { text-decoration: underline; text-underline-offset: 2px; }
        .legal-prose strong { font-weight: 600; }
      `}</style>
    </MarketingLayout>
  );
}
