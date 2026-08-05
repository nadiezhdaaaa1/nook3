import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  animate,
  AnimatePresence,

  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import logoAsset from "@/assets/Nook_Green.svg.asset.json";
import {
  COLORS,
  DISPLAY_VAR,
  EASE_CROSS,
  EASE_REVEAL,
  FONT_DISPLAY,
  FONT_UI,
  HERO_ALL_IMAGES,
  HERO_CITIES,
  UI_VAR,
  type HeroCity,
} from "./heroCities";

const H1_LINES = ["Find it before it's", "gone. Without losing", "your mind."];
const H1_TEXT = "Find it before it's gone. Without losing your mind.";
const DRAG_THRESHOLD = 120;

const uiFont = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;
const displayFont = { fontFamily: FONT_DISPLAY, fontVariationSettings: DISPLAY_VAR } as const;

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "What you get", href: "#what" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function HeroA() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [dir, setDir] = useState<-1 | 1>(-1);
  const city = HERO_CITIES[index];

  // Preload every hero image once so city transitions never flash.
  useEffect(() => {
    HERO_ALL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const goTo = (next: number, direction: -1 | 1 = -1) => {
    if (next === index) return;
    setDir(direction);
    setPrevIndex(index);
    setIndex(((next % HERO_CITIES.length) + HERO_CITIES.length) % HERO_CITIES.length);
  };

  // Looped stack: any swipe (or arrow key) advances one city forward and wraps.
  const cycle = (direction: -1 | 1) => goTo(index + 1, direction);


  const startSignup = () => navigate({ to: "/onboarding" });

  return (
    <section
      id="hero"
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor: COLORS.base, ...uiFont }}
    >
      <HeroBackground city={city} prevCity={prevIndex !== null ? HERO_CITIES[prevIndex] : null} reduced={!!reduced} />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-10">
        <HeroNav onSignup={startSignup} />

        <div className="hero-a-grid">
          <div className="hero-a-copy">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.25, ease: EASE_REVEAL }}
              className="relative z-30 flex flex-wrap items-center gap-4"
            >
              <CityPill city={city} onPick={(i) => goTo(i, -1)} />
              <AnimatePresence initial={false}>
                {city.comingSoon && (
                  <motion.span
                    key="soon"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: reduced ? 0.3 : 0.25, ease: EASE_REVEAL, delay: reduced ? 0 : 0.2 }}
                    className="inline-flex items-center rounded-[80px] px-2 py-1 text-xs font-medium"
                    style={{ ...uiFont, backgroundColor: COLORS.soonBg, color: COLORS.soonText }}
                  >
                    Coming soon
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            <H1Reveal reduced={!!reduced} />

            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.5 }}
              className="mt-6 max-w-[576px] text-[18px] leading-[1.6]"
              style={{ ...uiFont, color: COLORS.body }}
            >
              Nook watches the rental market 24/7 and pings you the moment a match appears.
              Verified, no spam.
            </motion.p>

            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.6 }}
              className="hero-a-cta-row mt-9"
            >
              <RollCta onClick={startSignup} reduced={!!reduced} />
              <span className="text-sm" style={{ ...uiFont, color: COLORS.muted }}>
                3-day trial. Cancel anytime.
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduced ? 0.3 : 0.6, ease: EASE_REVEAL, delay: reduced ? 0 : 0.4 }}
            className="hero-a-deck-wrap"
          >
            <CardDeck city={city} dir={dir} reduced={!!reduced} onCycle={cycle} />
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero-a-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, auto);
          gap: 80px;
          align-items: center;
          margin-top: 64px;
          padding-bottom: 112px;
        }
        .hero-a-deck-wrap { justify-self: end; max-width: 100%; }
        .hero-a-cta-row { display: flex; align-items: center; gap: 20px; }
        #hero { min-height: 800px; }
        @media (max-width: 1100px) {
          .hero-a-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
          .hero-a-deck-wrap { justify-self: center; }
        }
        @media (max-width: 680px) {
          #hero { min-height: 0; }
          .hero-a-grid { margin-top: 40px; padding-bottom: 64px; }
          .hero-a-cta-row { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>
    </section>
  );
}

/* ---------------- background ---------------- */

function HeroBackground({
  city,
  prevCity,
  reduced,
}: {
  city: HeroCity;
  prevCity: HeroCity | null;
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: COLORS.gradientBase }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(680px 600px at 10% 6%, rgba(122,143,55,0.22), transparent 68%)",
            "radial-gradient(760px 620px at 90% 14%, rgba(255,205,0,0.2), transparent 68%)",
            "radial-gradient(700px 600px at 72% 98%, rgba(203,74,10,0.13), transparent 68%)",
            "radial-gradient(640px 600px at 4% 88%, rgba(120,165,200,0.2), transparent 68%)",
          ].join(","),
        }}
      />
      <div
        className="absolute"
        style={{
          width: 710,
          height: 710,
          left: -375,
          top: 415,
          filter: "blur(55px)",
          background: "radial-gradient(circle, rgba(214,63,46,0.14), transparent 70%)",
        }}
      />

      <div className="hero-a-photo-slot">
        <AnimatePresence initial={true}>
          <motion.img
            key={city.key}
            src={city.bgImg}
            alt=""
            aria-hidden="true"
            className="hero-a-photo"
            initial={
              reduced
                ? { opacity: 0 }
                : prevCity
                  ? { opacity: 0, filter: "blur(24px)", scale: 1.05 }
                  : { opacity: 0, filter: "blur(0px)", scale: 1 }
            }
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, filter: "blur(24px)", scale: 1.03 }}
            transition={{ duration: reduced ? 0.3 : 0.9, ease: EASE_CROSS }}
            style={{ willChange: "opacity, transform, filter" }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      <style>{`
        .hero-a-photo-slot {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 1114px;
          height: 743px;
          max-width: 100%;
          opacity: 0.8;
          -webkit-mask-image:
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 14%, #000 28%),
            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 9%, #000 20%);
          mask-image:
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 14%, #000 28%),
            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 9%, #000 20%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
        }
        .hero-a-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: bottom right;
          user-select: none;
          pointer-events: none;
        }
        @media (max-width: 1100px) {
          .hero-a-photo-slot { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- nav ---------------- */

function HeroNav({ onSignup }: { onSignup: () => void }) {
  return (
    <nav
      className="relative z-20 flex h-[72px] items-center justify-between gap-6 bg-transparent py-5"
      style={uiFont}
    >
      <Link to="/" className="shrink-0 rounded-sm focus-visible-ring" aria-label="Nook home">
        <img src={logoAsset.url} alt="Nook" width={81} height={28} style={{ width: 81, height: 28 }} />
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-sm text-sm font-medium transition-colors focus-visible-ring"
            style={{ ...uiFont, color: COLORS.body }}
          >
            {l.label}
          </a>
        ))}
        <Link
          to="/blog"
          search={{ category: "all" }}
          className="rounded-sm text-sm font-medium transition-colors focus-visible-ring"
          style={{ ...uiFont, color: COLORS.body }}
        >
          Blog
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="hidden rounded-sm px-3 text-sm font-medium focus-visible-ring md:inline-flex"
          style={{ ...uiFont, color: COLORS.navText }}
        >
          Sign in
        </Link>
        <button
          type="button"
          onClick={onSignup}
          className="hero-a-nav-cta text-sm font-medium focus-visible-ring"
          style={{ ...uiFont, color: COLORS.navText }}
        >
          Get free alerts
        </button>
      </div>

      <style>{`
        .hero-a-nav-cta {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(6px);
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .hero-a-nav-cta:hover {
          background: ${COLORS.surfaceHover};
          border-color: ${COLORS.borderHover};
        }
        .focus-visible-ring:focus-visible {
          outline: 2px solid ${COLORS.pillCity};
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  );
}

/* ---------------- H1 ---------------- */

function H1Reveal({ reduced }: { reduced: boolean }) {
  const lines = useMemo(() => H1_LINES.map((l) => l.split(" ")), []);
  let charIndex = 0;

  return (
    <h1
      aria-label={H1_TEXT}
      className="hero-a-h1 mt-10"
      style={{ ...displayFont, color: COLORS.ink }}
    >
      {lines.map((words, li) => (
        <span key={li} className="hero-a-h1-line" aria-hidden="true">
          <span className="hero-a-h1-mask">
            {words.map((word, wi) => (
              <span key={wi} className="hero-a-h1-word">
                {word.split("").map((ch, ci) => {
                  const i = charIndex++;
                  return (
                    <motion.span
                      key={ci}
                      className="hero-a-h1-char"
                      initial={reduced ? { opacity: 0 } : { y: "110%" }}
                      animate={reduced ? { opacity: 1 } : { y: "0%" }}
                      transition={{
                        duration: reduced ? 0.3 : 0.7,
                        ease: EASE_REVEAL,
                        delay: reduced ? 0 : 0.1 + li * 0.12 + i * 0.015,
                      }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
                {wi < words.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </span>
        </span>
      ))}

      <style>{`
        .hero-a-h1 {
          max-width: none;
          width: max-content;
          font-weight: 600;
          font-size: 68px;
          line-height: 69.36px;
          letter-spacing: -1.7px;
          font-optical-sizing: auto;
        }
        .hero-a-h1-line { display: block; width: max-content; overflow: hidden; padding: 0.15em 0; margin: -0.15em 0; white-space: nowrap; }
        .hero-a-h1-mask { display: block; }
        .hero-a-h1-word { display: inline-block; white-space: pre; }
        .hero-a-h1-char { display: inline-block; will-change: transform; }
        @media (max-width: 1100px) {
          .hero-a-h1-line { white-space: normal; width: auto; }
          .hero-a-h1 {
            width: auto;
            max-width: 100%;
            font-size: clamp(40px, 7vw, 56px);
            line-height: 1.02;
            letter-spacing: -1px;
          }
        }
      `}</style>
    </h1>
  );
}

/* ---------------- city pill + dropdown ---------------- */

function CityPill({ city, onPick }: { city: HeroCity; onPick: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(HERO_CITIES.findIndex((c) => c.key === city.key));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % HERO_CITIES.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + HERO_CITIES.length) % HERO_CITIES.length);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(active);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="hero-a-pill focus-visible-ring"
      >
        <MapPin size={14} style={{ color: COLORS.clay }} />
        <span className="text-base" style={{ ...uiFont, color: COLORS.pillMuted }}>
          Looking in
        </span>
        <span className="text-base font-medium" style={{ ...uiFont, color: COLORS.pillCity }}>
          {city.pillLabel}
        </span>
        <ChevronDown size={14} style={{ color: COLORS.pillMuted }} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose a city"
          className="hero-a-menu"
          tabIndex={-1}
        >
          {HERO_CITIES.map((c, i) => (
            <li key={c.key}>
              <button
                type="button"
                role="option"
                aria-selected={c.key === city.key}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  onPick(i);
                  setOpen(false);
                }}
                className="hero-a-option focus-visible-ring"
                style={{
                  backgroundColor: active === i ? "rgba(36,28,18,0.05)" : "transparent",
                }}
              >
                <span className="text-base font-medium" style={{ ...uiFont, color: COLORS.pillCity }}>
                  {c.pillLabel}
                </span>
                {c.comingSoon && (
                  <span
                    className="rounded-[80px] px-2 py-0.5 text-[11px] font-medium"
                    style={{ ...uiFont, backgroundColor: COLORS.soonBg, color: COLORS.soonText }}
                  >
                    Coming soon
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .hero-a-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          backdrop-filter: blur(6px);
        }
        .hero-a-menu {
          position: absolute;
          left: 0;
          top: calc(100% + 8px);
          z-index: 30;
          min-width: 260px;
          padding: 6px;
          border-radius: 12px;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 32px rgba(36,28,18,0.12);
        }
        .hero-a-option {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          text-align: left;
          transition: background-color 0.15s ease;
        }
      `}</style>
    </div>
  );
}

/* ---------------- hero CTA with character roll ---------------- */

function RollCta({ onClick, reduced }: { onClick: () => void; reduced: boolean }) {
  const [hover, setHover] = useState(false);
  const label = "Get free alerts";
  const chars = label.split("");

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="hero-a-cta focus-visible-ring"
      style={{
        ...uiFont,
        backgroundColor: hover ? COLORS.clayHover : COLORS.clay,
        boxShadow: hover ? "4px 4px 0 rgba(36,28,18,0.14)" : "3px 3px 0 rgba(36,28,18,0.14)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <span className="hero-a-cta-roll" aria-hidden="true">
        <span className="hero-a-cta-layer">
          {chars.map((c, i) => (
            <motion.span
              key={`a-${i}`}
              className="hero-a-cta-char"
              animate={reduced ? { opacity: hover ? 0 : 1 } : { y: hover ? "-100%" : "0%" }}
              transition={{ duration: reduced ? 0.3 : 0.35, ease: EASE_REVEAL, delay: reduced ? 0 : i * 0.02 }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </span>
        <span className="hero-a-cta-layer hero-a-cta-layer-2">
          {chars.map((c, i) => (
            <motion.span
              key={`b-${i}`}
              className="hero-a-cta-char"
              animate={reduced ? { opacity: hover ? 1 : 0 } : { y: hover ? "-100%" : "0%" }}
              transition={{ duration: reduced ? 0.3 : 0.35, ease: EASE_REVEAL, delay: reduced ? 0 : i * 0.02 }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </span>
      </span>
      <span className="sr-only">{label}</span>

      <style>{`
        .hero-a-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px;
          border-radius: 12px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .hero-a-cta-roll {
          position: relative;
          display: block;
          overflow: hidden;
          line-height: 1.25;
        }
        .hero-a-cta-layer { display: flex; }
        .hero-a-cta-layer-2 { position: absolute; inset: 0; transform: translateY(100%); }
        .hero-a-cta-layer-2 .hero-a-cta-char { will-change: transform; }
        .hero-a-cta-char { display: inline-block; will-change: transform; }
      `}</style>
    </button>
  );
}

/* ---------------- card deck ---------------- */

function CardDeck({
  city,
  dir,
  reduced,
  onCycle,
}: {
  city: HeroCity;
  dir: -1 | 1;
  reduced: boolean;
  onCycle: (d: -1 | 1) => void;
}) {
  const activeIndex = Math.max(
    0,
    HERO_CITIES.findIndex((c) => c.key === city.key),
  );
  const nextCity = HERO_CITIES[(activeIndex + 1) % HERO_CITIES.length];
  const thirdCity = HERO_CITIES[(activeIndex + 2) % HERO_CITIES.length];

  return (
    <div
      className="hero-a-deck"
      role="group"
      aria-label={`${city.cardTitle} market snapshot. Use left and right arrow keys to change city.`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onCycle(1);
        if (e.key === "ArrowLeft") onCycle(-1);
      }}
    >
      <motion.div
        className="hero-a-card-back-2"
        animate={{ rotate: 1.2, y: -25, scale: 1 }}
        transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.05 }}
        aria-hidden="true"
      >
        <span
          className="hero-a-card-back-photo"
          style={{ backgroundImage: `url(${thirdCity.cardImg})` }}
        />
      </motion.div>
      <motion.div
        className="hero-a-card-back-1"
        animate={{ rotate: -1.1, y: -14, scale: 1 }}
        transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.05 }}
        aria-hidden="true"
      >
        <span
          className="hero-a-card-back-photo"
          style={{ backgroundImage: `url(${nextCity.cardImg})` }}
        />
      </motion.div>

      <AnimatePresence initial={false} custom={dir}>
        <TopCard key={city.key} city={city} dir={dir} reduced={reduced} onCycle={onCycle} />
      </AnimatePresence>


      <style>{`
        .hero-a-deck {
          position: relative;
          width: 280px;
          height: 320px;
          margin: 0 auto;
          border-radius: 24px;
        }
        .hero-a-deck:focus-visible { outline: 2px solid ${COLORS.pillCity}; outline-offset: 2px; }
        .hero-a-card-back-photo {
          position: absolute;
          inset: 12px;
          display: block;
          border-radius: 10px;
          background-size: cover;
          background-position: center;
          opacity: 0.5;
          pointer-events: none;
        }
        .hero-a-card-back-1, .hero-a-card-back-2 {

          position: absolute;
          left: 50%;
          top: 0;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(36,28,18,0.08);
        }
        .hero-a-card-back-2 {
          width: 216px; height: 265px; margin-left: -108px; background: #f6f0e6;
        }
        .hero-a-card-back-1 {
          width: 244px; height: 256px; margin-left: -122px; background: #faf6ef;
        }
        .hero-a-card {
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 280px;
          padding: 16px;
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 16px 8px rgba(12,12,13,0.10), 0 4px 1px rgba(12,12,13,0.05);
          touch-action: pan-y;
        }
        .hero-a-card-photo {
          position: relative;
          width: 100%;
          height: 160px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .hero-a-card-photo img {
          width: 100%; height: 100%; object-fit: cover; display: block; user-select: none;
        }
        .hero-a-card-title {
          position: absolute;
          left: 0; right: 0; bottom: 10px;
          text-align: center;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: -0.45px;
          color: #fff;
          text-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }
        .hero-a-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          padding: 8px;
        }
        .hero-a-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 104px;
        }
        .hero-a-stat-roll {
          position: relative;
          display: block;
          overflow: hidden;
          height: 34px;
        }
        .hero-a-stat-value {
          display: block;
          font-family: ${FONT_DISPLAY};
          font-variation-settings: ${DISPLAY_VAR};
          font-size: 28px;
          font-weight: 700;
          line-height: 34px;
          color: #000;
          font-variant-numeric: tabular-nums;
        }
        .hero-a-stat-label { font-size: 12px; color: ${COLORS.body}; }
        @media (max-width: 680px) {
          .hero-a-deck { transform: scale(0.86); transform-origin: top center; }
        }
      `}</style>
    </div>
  );
}

/* Top (draggable) card — owns its own motion values so the exiting card
   can fly out while the incoming card animates in independently. */
function TopCard({
  city,
  dir,
  reduced,
  onCycle,
}: {
  city: HeroCity;
  dir: -1 | 1;
  reduced: boolean;
  onCycle: (d: -1 | 1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, (v) => v / 20);
  const [dragging, setDragging] = useState(false);
  const throwDir = useRef<-1 | 1>(dir);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD || Math.abs(info.velocity.x) > 500) {
      throwDir.current = info.offset.x > 0 ? 1 : -1;
      onCycle(throwDir.current);
      return;
    }
    // Under the threshold: spring back to center, no city change.
    animate(x, 0, { type: "spring", stiffness: 400, damping: 32 });
  };

  const exitDir = throwDir.current;

  return (
    <motion.div
      className="hero-a-card"
      drag={reduced ? false : "x"}
      dragElastic={0.35}
      dragConstraints={{ left: 0, right: 0 }}
      dragMomentum={false}
      onDragStart={() => setDragging(true)}
      onDragEnd={onDragEnd}
      style={{ x, rotate, cursor: dragging ? "grabbing" : "grab" }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, rotate: -1.1, y: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      exit={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, x: exitDir === 1 ? 520 : -520, rotate: exitDir === 1 ? 12 : -12 }
      }
      transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.05 }}
    >
      <div className="hero-a-card-photo">
        <img src={city.cardImg} alt={`${city.cardTitle} skyline`} draggable={false} />
        <span className="hero-a-card-title" style={displayFont}>
          {city.cardTitle}
        </span>
      </div>
      <div className="hero-a-stats">
        {city.stats.map((s, i) => (
          <div key={s.label} className="hero-a-stat">
            <span className="hero-a-stat-roll">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={s.value}
                  className="hero-a-stat-value"
                  initial={reduced ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: EASE_REVEAL,
                    delay: reduced ? 0 : 0.15 + i * 0.05,
                  }}
                  style={{ ...displayFont, fontWeight: 700 }}

                >
                  {s.value}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="hero-a-stat-label" style={uiFont}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

