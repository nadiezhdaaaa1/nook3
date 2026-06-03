import { type ReactNode } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  /** @deprecated kept for backwards compatibility, no longer rendered */
  effective?: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
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
          </p>
        </header>

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
