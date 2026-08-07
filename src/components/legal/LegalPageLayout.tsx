import { type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const LEGAL_LINKS = [
  { to: "/terms", label: "Terms of Service" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/cookies", label: "Cookie Policy" },
  { to: "/fair-housing", label: "Fair Housing" },
  { to: "/accessibility", label: "Accessibility" },
  { to: "/acceptable-use", label: "Acceptable Use" },
  { to: "/dmca", label: "DMCA Policy" },
  { to: "/do-not-sell", label: "Do Not Sell or Share" },
  { to: "/refunds", label: "Refund Policy" },
  { to: "/subprocessors", label: "Subprocessors" },
];

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
  const { pathname } = useLocation();

  return (
    <MarketingLayout>
      <div className="legal-layout">
        <div className="legal-layout-inner">
          <article className="legal-article">
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

          <aside className="legal-sidebar" aria-label="Legal pages">
            <div className="legal-sidebar-card">
              <h2 className="legal-sidebar-title">Legal pages</h2>
              <nav aria-label="Legal navigation">
                <ul className="legal-sidebar-list">
                  {LEGAL_LINKS.map((link) => {
                    const active = pathname === link.to;
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="legal-sidebar-link"
                          data-active={active ? "true" : "false"}
                          aria-current={active ? "page" : undefined}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .legal-layout { background: #FAF6EE; padding: 64px 0 120px; }
        .legal-layout-inner {
          margin: 0 auto; width: 100%; max-width: 1280px; padding: 0 40px;
          display: grid; grid-template-columns: minmax(0, 760px) 260px; gap: 48px;
          align-items: start; justify-content: center;
        }
        .legal-article { max-width: 760px; }

        .legal-sidebar { position: sticky; top: 96px; }
        .legal-sidebar-card {
          background: #ffffff; border: 1px solid rgba(0,0,0,0.20);
          border-radius: 24px; padding: 20px;
        }
        .legal-sidebar-title {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 18px; line-height: 1.2;
          letter-spacing: -0.02em; color: #2b2521; margin-bottom: 12px;
        }
        .legal-sidebar-list {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 2px;
        }
        .legal-sidebar-link {
          display: block; padding: 8px 10px; border-radius: 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 500; font-size: 14px; color: #5a5a55;
          text-decoration: none;
          transition: color 0.2s ease, background-color 0.2s ease;
        }
        .legal-sidebar-link:hover {
          color: #2b2521; background-color: #f8f3e1;
        }
        .legal-sidebar-link[data-active="true"] {
          color: #2b2521; background-color: #f8f3e1; font-weight: 600;
        }
        .legal-sidebar-link:focus-visible {
          outline: 2px solid #241c12; outline-offset: 2px;
        }

        .legal-prose { font-size: 16px; line-height: 1.7; }
        .legal-prose p { margin: 0 0 1.1em; }
        .legal-prose h2 {
          font-family: var(--font-display, "Fraunces", serif);
          font-size: 24px; font-weight: 500; margin: 2.4em 0 0.6em;
          letter-spacing: -0.01em; color: var(--color-brand-charcoal);
        }
        .legal-prose h3 {
          font-size: 18px; font-weight: 600; margin: 1.8em 0 0.4em;
          color: var(--color-brand-charcoal);
        }
        .legal-prose ul, .legal-prose ol {
          margin: 0 0 1.2em 1.4em; list-style: disc;
        }
        .legal-prose ol { list-style: decimal; }
        .legal-prose li { margin-bottom: 0.4em; }
        .legal-prose a { text-decoration: underline; text-underline-offset: 2px; }
        .legal-prose strong { font-weight: 600; }

        @media (max-width: 1100px) {
          .legal-layout { padding: 48px 0 80px; }
          .legal-layout-inner {
            grid-template-columns: 1fr; padding: 0 24px; justify-content: stretch;
          }
          .legal-article { max-width: none; order: 2; }
          .legal-sidebar {
            position: relative; top: auto; order: 1;
            max-width: 480px; margin: 0 auto;
          }
        }
        @media (max-width: 680px) {
          .legal-layout { padding: 32px 0 64px; }
          .legal-layout-inner { padding: 0 20px; }
        }
      `}</style>
    </MarketingLayout>
  );
}

