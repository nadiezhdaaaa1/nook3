import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/Nook_Green.svg.asset.json";
import { RollText } from "@/components/ui/RollText";

const FONT_UI = '"Google Sans Flex", "Google Sans", system-ui, sans-serif';
const UI_VAR = '"wght" 500';

const INK = "#241c12";
const BODY = "#4a4a46";
const NAV_TEXT = "#241c12";
const SURFACE = "rgba(255,255,255,0.4)";
const SURFACE_HOVER = "rgba(255,255,255,0.6)";
const BORDER = "#b3aea6";
const BORDER_HOVER = "#9c968d";
const EASE_REVEAL = "cubic-bezier(0.22, 1, 0.36, 1)";

const uiFont = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "What you get", href: "#what" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/** Height the nav occupies in the hero flow (spacer keeps content from shifting). */
export const HERO_NAV_HEIGHT = 72;

export function HeroNavSpacer() {
  return <div aria-hidden="true" style={{ height: HERO_NAV_HEIGHT }} />;
}

/**
 * Shared hero header. Always position: fixed. At the top of the page it
 * visually reproduces the in-flow hero header; past the scroll threshold it
 * morphs into a floating glass pill (hysteresis: down at 64, back at 24).
 */
export function HeroScrollNav() {
  const navigate = useNavigate();
  const onSignup = () => navigate({ to: "/onboarding" });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let state = window.scrollY > 64;
    setScrolled(state);
    const onScroll = () => {
      const y = window.scrollY;
      if (!state && y > 64) {
        state = true;
        setScrolled(true);
      } else if (state && y < 24) {
        state = false;
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hero-nav-root" data-scrolled={scrolled ? "true" : "false"} style={uiFont}>
      <div className="hero-nav-shell">
        <div className="hero-nav-glass" aria-hidden="true" />

        <nav className="hero-nav-inner" aria-label="Main">
          <Link to="/" className="hero-nav-logo shrink-0 rounded-sm hero-nav-ring" aria-label="Nook home">
            <img src={logoAsset.url} alt="Nook" width={81} height={28} style={{ width: 81, height: 28, display: "block" }} />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <RollText
                key={l.href}
                as="a"
                href={l.href}
                className="rounded-sm text-sm font-medium transition-colors hero-nav-ring"
                style={{ ...uiFont, color: BODY }}
              >
                {l.label}
              </RollText>
            ))}
            <RollText
              as={Link}
              to="/blog"
              search={{ category: "all" }}
              className="rounded-sm text-sm font-medium transition-colors hero-nav-ring"
              style={{ ...uiFont, color: BODY }}
            >
              Blog
            </RollText>
          </div>

          <div className="flex items-center gap-2">
            <RollText
              as={Link}
              to="/login"
              className="hidden rounded-sm px-3 text-sm font-medium hero-nav-ring md:inline-flex"
              style={{ ...uiFont, color: NAV_TEXT }}
            >
              Sign in
            </RollText>
            <RollText
              as="button"
              type="button"
              onClick={onSignup}
              className="hero-nav-cta text-sm font-medium hero-nav-ring"
              style={{ ...uiFont, color: NAV_TEXT }}
            >
              Get free alerts
            </RollText>
          </div>
        </nav>
      </div>

      <style>{`
        .hero-nav-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 90;
          pointer-events: none;
          padding-top: 0;
          transition: padding-top 0.45s ${EASE_REVEAL};
        }
        .hero-nav-root[data-scrolled="true"] { padding-top: 16px; }

        .hero-nav-shell {
          position: relative;
          pointer-events: auto;
          margin: 0 auto;
          width: 100%;
          max-width: 1280px;
          padding: 0 40px;
          border-radius: 0;
          transition:
            max-width 0.45s ${EASE_REVEAL},
            padding 0.45s ${EASE_REVEAL},
            border-radius 0.45s ${EASE_REVEAL};
        }
        .hero-nav-root[data-scrolled="true"] .hero-nav-shell {
          max-width: 1120px;
          padding: 12px;
          border-radius: 16px;
        }

        .hero-nav-glass {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          opacity: 0;
          will-change: opacity;
          pointer-events: none;
          transition: opacity 0.25s ${EASE_REVEAL};
        }
        .hero-nav-root[data-scrolled="true"] .hero-nav-glass { opacity: 1; }

        .hero-nav-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          height: ${HERO_NAV_HEIGHT}px;
          transition: height 0.45s ${EASE_REVEAL};
        }
        .hero-nav-root[data-scrolled="true"] .hero-nav-inner { height: 42px; }

        .hero-nav-logo {
          display: inline-flex;
          transform: scale(1);
          transform-origin: left center;
          transition: transform 0.45s ${EASE_REVEAL};
        }
        .hero-nav-root[data-scrolled="true"] .hero-nav-logo { transform: scale(0.857); }

        .hero-nav-cta {
          background: ${SURFACE};
          border: 1px solid ${BORDER};
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(6px);
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .hero-nav-cta:hover {
          background: ${SURFACE_HOVER};
          border-color: ${BORDER_HOVER};
        }
        .hero-nav-ring:focus-visible {
          outline: 2px solid ${INK};
          outline-offset: 2px;
        }

        @media (max-width: 680px) {
          .hero-nav-shell { padding: 0 20px; }
          .hero-nav-root[data-scrolled="true"] { padding-top: 12px; }
          .hero-nav-root[data-scrolled="true"] .hero-nav-shell {
            max-width: 100%;
            padding: 12px;
            margin: 0 8px;
            width: calc(100% - 16px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-nav-root,
          .hero-nav-shell,
          .hero-nav-inner,
          .hero-nav-logo { transition: none; }
          .hero-nav-glass { transition: opacity 0.2s linear; }
        }
      `}</style>
    </header>
  );
}
