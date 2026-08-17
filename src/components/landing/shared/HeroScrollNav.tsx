import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { IconHomeSearch } from "@tabler/icons-react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/Nook_Green.svg.asset.json";
import { OriginButton } from "@/components/ui/origin-button";
import { supabase } from "@/integrations/supabase/client";
import { useHasSession } from "@/lib/queries/useHasSession";

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const onSignup = () => navigate({ to: "/onboarding" });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const isAuthenticated = useHasSession();
  const onLogout = () => void supabase.auth.signOut();

  const closeMenu = () => setOpen(false);

  const openMenu = () => setOpen(true);

  // Two-phase animation: morph to pill first, then grow in height.
  useEffect(() => {
    if (!open) {
      setExpanded(false);
      return;
    }
    if (scrolled) {
      setExpanded(true);
      return;
    }
    const t = window.setTimeout(() => setExpanded(true), 170);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (shellRef.current && !shellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

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

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);


  return (
    <header
      className="hero-nav-root"
      data-scrolled={scrolled || open ? "true" : "false"}
      data-open={open ? "true" : "false"}
      style={uiFont}
    >
      <div className="hero-nav-shell" ref={shellRef}>
        <div className="hero-nav-glass" aria-hidden="true" />

        <nav className="hero-nav-inner" aria-label="Main">
          <Link to="/" className="hero-nav-logo shrink-0 rounded-sm hero-nav-ring" aria-label="Nook home">
            <img src={logoAsset.url} alt="Nook" width={81} height={28} style={{ width: 81, height: 28, display: "block" }} />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={onHome ? l.href : `/${l.href}`}
                data-label={l.label}
                className="hero-nav-link rounded-sm text-sm hero-nav-ring"
                style={{ fontFamily: FONT_UI, color: BODY }}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/blog"
              search={{ category: "all" }}
              data-label="Blog"
              className="hero-nav-link rounded-sm text-sm hero-nav-ring"
              style={{ fontFamily: FONT_UI, color: BODY }}
            >
              Blog
            </Link>
          </div>


          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="hidden lg:inline-flex">
                  <button
                    type="button"
                    onClick={onLogout}
                    data-label="Log out"
                    className="hero-nav-link rounded-sm px-3 text-sm hero-nav-ring"
                    style={{ fontFamily: FONT_UI, color: NAV_TEXT }}
                  >
                    Log out
                  </button>
                </span>

                {open ? (
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/home" })}
                    className="hero-nav-cta hero-nav-ring"
                    style={uiFont}
                  >
                    Find my apartment
                  </button>
                ) : (
                  <OriginButton
                    variant="secondary"
                    size="medium"
                    onClick={() => navigate({ to: "/home" })}
                    className="hero-nav-ring h-[40px] px-4 text-sm"
                  >
                    <IconHomeSearch size={18} stroke={1.5} aria-hidden />
                    Searches
                  </OriginButton>
                )}
              </>
            ) : (
              <>
                <span className="hidden lg:inline-flex">
                  <Link
                    to="/login"
                    data-label="Sign in"
                    className="hero-nav-link rounded-sm px-3 text-sm hero-nav-ring"
                    style={{ fontFamily: FONT_UI, color: NAV_TEXT }}
                  >
                    Sign in
                  </Link>
                </span>

                {open ? (
                  <button
                    type="button"
                    onClick={onSignup}
                    className="hero-nav-cta hero-nav-ring"
                    style={uiFont}
                  >
                    Find my apartment
                  </button>
                ) : (
                  <OriginButton
                    variant="main"
                    onClick={onSignup}
                    className="hero-nav-ring h-[40px] px-4 text-sm"
                  >
                    Find my apartment
                  </OriginButton>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => (open ? closeMenu() : openMenu())}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="hero-nav-burger hero-nav-ring inline-flex lg:hidden"
            >
              {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>

        </nav>

        {open && (
          <div
            className="hero-nav-menu lg:hidden"
            data-expanded={expanded ? "true" : "false"}
            role="dialog"
            aria-label="Menu"
          >
            <div className="hero-nav-menu-inner">
              <div className="hero-nav-menu-links">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={onHome ? l.href : `/${l.href}`}
                    onClick={closeMenu}
                    className="hero-nav-menu-link hero-nav-ring"
                    style={{ ...uiFont, color: INK }}
                  >
                    {l.label}
                  </a>
                ))}
                <Link
                  to="/blog"
                  search={{ category: "all" }}
                  onClick={closeMenu}
                  className="hero-nav-menu-link hero-nav-ring"
                  style={{ ...uiFont, color: INK }}
                >
                  Blog
                </Link>
              </div>

              <div className="hero-nav-menu-actions">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        onLogout();
                      }}
                      className="hero-nav-btn-ghost hero-nav-ring"
                      style={uiFont}
                    >
                      Log out
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        navigate({ to: "/home" });
                      }}
                      className="hero-nav-btn-outline hero-nav-ring"
                      style={uiFont}
                    >
                      <IconHomeSearch size={20} stroke={1.5} aria-hidden />
                      Searches
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="hero-nav-btn-ghost hero-nav-ring"
                      style={uiFont}
                    >
                      Sign in
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        onSignup();
                      }}
                      className="hero-nav-btn-primary hero-nav-ring"
                      style={uiFont}
                    >
                      Find my apartment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.20);
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

        .hero-nav-link {
          font-weight: 500;
          font-variation-settings: "wght" 500;
          transition: font-variation-settings 0.25s ease, font-weight 0.25s ease;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }
        /* Reserve the bold width so siblings never shift on hover */
        .hero-nav-link::after {
          content: attr(data-label);
          height: 0;
          overflow: hidden;
          visibility: hidden;
          pointer-events: none;
          font-weight: 700;
          font-variation-settings: "wght" 700;
        }
        .hero-nav-link:hover {
          font-weight: 700;
          font-variation-settings: "wght" 700;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-nav-link { transition: none; }
        }

        .hero-nav-ring:focus-visible {
          outline: 2px solid ${INK};
          outline-offset: 2px;
        }

        .hero-nav-burger {
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: ${INK};
          transition: opacity 0.2s ease;
        }
        .hero-nav-burger:hover {
          opacity: 0.7;
        }

        /* Expanded dropdown card: the pill grows downward. */
        .hero-nav-root[data-open="true"] .hero-nav-shell { overflow: hidden; }
        .hero-nav-root[data-open="true"] .hero-nav-glass {
          background: #ffffff;
          backdrop-filter: blur(12px);
        }

        .hero-nav-menu {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s ${EASE_REVEAL};
        }
        .hero-nav-menu[data-expanded="true"] { grid-template-rows: 1fr; }
        .hero-nav-menu-inner {
          overflow: hidden;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .hero-nav-menu-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0;
        }
        .hero-nav-menu-link {
          display: flex;
          align-items: center;
          width: 100%;
          height: 52px;
          padding: 0 8px;
          border-radius: 10px;
          font-size: 17px;
          font-weight: 500;
          text-align: left;
        }
        .hero-nav-menu-link:hover,
        .hero-nav-menu-link:active { background: rgba(36,28,18,0.08); }

        .hero-nav-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 16px 8px;
        }
        .hero-nav-btn-ghost,
        .hero-nav-btn-primary,
        .hero-nav-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 48px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
        }
        .hero-nav-btn-ghost {
          background: ${SURFACE};
          border: 1px solid ${BORDER};
          color: ${INK};
        }
        .hero-nav-btn-ghost:hover { background: ${SURFACE_HOVER}; border-color: ${BORDER_HOVER}; }
        .hero-nav-btn-primary {
          background: #d66c38;
          border: none;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .hero-nav-btn-outline {
          background: transparent;
          border: 1px solid #d66c38;
          color: #d66c38;
        }

        .hero-nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 16px;
          border: none;
          border-radius: 12px;
          background: #d66c38;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.28px;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-nav-menu { transition: none; }
        }


        @media (max-width: 1120px) {
          .hero-nav-root[data-scrolled="true"] { padding-top: 16px; }
          .hero-nav-root[data-scrolled="true"] .hero-nav-shell {
            margin: 0 16px;
            width: calc(100% - 32px);
            padding: 12px;
          }
        }

        @media (max-width: 680px) {
          .hero-nav-shell { padding: 0 20px; }
          .hero-nav-root[data-scrolled="true"] { padding-top: 16px; }
          .hero-nav-root[data-scrolled="true"] .hero-nav-shell {
            max-width: 100%;
            padding: 12px;
            margin: 0 16px;
            width: calc(100% - 32px);
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
