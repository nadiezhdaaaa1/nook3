import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { OriginButton } from "@/components/ui/origin-button";
import {
  DISPLAY_VAR,
  FONT_DISPLAY,
  FONT_UI,
  UI_VAR,
} from "@/components/landing/heroA/heroCities";

const ui = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;
const display = { fontFamily: FONT_DISPLAY, fontVariationSettings: DISPLAY_VAR } as const;

const INK = "#2b2521";
const BODY = "#4a4a46";
const MUTED = "#5a5a55";
const LABEL = "#3a3a37";
const EMBER = "#cb4a0a";
const CREAM = "#f8f3e1";
const LEAF = "#6a820a";

type Cycle = "monthly" | "annual";

interface FeatureItem {
  text: string;
  included: boolean;
}

interface Tier {
  id: string;
  name: string;
  tagline: string;
  price: Record<Cycle, string>;
  priceSuffix: string;
  finePrint?: Record<Cycle, string>;
  cta: string;
  ctaTo: string;
  variant: "light" | "warm" | "cool";
  features: FeatureItem[];
}

const FINE_TAIL =
  "until cancelled. Cancel anytime in Account → Subscription. No hidden fees. Cancel anytime.";

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get a feel for what's out there.",
    price: { monthly: "$0", annual: "$0" },
    priceSuffix: "forever",
    cta: "Get started",
    ctaTo: "/onboarding",
    variant: "light",
    features: [
      { text: "1 saved search", included: true },
      { text: "Email alerts (3-hour delay)", included: true },
      { text: "Up to 2 emails per day", included: true },
      { text: "Verified regulated unit badges", included: true },
      { text: "Browse Nook web app", included: true },
      { text: "Real-time alerts", included: false },
      { text: "Wren AI assistant", included: false },
      { text: "Search pause/resume", included: false },
      { text: "Move-out listing tool", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "When you're actively looking.",
    price: { monthly: "$14.99", annual: "$7.99" },
    priceSuffix: "/month",
    finePrint: {
      monthly: `Auto-renews at $14.99/month ${FINE_TAIL}`,
      annual: `Auto-renews at $95.88/year ${FINE_TAIL}`,
    },
    cta: "Start 3-day trial",
    ctaTo: "/signup",
    variant: "warm",
    features: [
      { text: "3 saved searches (run parallel)", included: true },
      { text: "Real-time email alerts (within minutes)", included: true },
      { text: "Unlimited email frequency", included: true },
      { text: "Verified regulated unit badges", included: true },
      { text: "Wren AI assistant — chat about any listing", included: true },
      { text: "Pause/resume searches anytime", included: true },
      { text: "Submit move-out listings ($50 reward)", included: true },
      { text: "Email support", included: true },
      { text: "Cross-search Wren comparison", included: false },
    ],
  },
  {
    id: "max",
    name: "Max",
    tagline: "For relocators and serious hunters.",
    price: { monthly: "$29", annual: "$19.08" },
    priceSuffix: "/month",
    finePrint: {
      monthly: `Auto-renews at $29/month ${FINE_TAIL}`,
      annual: `Auto-renews at $229/year ${FINE_TAIL}`,
    },
    cta: "Start 3-day trial",
    ctaTo: "/signup",
    variant: "cool",
    features: [
      { text: "Unlimited saved searches", included: true },
      { text: "Real-time email alerts", included: true },
      { text: "Verified regulated unit badges", included: true },
      { text: "Wren AI assistant", included: true },
      { text: "Cross-search Wren comparison", included: true },
      { text: "Roommate mode — 3 user seats", included: true },
      { text: "Pause/resume searches", included: true },
      { text: "Submit move-out listings ($50 reward)", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new cities", included: true },
    ],
  },
];

const WARM_BG = [
  "radial-gradient(120% 110% at 0% 0%, rgba(255,205,0,0.14) 0%, rgba(255,205,0,0) 60%)",
  "radial-gradient(120% 110% at 100% 0%, rgba(203,74,10,0.26) 0%, rgba(203,74,10,0) 60%)",
  "radial-gradient(130% 120% at 100% 100%, rgba(122,143,55,0.30) 0%, rgba(122,143,55,0) 60%)",
  "radial-gradient(120% 110% at 0% 100%, rgba(120,165,200,0.12) 0%, rgba(120,165,200,0) 60%)",
].join(", ");

const COOL_BG = [
  "radial-gradient(120% 110% at 0% 0%, rgba(38,0,255,0.14) 0%, rgba(38,0,255,0) 60%)",
  "radial-gradient(120% 110% at 100% 0%, rgba(203,10,94,0.26) 0%, rgba(203,10,94,0) 60%)",
  "radial-gradient(130% 120% at 100% 100%, rgba(81,55,143,0.30) 0%, rgba(81,55,143,0) 60%)",
  "radial-gradient(120% 110% at 0% 100%, rgba(149,120,200,0.12) 0%, rgba(149,120,200,0) 60%)",
].join(", ");

const DARK_SHADOW =
  "0 2px 2px rgba(36,28,18,0.08), 0 24px 28px rgba(36,28,18,0.28)";

export function PricingThreeTiers() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const dur = reduce ? 0 : 0.25;

  return (
    <section id="pricing" className="pr-section">
      <style>{`
        .pr-section { background: #faf6ee; padding: 104px 24px; }
        .pr-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
        .pr-h2 { font-size: 48px; line-height: 54px; letter-spacing: -1.2px; }
        .pr-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
        .pr-card { position: relative; padding: 32px; border-radius: 24px; display: flex; flex-direction: column; gap: 16px; }
        .pr-cta:focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }
        .pr-card-dark .pr-cta:focus-visible,
        .pr-toggle-btn:focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }
        .pr-card-dark .pr-cta:focus-visible { outline-color: ${CREAM}; }
        @media (max-width: 1100px) {
          .pr-grid { grid-template-columns: minmax(0, 1fr); justify-items: center; }
          .pr-card { width: 100%; max-width: 480px; }
        }
        @media (max-width: 680px) {
          .pr-section { padding: 72px 20px; }
          .pr-h2 { font-size: clamp(32px, 6vw, 40px); line-height: 1.14; letter-spacing: -0.8px; }
          .pr-toggle { width: 100%; max-width: 320px; }
          .pr-toggle-btn { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="pr-inner">
        <header style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{ width: 8, height: 8, borderRadius: 999, background: EMBER, flexShrink: 0 }}
              aria-hidden
            />
            <span style={{ ...ui, fontSize: 14, fontWeight: 500, color: LABEL }}>Pricing</span>
          </div>

          <h2 className="pr-h2" style={{ ...display, fontWeight: 600, color: INK, marginTop: 20 }}>
            Three ways to use Nook
          </h2>

          <p
            style={{
              ...ui,
              fontSize: 18,
              lineHeight: 1.6,
              color: BODY,
              marginTop: 16,
            }}
          >
            Start free. Upgrade when you're serious about moving.
          </p>
        </header>

        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="pr-toggle"
            role="radiogroup"
            aria-label="Billing cycle"
            style={{
              display: "inline-flex",
              gap: 0,
              padding: 4,
              borderRadius: 16,
              background: "rgba(0,0,0,0.08)",
              height: 52,
              boxSizing: "border-box",
            }}
          >
            {(["monthly", "annual"] as Cycle[]).map((c) => {
              const active = cycle === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCycle(c)}
                  className="pr-toggle-btn"
                  style={{
                    ...ui,
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "12px 20px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: active ? INK : BODY,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="pr-toggle-pill"
                      transition={{ duration: dur, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 12,
                        background: "#ffffff",
                        boxShadow:
                          "0 1px 2px rgba(12,12,13,0.10), 0 1px 2px rgba(12,12,13,0.05)",
                      }}
                      aria-hidden
                    />
                  )}
                  <span style={{ position: "relative" }}>
                    {c === "monthly" ? "Monthly" : "Annual"}
                  </span>
                  {c === "annual" && (
                    <span style={{ position: "relative", color: LEAF }}>-47% off</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div className="pr-grid">
          {TIERS.map((t) => (
            <PlanCard key={t.id} tier={t} cycle={cycle} dur={dur} />
          ))}
        </div>

        <p
          style={{
            ...ui,
            fontSize: 14,
            lineHeight: 1.9,
            color: MUTED,
            maxWidth: 440,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          All plans include 24/7 monitoring of the rental market in your city. Cancel within 7
          days for a full refund. After that, prorated.
        </p>
      </div>
    </section>
  );
}

function badgeFor(tierId: string, cycle: Cycle) {
  if (cycle === "monthly") {
    if (tierId === "premium")
      return { text: "Most popular", bg: LEAF, position: "center" as const };
    return null;
  }
  if (tierId === "premium") return { text: "-47% off", bg: LEAF, position: "right" as const };
  if (tierId === "max") return { text: "-34% off", bg: "#7040C1", position: "right" as const };
  return null;
}

function PlanCard({ tier, cycle, dur }: { tier: Tier; cycle: Cycle; dur: number }) {
  const dark = tier.variant !== "light";
  const badge = badgeFor(tier.id, cycle);
  const text = dark ? CREAM : "#241c12";
  const checkColor = dark ? "#c2dd93" : LEAF;

  const cardStyle: React.CSSProperties = dark
    ? {
        backgroundColor: "#2c2415",
        backgroundImage: tier.variant === "warm" ? WARM_BG : COOL_BG,
        boxShadow: DARK_SHADOW,
        color: text,
      }
    : {
        background: "#ffffff",
        border: "1px solid rgba(36,28,18,0.12)",
        color: text,
      };

  const ctaStyle: React.CSSProperties =
    tier.variant === "light"
      ? { background: "transparent", border: "1.5px solid #d66c38", color: "#a05712" }
      : tier.variant === "warm"
        ? { background: "#dce9cc", color: "#445500", border: "none" }
        : { background: "#e7ddf2", color: "#42416a", border: "none" };

  return (
    <div className={`pr-card${dark ? " pr-card-dark" : ""}`} style={cardStyle}>
      {/* badge slot (space reserved in both states) */}
      <div
        style={{
          position: "absolute",
          top: -16,
          left: 0,
          right: 32,
          display: "flex",
          justifyContent: badge?.position === "right" ? "flex-end" : "center",
          paddingLeft: badge?.position === "right" ? 0 : 32,
          pointerEvents: "none",
        }}
        aria-hidden={!badge}
      >
        <AnimatePresence mode="wait" initial={false}>
          {badge && (
            <motion.span
              key={badge.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: dur, ease: "easeOut" }}
              style={{
                ...ui,
                fontVariationSettings: `${UI_VAR}, "wght" 750`,
                display: "inline-block",
                borderRadius: 999,
                padding: "7px 16px",
                background: badge.bg,
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "1.32px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {badge.text}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          ...ui,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "1.82px",
          textTransform: "uppercase",
        }}
      >
        {tier.name}
      </div>

      <div style={{ ...ui, fontSize: 14.5, opacity: 0.8 }}>{tier.tagline}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, paddingBottom: 8 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={tier.price[cycle]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: dur, ease: "easeOut" }}
            style={{ ...display, fontWeight: 600, fontSize: 46, lineHeight: "46px" }}
          >
            {tier.price[cycle]}
          </motion.span>
        </AnimatePresence>
        <span style={{ ...ui, fontSize: 14, fontWeight: 500, opacity: 0.7 }}>
          {tier.priceSuffix}
        </span>
      </div>

      <OriginButton
        className="w-full"
        style={{ borderRadius: 12 }}
        onClick={() => {
          const navigate = useNavigate();
          navigate({ to: tier.ctaTo });
        }}
      >
        {tier.cta}
      </OriginButton>

      {tier.finePrint && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={tier.finePrint[cycle]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: dur, ease: "easeOut" }}
            style={{ ...ui, fontSize: 12, lineHeight: "20px", opacity: 0.72, margin: 0 }}
          >
            {tier.finePrint[cycle]}
          </motion.p>
        </AnimatePresence>
      )}

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {tier.features.map((f) => (
          <li
            key={f.text}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              opacity: f.included ? 1 : 0.55,
            }}
          >
            {f.included ? (
              <Check size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 3, color: checkColor }} />
            ) : (
              <X size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 3 }} />
            )}
            <span
              style={{
                ...ui,
                fontSize: 14,
                lineHeight: "21px",
                textDecoration: f.included ? "none" : "line-through",
              }}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
