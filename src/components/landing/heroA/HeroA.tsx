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
import { RollText } from "@/components/ui/RollText";
import { OriginButton } from "@/components/ui/origin-button";
import { HeroNavSpacer } from "@/components/landing/shared/HeroScrollNav";
import { WaitlistDialog } from "@/components/landing/WaitlistDialog";
import { HeroEmailField } from "@/components/landing/shared/HeroEmailField";
import { useOnboardingStore } from "@/lib/onboarding/store";

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
const DRAG_THRESHOLD = 60;

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


  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const setOnboarding = useOnboardingStore((s) => s.set);
  const startSignup = () => {
    if (city.comingSoon) {
      setWaitlistOpen(true);
      return;
    }
    const trimmed = email.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) setOnboarding("email", trimmed);
    navigate({ to: "/onboarding" });
  };


  return (
    <section
      id="hero"
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor: COLORS.base, ...uiFont }}
    >
      <HeroBackground city={city} prevCity={prevIndex !== null ? HERO_CITIES[prevIndex] : null} reduced={!!reduced} />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-10">
        <HeroNavSpacer />

        <div className="hero-a-grid">
          <div className="hero-a-copy">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.25, ease: EASE_REVEAL }}
              className="relative z-30 flex flex-wrap items-center gap-4"
            >
              <CityPill city={city} onPick={(i) => goTo(i, -1)} />
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

            <motion.form
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.6 }}
              className="hero-a-cta-row mt-9"
              onSubmit={(e) => {
                e.preventDefault();
                startSignup();
              }}
            >
              {!city.comingSoon && (
                <HeroEmailField value={email} onChange={setEmail} fontStyle={uiFont} />
              )}

              {city.comingSoon ? (
                <OriginButton
                  variant="secondary"
                  onClick={startSignup}
                  className="focus-visible-ring"
                >
                  Join the watchlist
                </OriginButton>
              ) : (
                <OriginButton
                  variant="main"
                  onClick={startSignup}
                  className="focus-visible-ring"
                >
                  Start free
                </OriginButton>
              )}

              <span className="text-sm" style={{ ...uiFont, color: COLORS.muted, marginLeft: 12 }}>
                {city.comingSoon ? "Coming soon" : "3-day trial. Cancel anytime."}
              </span>
            </motion.form>

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
          grid-template-columns: minmax(0, auto) minmax(0, 1fr);
          gap: 40px;
          align-items: center;
          margin-top: 64px;
          padding-bottom: 112px;
        }
        .hero-a-deck-wrap { justify-self: center; max-width: 100%; }
        .hero-a-cta-row { display: flex; align-items: center; gap: 12px; }
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

      <WaitlistDialog
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        requestedCity={city.comingSoon ? city.cardTitle : null}
        requestedCityLabel={city.comingSoon ? city.cardTitle : null}
      />
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
          width: 780px;
          height: 675px;
          max-width: 100%;
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
          .hero-a-photo-slot { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- nav ---------------- */

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
          width: 280px;
          padding: 6px;
          border-radius: 12px;
          background: rgba(255,255,255,0.6);
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

function RollCta({
  onClick,
  label = "Get free alerts",
  secondary = false,
}: {
  onClick: () => void;
  label?: string;
  secondary?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const isSecondary = secondary || label === "Join the watchlist";

  return (
    <>
      <RollText
        as="button"
        type="button"
        onClick={onClick}
        onHoverChange={setHover}
        className="hero-a-cta focus-visible-ring"
        style={{
          ...uiFont,
          backgroundColor: isSecondary ? (hover ? "rgba(214,108,56,0.08)" : "transparent") : hover ? "#CE4F12" : "#D66C38",
          border: isSecondary ? "1.5px solid #D66C38" : "none",
          color: isSecondary ? "#D66C38" : "#ffffff",
          boxShadow: "none",
        }}
      >
        {label}
      </RollText>
      <style>{`
        .hero-a-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          height: 56px;
          padding: 0 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
      `}</style>
    </>
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
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        .hero-a-card-photo {
          position: relative;
          width: 100%;
          height: 160px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .hero-a-card-soon {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 80px;
          font-size: 12px;
          font-weight: 500;
          line-height: 1;
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
          padding: 8px 0;
        }
        .hero-a-stats-caption {
          flex: 0 0 100%;
          width: 100%;
          text-align: center;
          font-size: 13px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.31px;
          color: rgba(0,0,0,0.7);
        }
        .hero-a-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 110px;
        }
        .hero-a-stat:last-child { min-width: 0; }
        .hero-a-stat-roll {
          position: relative;
          display: block;
          overflow: hidden;
          height: 34px;
        }
        .hero-a-stat-value {
          display: block;
          white-space: nowrap;
          font-family: ${FONT_DISPLAY};
          font-variation-settings: ${DISPLAY_VAR};
          font-size: 28px;
          font-weight: 700;
          line-height: 34px;
          color: #000;
          font-variant-numeric: tabular-nums;
        }
        .hero-a-stat-suffix {
          font-size: 22px;
          font-weight: 600;
        }
        .hero-a-stat-label { font-size: 12px; color: #000; }

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
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD || Math.abs(info.velocity.x) > 300) {
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
      dragDirectionLock
      dragElastic={1}
      dragMomentum={false}
      onDragStart={() => setDragging(true)}
      onDragEnd={onDragEnd}
      style={{ x, rotate, cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y" }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: exitDir === 1 ? 520 : -520 }}
      transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.05 }}
    >

      <div className="hero-a-card-photo">
        <img src={city.cardImg} alt={`${city.cardTitle} skyline`} draggable={false} />
        {city.comingSoon && (
          <span
            className="hero-a-card-soon"
            style={{ ...uiFont, backgroundColor: COLORS.soonText, color: "#ffffff" }}
          >
            Coming soon
          </span>
        )}
        <span className="hero-a-card-title" style={displayFont}>
          {city.cardTitle}
        </span>
      </div>
      <div className="hero-a-stats">
        <span className="hero-a-stats-caption" style={uiFont}>
          Right now across all platforms
        </span>
        {city.stats.map((s, i) => (
          <div key={s.label} className="hero-a-stat">
            <span className="hero-a-stat-roll">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={`${s.value}-${s.suffix ?? ""}`}
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
                  {s.suffix ? (
                    <span className="hero-a-stat-suffix"> {s.suffix}</span>
                  ) : null}
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

