import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { RollText } from "@/components/ui/RollText";
import logoAsset from "@/assets/Nook_Green.svg.asset.json";
import {
  COLORS,
  DISPLAY_VAR,
  EASE_CROSS,
  EASE_REVEAL,
  FONT_DISPLAY,
  FONT_UI,
  UI_VAR,
} from "../heroA/heroCities";
import {
  BADGE_GREEN,
  HERO_B_ALL_IMAGES,
  HERO_B_BASE,
  HERO_B_CITIES,
  HERO_B_MAP_BASE,
  type HeroBCity,
} from "./heroBCities";

const H1_LINES = ["Find it before it's", "gone. Without losing", "your mind."];
const H1_TEXT = "Find it before it's gone. Without losing your mind.";

const uiFont = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;
const displayFont = { fontFamily: FONT_DISPLAY, fontVariationSettings: DISPLAY_VAR } as const;

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "What you get", href: "#what" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function HeroB() {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();
  const [index, setIndex] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardShown, setCardShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const city = HERO_B_CITIES[index];
  const cardCity = HERO_B_CITIES[cardIndex];

  // Preload every hero image once so city transitions never flash.
  useEffect(() => {
    HERO_B_ALL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Moment 1 — the card pops up from the bottom edge shortly after load.
  useEffect(() => {
    const t = setTimeout(() => setCardShown(true), reduced ? 300 : 700);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Moment 2 — card dismisses, map flies to the new city, new card drops in.
  const pick = (next: number) => {
    if (next === index) return;
    setFirstLoad(false);
    setIndex(next);
    setCardShown(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        setCardIndex(next);
        setCardShown(true);
      },
      reduced ? 320 : 700,
    );
  };

  const startSignup = () => navigate({ to: "/onboarding" });

  return (
    <section
      id="hero-b"
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor: HERO_B_BASE, ...uiFont }}
    >
      <HeroBBackground city={city} firstLoad={firstLoad} reduced={reduced} />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-10">
        <HeroBNav onSignup={startSignup} />

        <div className="hero-b-grid">
          <div className="hero-b-copy">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.25, ease: EASE_REVEAL }}
              className="relative z-30 flex flex-wrap items-center gap-4"
            >
              <CityPillB city={city} onPick={pick} />
              <AnimatePresence initial={false}>
                {city.comingSoon && (
                  <motion.span
                    key="soon"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: reduced ? 0.3 : 0.25,
                      ease: EASE_REVEAL,
                      delay: reduced ? 0 : 0.2,
                    }}
                    className="inline-flex items-center rounded-[80px] px-2 py-1 text-xs font-medium"
                    style={{ ...uiFont, backgroundColor: COLORS.soonBg, color: COLORS.soonText }}
                  >
                    Coming soon
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            <H1RevealB reduced={reduced} />

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
              className="hero-b-cta-row mt-9"
            >
              <RollCtaB onClick={startSignup} reduced={reduced} />
              <span className="text-sm" style={{ ...uiFont, color: COLORS.muted }}>
                3-day trial. Cancel anytime.
              </span>
            </motion.div>
          </div>

          <div className="hero-b-card-col">
            <div className="hero-b-card-stage">
              <MapPins shown={cardShown} reduced={reduced} cityKey={cardCity.key} />
              <AnimatePresence initial={false}>
                {cardShown && <ListingCard key={cardCity.key} city={cardCity} reduced={reduced} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <CityDotRail index={index} onPick={pick} reduced={reduced} />

      <style>{`
        .hero-b-grid {
          display: grid;
          grid-template-columns: minmax(0, auto) minmax(0, 1fr);
          gap: 40px;
          align-items: center;
          margin-top: 64px;
          padding-bottom: 112px;
        }
        .hero-b-card-col {
          justify-self: center;
          max-width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 288px;
        }
        .hero-b-card-stage { position: relative; display: flex; align-items: center; justify-content: center; }
        .hero-b-cta-row { display: flex; align-items: center; gap: 20px; }
        #hero-b { min-height: 800px; }
        @media (max-width: 1100px) {
          .hero-b-grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
          .hero-b-card-col { justify-content: center; }
        }
        @media (max-width: 680px) {
          #hero-b { min-height: 0; }
          .hero-b-grid { margin-top: 40px; padding-bottom: 64px; }
          .hero-b-cta-row { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

    </section>
  );
}

/* ---------------- background: washes + city map ---------------- */

function HeroBBackground({
  city,
  firstLoad,
  reduced,
}: {
  city: HeroBCity;
  firstLoad: boolean;
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: HERO_B_MAP_BASE }} />
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

      <div className="hero-b-map-slot">
        <AnimatePresence initial={true}>
          <motion.img
            key={city.key}
            src={city.mapImg}
            alt=""
            aria-hidden="true"
            className="hero-b-map"
            initial={
              reduced
                ? { opacity: 0 }
                : firstLoad
                  ? { opacity: 0, filter: "blur(0px)", scale: 1 }
                  : { opacity: 0, filter: "blur(24px)", scale: 1.05 }
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
        .hero-b-map-slot {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 880px;
          height: 800px;
          max-width: 100%;
          opacity: 1;
          -webkit-mask-image:
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, #000 42%),
            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 14%, #000 28%);
          mask-image:
            linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 22%, #000 42%),
            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 14%, #000 28%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
        }
        .hero-b-map {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: right bottom;
          user-select: none;
          pointer-events: none;
        }
        @media (max-width: 1100px) {
          .hero-b-map-slot { opacity: 1; }
        }
        @media (max-width: 680px) {
          .hero-b-map-slot {
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 1;
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%);
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------- listing card ---------------- */

function ListingCard({ city, reduced }: { city: HeroBCity; reduced: boolean }) {
  return (
    <motion.article
      className="hero-b-card"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0 }}
      animate={
        reduced
          ? { opacity: 1 }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: "0 16px 8px rgba(12,12,13,0.10), 0 4px 1px rgba(12,12,13,0.05)",
            }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      transition={
        reduced
          ? { duration: 0.3 }
          : { type: "spring", stiffness: 140, damping: 14, opacity: { duration: 0.3 } }
      }
      style={{ ...uiFont, boxShadow: "0 0 0 rgba(12,12,13,0)", transformOrigin: "bottom center" }}
    >
      <div className="hero-b-card-photo">
        <img src={city.cardImg} alt={city.listingTitle} className="hero-b-card-img" />
        <span className="hero-b-card-badge" style={{ ...uiFont, backgroundColor: BADGE_GREEN }}>
          New match • 1h ago
        </span>
      </div>

      <div className="hero-b-card-text">
        <h2 className="hero-b-card-title">{city.listingTitle}</h2>
        <p className="hero-b-card-hood">{city.neighborhood}</p>
        <p className="hero-b-card-price">
          {city.price}
          <span className="hero-b-card-per">/mo</span>
        </p>
      </div>

      <style>{`
        .hero-b-card {
          width: 280px;
          padding: 16px;
          border-radius: 24px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 8px;
          will-change: transform, opacity;
        }
        .hero-b-card-photo {
          position: relative;
          width: 100%;
          height: 144px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.08);
        }
        .hero-b-card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-b-card-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px 8px;
          border-radius: 80px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.2;
        }
        .hero-b-card-text { padding: 4px; display: flex; flex-direction: column; gap: 12px; }
        .hero-b-card-title {
          font-family: ${FONT_UI};
          font-variation-settings: ${UI_VAR};
          font-size: 16px;
          font-weight: 600;
          line-height: 1.3;
          letter-spacing: -0.42px;
          color: #000000;
        }
        .hero-b-card-hood {
          font-family: ${FONT_UI};
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: -0.31px;
          color: rgba(0,0,0,0.7);
        }
        .hero-b-card-price {
          font-family: ${FONT_UI};
          font-size: 24px;
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.45px;
          color: #000000;
        }
        .hero-b-card-per { font-size: 20px; font-weight: 500; color: rgba(0,0,0,0.6); }
        @media (max-width: 680px) {
          .hero-b-card { width: 100%; max-width: 320px; }
        }
      `}</style>
    </motion.article>
  );
}

/* ---------------- nav ---------------- */

function HeroBNav({ onSignup }: { onSignup: () => void }) {
  return (
    <nav
      className="relative z-20 flex h-[72px] items-center justify-between gap-6 bg-transparent py-5"
      style={uiFont}
    >
      <Link to="/" className="shrink-0 rounded-sm hero-b-ring" aria-label="Nook home">
        <img src={logoAsset.url} alt="Nook" width={81} height={28} style={{ width: 81, height: 28 }} />
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        {NAV_LINKS.map((l) => (
          <RollText
            key={l.href}
            as="a"
            href={l.href}
            className="rounded-sm text-sm font-medium transition-colors hero-b-ring"
            style={{ ...uiFont, color: COLORS.body }}
          >
            {l.label}
          </RollText>
        ))}
        <RollText
          as={Link}
          to="/blog"
          search={{ category: "all" }}
          className="rounded-sm text-sm font-medium transition-colors hero-b-ring"
          style={{ ...uiFont, color: COLORS.body }}
        >
          Blog
        </RollText>
      </div>

      <div className="flex items-center gap-2">
        <RollText
          as={Link}
          to="/login"
          className="hidden rounded-sm px-3 text-sm font-medium hero-b-ring md:inline-flex"
          style={{ ...uiFont, color: COLORS.navText }}
        >
          Sign in
        </RollText>
        <RollText
          as="button"
          type="button"
          onClick={onSignup}
          className="hero-b-nav-cta text-sm font-medium hero-b-ring"
          style={{ ...uiFont, color: COLORS.navText }}
        >
          Get free alerts
        </RollText>
      </div>

      <style>{`
        .hero-b-nav-cta {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(6px);
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .hero-b-nav-cta:hover {
          background: ${COLORS.surfaceHover};
          border-color: ${COLORS.borderHover};
        }
        .hero-b-ring:focus-visible {
          outline: 2px solid ${COLORS.pillCity};
          outline-offset: 2px;
        }
      `}</style>
    </nav>
  );
}

/* ---------------- H1 ---------------- */

function H1RevealB({ reduced }: { reduced: boolean }) {
  const lines = useMemo(() => H1_LINES.map((l) => l.split(" ")), []);
  let charIndex = 0;

  return (
    <h1 aria-label={H1_TEXT} className="hero-b-h1 mt-10" style={{ ...displayFont, color: COLORS.ink }}>
      {lines.map((words, li) => (
        <span key={li} className="hero-b-h1-line" aria-hidden="true">
          <span className="hero-b-h1-mask">
            {words.map((word, wi) => (
              <span key={wi} className="hero-b-h1-word">
                {word.split("").map((ch, ci) => {
                  const i = charIndex++;
                  return (
                    <motion.span
                      key={ci}
                      className="hero-b-h1-char"
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
        .hero-b-h1 {
          width: max-content;
          font-weight: 600;
          font-size: 68px;
          line-height: 69.36px;
          letter-spacing: -1.7px;
          font-optical-sizing: auto;
        }
        .hero-b-h1-line { display: block; width: max-content; overflow: hidden; padding: 0.15em 0; margin: -0.15em 0; white-space: nowrap; }
        .hero-b-h1-mask { display: block; }
        .hero-b-h1-word { display: inline-block; white-space: pre; }
        .hero-b-h1-char { display: inline-block; will-change: transform; }
        @media (max-width: 1100px) {
          .hero-b-h1-line { white-space: normal; width: auto; }
          .hero-b-h1 {
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

function CityPillB({ city, onPick }: { city: HeroBCity; onPick: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(HERO_B_CITIES.findIndex((c) => c.key === city.key));
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
      setActive((a) => (a + 1) % HERO_B_CITIES.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + HERO_B_CITIES.length) % HERO_B_CITIES.length);
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
        className="hero-b-pill hero-b-ring"
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
        <ul role="listbox" aria-label="Choose a city" className="hero-b-menu" tabIndex={-1}>
          {HERO_B_CITIES.map((c, i) => (
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
                className="hero-b-option hero-b-ring"
                style={{ backgroundColor: active === i ? "rgba(36,28,18,0.05)" : "transparent" }}
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
        .hero-b-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          backdrop-filter: blur(6px);
        }
        .hero-b-menu {
          position: absolute;
          left: 0;
          top: calc(100% + 8px);
          z-index: 30;
          width: 280px;
          padding: 6px;
          border-radius: 12px;
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.border};
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 32px rgba(36,28,18,0.12);
        }
        .hero-b-option {
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

function RollCtaB({ onClick, reduced }: { onClick: () => void; reduced: boolean }) {
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
      className="hero-b-cta hero-b-ring"
      style={{
        ...uiFont,
        backgroundColor: hover ? COLORS.clayHover : COLORS.clay,
        boxShadow: hover ? "4px 4px 0 rgba(36,28,18,0.14)" : "3px 3px 0 rgba(36,28,18,0.14)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <span className="hero-b-cta-roll" aria-hidden="true">
        <span className="hero-b-cta-layer">
          {chars.map((c, i) => (
            <motion.span
              key={`a-${i}`}
              className="hero-b-cta-char"
              animate={reduced ? { opacity: hover ? 0 : 1 } : { y: hover ? "-100%" : "0%" }}
              transition={{ duration: reduced ? 0.3 : 0.35, ease: EASE_REVEAL, delay: reduced ? 0 : i * 0.02 }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </span>
        <span className="hero-b-cta-layer hero-b-cta-layer-2">
          {chars.map((c, i) => (
            <motion.span
              key={`b-${i}`}
              className="hero-b-cta-char"
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
        .hero-b-cta {
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
        .hero-b-cta-roll { position: relative; display: block; overflow: hidden; line-height: 1.25; }
        .hero-b-cta-layer { display: flex; }
        .hero-b-cta-layer-2 { position: absolute; inset: 0; transform: translateY(100%); }
        .hero-b-cta-char { display: inline-block; will-change: transform; }
      `}</style>
    </button>
  );
}
