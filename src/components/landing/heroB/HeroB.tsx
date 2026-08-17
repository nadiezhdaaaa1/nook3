import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

import { OriginButton } from "@/components/ui/origin-button";
import { HeroNavSpacer } from "@/components/landing/shared/HeroScrollNav";
import { WaitlistDialog } from "@/components/landing/WaitlistDialog";
import { HeroEmailField } from "@/components/landing/shared/HeroEmailField";
import { useOnboardingStore } from "@/lib/onboarding/store";

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
import { useCardTilt } from "./useCardTilt";

const H1_LINES = ["Real-time apartment alerts.", "Find it before it's gone,", "without losing your mind."];
const H1_TEXT = "Real-time apartment alerts. Find it before it's gone, without losing your mind.";

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
      id="hero-b"
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor: HERO_B_BASE, ...uiFont }}
    >
      <HeroBBackground city={city} firstLoad={firstLoad} reduced={reduced} />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-10">
        <HeroNavSpacer />

        <div className="hero-b-grid">
          <div className="hero-b-copy">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.25, ease: EASE_REVEAL }}
              className="relative z-30 flex flex-wrap items-center gap-4"
            >
              <CityPillB city={city} onPick={pick} />
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

            <motion.form
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.3 : 0.45, ease: EASE_REVEAL, delay: reduced ? 0 : 0.6 }}
              className="hero-b-cta-row mt-9"
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
                  Find my apartment
                </OriginButton>
              )}
              <span className="text-sm" style={{ ...uiFont, color: COLORS.muted, marginLeft: 12 }}>
                {city.comingSoon ? "Coming soon" : "3 days free, then $14.99/month"}
              </span>
            </motion.form>

          </div>

          <div className="hero-b-card-col">
            <div className="hero-b-card-stage">
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
        .hero-b-cta-row { display: flex; align-items: center; gap: 12px; }
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

      <WaitlistDialog
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        requestedCity={city.comingSoon ? city.pillLabel : null}
        requestedCityLabel={city.comingSoon ? city.pillLabel : null}
      />
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
            top: auto;
            bottom: 0;
            width: 100%;
            height: 55%;
            opacity: 1;
            -webkit-mask-image: linear-gradient(to top, #000 72%, transparent 100%);
            mask-image: linear-gradient(to top, #000 72%, transparent 100%);
          }
          .hero-b-map {
            object-position: center bottom;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------- listing card ---------------- */

function ListingCard({ city, reduced }: { city: HeroBCity; reduced: boolean }) {
  const tilt = useCardTilt(reduced);
  const child = reduced
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_REVEAL } },
        },
      };

  return (
    <div className="hero-b-card-persp">
    <motion.article
      ref={tilt.ref as unknown as React.Ref<HTMLElement>}
      {...tilt.handlers}
      className={reduced ? "hero-b-card hero-b-card-static" : "hero-b-card"}
      initial={reduced ? { opacity: 1 } : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.3 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      variants={
        reduced
          ? undefined
          : {
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: EASE_REVEAL, staggerChildren: 0.1 },
              },
            }
      }
      transition={reduced ? { duration: 0.2 } : { duration: 0.5, ease: EASE_REVEAL }}
      tabIndex={0}
      style={{
        ...uiFont,
        rotateX: reduced ? 0 : tilt.rotateX,
        rotateY: reduced ? 0 : tilt.rotateY,
        transformStyle: "preserve-3d",
        boxShadow: "0 16px 8px rgba(12,12,13,0.10), 0 4px 1px rgba(12,12,13,0.05)",
      }}
    >
      <div className="hero-b-card-bloom" aria-hidden />


      {tilt.debug && (
        <div className="hero-b-card-debug" style={uiFont}>
          path: {tilt.debug.path} · perm: {tilt.debug.permission}
          <br />
          β {tilt.debug.beta === null ? "—" : tilt.debug.beta.toFixed(1)} · γ{" "}
          {tilt.debug.gamma === null ? "—" : tilt.debug.gamma.toFixed(1)} · n {tilt.debug.events}
        </div>
      )}


      <motion.span
        {...child}
        className="hero-b-card-badge"
        style={{ ...uiFont, backgroundColor: BADGE_GREEN }}
      >
        <span className="hero-b-card-badge-dot" />
        New match · 1h ago
      </motion.span>

      <motion.h2 {...child} className="hero-b-card-title">
        {city.listingTitle}
      </motion.h2>

      <motion.p {...child} className="hero-b-card-hood">
        {city.neighborhood}
      </motion.p>

      <motion.p {...child} className="hero-b-card-price">
        {city.price}
        <span className="hero-b-card-per">/mo</span>
      </motion.p>

      <motion.div {...child} className="hero-b-card-facts">
        <p className="hero-b-card-specs">{city.specs}</p>
        <p className="hero-b-card-transit">{city.transit}</p>
      </motion.div>

      <motion.div {...child} className="hero-b-card-why">
        <p className="hero-b-card-why-label">Why it matched</p>
        <div className="hero-b-card-chips">
          {city.reasons.map((r) => (
            <span key={r} className="hero-b-card-chip">
              {r}
            </span>
          ))}
        </div>
      </motion.div>

      <style>{`
        .hero-b-card-persp { perspective: 900px; }
        .hero-b-card {
          position: relative;
          width: 300px;
          padding: 20px;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.20);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          will-change: transform, opacity;

          /* GlowCard config — terracotta, subtle */
          --x: 0;
          --y: 0;
          --lx: 150;
          --ly: 170;
          --xp: 0.5;
          --yp: 0.5;
          --glow-o: 0;
          --size: 150;
          --border: 2;
          --radius: 24;
          --glow-rgb: 214 108 56;
          --bg-spot-opacity: 0.06;
          --border-spot-opacity: 0.55;
          --border-light-opacity: 0.18;
          --spot: calc(var(--lx) * 1px) calc(var(--ly) * 1px);

          background-color: #ffffff;
          background-image: radial-gradient(
            calc(var(--size) * 1px) circle at var(--spot),
            rgb(var(--glow-rgb) / var(--bg-spot-opacity)),
            transparent 100%
          );
          background-attachment: scroll;
          background-repeat: no-repeat;
        }

        .hero-b-card:focus-visible { outline: none; }
        /* border glow ring */
        .hero-b-card::before,
        .hero-b-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: calc(var(--border) * 1px);
          pointer-events: none;
          background-attachment: scroll;
          background-repeat: no-repeat;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: var(--glow-o);
          transition: opacity 200ms ease;
        }
        .hero-b-card::before {
          background-image: radial-gradient(
            calc(var(--size) * 0.75px) circle at
              calc(var(--lx) * 1px) calc(var(--ly) * 1px),
            rgb(var(--glow-rgb) / var(--border-spot-opacity)),
            transparent 100%
          );
        }
        .hero-b-card::after {
          background-image: radial-gradient(
            calc(var(--size) * 0.5px) circle at
              calc(var(--lx) * 1px) calc(var(--ly) * 1px),
            hsl(0 0% 100% / var(--border-light-opacity)),
            transparent 100%
          );
        }
        /* outer bloom */
        .hero-b-card-bloom {
          position: absolute;
          inset: calc(var(--border) * -1px);
          border-radius: calc((var(--radius) + var(--border)) * 1px);
          padding: calc(var(--border) * 1px);
          pointer-events: none;
          opacity: var(--glow-o);
          transition: opacity 200ms ease;
          background-attachment: scroll;
          background-repeat: no-repeat;
          background-image: radial-gradient(
            calc(var(--size) * 0.6px) circle at
              calc(var(--lx) * 1px + var(--border) * 1px) calc(var(--ly) * 1px + var(--border) * 1px),
            rgb(var(--glow-rgb) / 0.14),
            transparent 100%
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-b-card::before,
          .hero-b-card::after,
          .hero-b-card-bloom { display: none; }
          .hero-b-card { background-image: none; }
          .hero-b-card-static:hover,
          .hero-b-card-static:focus-visible {
            border-color: rgba(214, 108, 56, 0.45);
          }
        }

        .hero-b-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 80px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.2;
        }
        .hero-b-card-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 80px;
          background: #ffffff;
        }
        .hero-b-card-title {
          font-family: ${FONT_DISPLAY};
          font-variation-settings: ${DISPLAY_VAR};
          font-size: 19px;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.3px;
          color: #241C12;
          margin-top: 12px;
          margin-bottom: 2px;
        }
        .hero-b-card-hood {
          font-family: ${FONT_UI};
          font-size: 13.5px;
          font-weight: 400;
          line-height: 1.4;
          color: #6E6459;
          margin-bottom: 10px;
        }
        .hero-b-card-price {
          font-family: ${FONT_DISPLAY};
          font-variation-settings: ${DISPLAY_VAR};
          font-size: 28px;
          font-weight: 700;
          line-height: 1.15;
          color: #D66C38;
        }
        .hero-b-card-per { font-size: 16px; font-weight: 600; color: #D66C38; }
        .hero-b-card-facts {
          width: 100%;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hero-b-card-specs { font-size: 13.5px; line-height: 1.4; color: #241C12; }
        .hero-b-card-transit { font-size: 13.5px; line-height: 1.4; color: #6E6459; }
        .hero-b-card-why { width: 100%; margin-top: 14px; }
        .hero-b-card-why-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #6A820A;
          margin-bottom: 8px;
        }
        .hero-b-card-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .hero-b-card-chip {
          background: #EBF0D5;
          border-radius: 80px;
          padding: 4px 10px;
          font-size: 12.5px;
          line-height: 1.3;
          color: #3A3A37;
        }
        .hero-b-card-debug {
          position: absolute;
          bottom: 8px;
          right: 8px;
          z-index: 3;
          background: rgba(26,26,24,0.85);
          color: #FAF6EE;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 10px;
          line-height: 1.35;
          text-align: right;
          pointer-events: none;
        }
        @media (max-width: 680px) {

          .hero-b-card { width: 100%; max-width: 340px; }
        }
      `}</style>
    </motion.article>
    </div>
  );
}

/* ---------------- right-side city dot rail ---------------- */

function CityDotRail({
  index,
  onPick,
  reduced,
}: {
  index: number;
  onPick: (i: number) => void;
  reduced: boolean;
}) {
  return (
    <div className="hero-b-rail z-20" role="tablist" aria-label="Switch city">
      {HERO_B_CITIES.map((c, i) => (
        <button
          key={c.key}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={c.pillLabel}
          className="hero-b-rail-btn hero-b-ring"
          onClick={() => onPick(i)}
        >
          <span className={`hero-b-rail-dot${i === index ? " is-active" : ""}`} />
          <span className="hero-b-rail-tip" style={uiFont}>
            {c.pillLabel}
          </span>
        </button>
      ))}

      <style>{`
        .hero-b-rail {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .hero-b-rail-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: none;
          border: 0;
          cursor: pointer;
        }
        .hero-b-rail-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: rgba(43,37,33,0.28);
          transition: ${reduced ? "none" : "transform 0.25s ease, background-color 0.25s ease"};
        }
        .hero-b-rail-dot.is-active { background: ${COLORS.ink}; transform: scale(1.5); }
        .hero-b-rail-btn:hover .hero-b-rail-dot { background: ${COLORS.ink}; }
        .hero-b-rail-tip {
          position: absolute;
          right: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%) translateX(4px);
          white-space: nowrap;
          padding: 4px 10px;
          border-radius: 80px;
          font-size: 12px;
          font-weight: 500;
          color: ${COLORS.pillCity};
          background: rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(12,12,13,0.1);
          opacity: 0;
          pointer-events: none;
          transition: ${reduced ? "opacity 0.15s linear" : "opacity 0.2s ease, transform 0.2s ease"};
        }
        .hero-b-rail-btn:hover .hero-b-rail-tip,
        .hero-b-rail-btn:focus-visible .hero-b-rail-tip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
        @media (max-width: 680px) {
          .hero-b-rail { display: none; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- nav ---------------- */


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
          font-size: 58px;
          line-height: 59.2px;
          letter-spacing: -1.54px;
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
            font-size: clamp(40px, 7vw, 52px);
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
          border: 1px solid rgba(0,0,0,0.20);
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
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(0,0,0,0.20);
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

