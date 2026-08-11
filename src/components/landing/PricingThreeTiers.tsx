import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Lock, X } from "lucide-react";
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
  locked?: boolean;
}

export interface Tier {
  id: string;
  /** Stored plan value this tier maps to. */
  plan: "free" | "premium";
  /** Billing cycle this tier maps to. */
  billingCycle: Cycle;
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

const CANCEL_TAIL =
  "Cancel anytime in Account → Subscription in two steps.";

const TIERS: Tier[] = [
  {
    id: "intro",
    plan: "free",
    billingCycle: "monthly",
    name: "3 days free",
    tagline: "See how it works, on your real search.",
    price: { monthly: "$0", annual: "$0" },
    priceSuffix: "for 3 days → then $14.99/month",
    finePrint: {
      monthly: `Card required. After 3 days $14.99/month until cancelled. ${CANCEL_TAIL}`,
      annual: `Card required. After 3 days $14.99/month until cancelled. ${CANCEL_TAIL}`,
    },
    cta: "Start 3 days free",
    ctaTo: "/onboarding",
    variant: "light",
    features: [
      { text: "Daily or weekly alerts — you choose", included: true },
      { text: "Alerts with no delay", included: true },
      { text: "Only your 3 best matches per email", included: false, locked: true },
      { text: "1 search — the one you set up at signup", included: false },
    ],
  },
  {
    id: "pro",
    plan: "premium",
    billingCycle: "monthly",
    name: "Pro",
    tagline: "When you're actively looking.",
    price: { monthly: "$14.99", annual: "$14.99" },
    priceSuffix: "/month",
    finePrint: {
      monthly: `Auto-renews at $14.99/month until cancelled. ${CANCEL_TAIL}`,
      annual: `Auto-renews at $14.99/month until cancelled. ${CANCEL_TAIL}`,
    },
    cta: "Get Pro now",
    ctaTo: "/signup",
    variant: "warm",
    features: [
      { text: "Daily or weekly alerts — you choose", included: true },
      { text: "Alerts with no delay", included: true },
      { text: "Every match we find", included: true },
      { text: "Up to 3 searches — own filters, own cities", included: true },
    ],
  },
  {
    id: "pro_annual",
    plan: "premium",
    billingCycle: "annual",
    name: "Pro annual",
    tagline: "Same plan, paid once a year.",
    price: { monthly: "$7.99", annual: "$7.99" },
    priceSuffix: "/month · billed $95.88/year",
    finePrint: {
      monthly: `Auto-renews at $95.88/year until cancelled. ${CANCEL_TAIL}`,
      annual: `Auto-renews at $95.88/year until cancelled. ${CANCEL_TAIL}`,
    },
    cta: "Get Pro annual",
    ctaTo: "/signup",
    variant: "cool",
    features: [
      { text: "Daily or weekly alerts — you choose", included: true },
      { text: "Alerts with no delay", included: true },
      { text: "Every match we find", included: true },
      { text: "Up to 3 searches — own filters, own cities", included: true },
    ],
  },
];

export const WARM_BG = [
  "radial-gradient(120% 110% at 0% 0%, rgba(255,205,0,0.14) 0%, rgba(255,205,0,0) 60%)",
  "radial-gradient(120% 110% at 100% 0%, rgba(203,74,10,0.26) 0%, rgba(203,74,10,0) 60%)",
  "radial-gradient(130% 120% at 100% 100%, rgba(122,143,55,0.30) 0%, rgba(122,143,55,0) 60%)",
  "radial-gradient(120% 110% at 0% 100%, rgba(120,165,200,0.12) 0%, rgba(120,165,200,0) 60%)",
].join(", ");

export const COOL_BG = [
  "radial-gradient(120% 110% at 0% 0%, rgba(38,0,255,0.14) 0%, rgba(38,0,255,0) 60%)",
  "radial-gradient(120% 110% at 100% 0%, rgba(203,10,94,0.26) 0%, rgba(203,10,94,0) 60%)",
  "radial-gradient(130% 120% at 100% 100%, rgba(81,55,143,0.30) 0%, rgba(81,55,143,0) 60%)",
  "radial-gradient(120% 110% at 0% 100%, rgba(149,120,200,0.12) 0%, rgba(149,120,200,0) 60%)",
].join(", ");

export const DARK_SHADOW =
  "0 2px 2px rgba(36,28,18,0.08), 0 24px 28px rgba(36,28,18,0.28)";


interface PricingThreeTiersProps {
  cycle?: Cycle;
  defaultCycle?: Cycle;
  onCycleChange?: (c: Cycle) => void;
  onTierSelect?: (tier: Tier) => void;
  tierCta?: Partial<Record<string, string>>;
  compactTop?: boolean;
}

export function PricingThreeTiers({
  cycle: controlledCycle,
  defaultCycle,
  onCycleChange,
  onTierSelect,
  tierCta,
  compactTop,
}: PricingThreeTiersProps) {
  const [internalCycle, setInternalCycle] = useState<Cycle>(defaultCycle ?? "monthly");
  const cycle = controlledCycle ?? internalCycle;
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.25;

  void onCycleChange;
  void setInternalCycle;

  return (
    <section
      id="pricing"
      className="pr-section"
      style={{ padding: compactTop ? "0 24px" : undefined }}
    >
      <style>{`
        .pr-section { background: #faf6ee; padding: 104px 24px; }
        .pr-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
        .pr-h2 { font-size: 48px; line-height: 54px; letter-spacing: -1.2px; }
        .pr-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
        .pr-card { position: relative; padding: 32px; border-radius: 24px; display: flex; flex-direction: column; gap: 16px; }
        .pr-cta:focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }
        .pr-card-dark .pr-cta:focus-visible,
        .pr-toggle-btn:focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }
        .pr-toggle-btn { transition: background-color 0.2s ease, color 0.2s ease; }
        .pr-toggle-btn[aria-checked="false"]:hover { background-color: rgba(255,255,255,0.5) !important; color: #241c12 !important; }
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
          <h2 className="pr-h2" style={{ ...display, fontWeight: 600, color: INK, marginTop: 0 }}>
            Choose your plan
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
            Start with 3 free days, then keep going for $14.99/month
          </p>
        </header>

        {/* Cards */}
        <div className="pr-grid">
          {TIERS.map((t) => (
            <PlanCard key={t.id} tier={t} cycle={cycle} dur={dur} onSelect={onTierSelect} ctaText={tierCta?.[t.id]} />
          ))}
        </div>

        <p
          style={{
            ...ui,
            fontSize: 14,
            lineHeight: 1.9,
            color: MUTED,
            maxWidth: 560,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          All plans include: all filters and must-haves · match explanations, including what's
          missing · quiet hours in your timezone · 24/7 monitoring of your city.
        </p>
      </div>
    </section>
  );
}

function badgeFor(tierId: string, _cycle: Cycle) {
  if (tierId === "pro_annual") return { text: "Save 47%", bg: LEAF, position: "right" as const };
  return null;
}


function PlanCard({
  tier,
  cycle,
  dur,
  onSelect,
  ctaText,
}: {
  tier: Tier;
  cycle: Cycle;
  dur: number;
  onSelect?: (tier: Tier) => void;
  ctaText?: string;
}) {
  const dark = tier.variant !== "light";
  const navigate = useNavigate();
  const badge = badgeFor(tier.id, cycle);
  const text = dark ? CREAM : "#241c12";
  const checkColor = dark ? "#c2dd93" : LEAF;

  const handleCta = () => {
    if (onSelect) {
      onSelect(tier);
    } else {
      navigate({ to: tier.ctaTo });
    }
  };

  const cta = ctaText ?? tier.cta;

  const cardStyle: React.CSSProperties = dark
    ? {
        backgroundColor: "#2c2415",
        backgroundImage: tier.variant === "warm" ? WARM_BG : COOL_BG,
        boxShadow: DARK_SHADOW,
        color: text,
      }
      : {
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.20)",
          color: text,
        };

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
          justifyContent: "flex-end",
          paddingLeft: 0,
          pointerEvents: "none",
        }}
        aria-hidden={!badge}
      >
        <AnimatePresence mode="wait" initial={false}>
          {badge && (
            <motion.span
              key={badge.text}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={
                dur === 0
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 520, damping: 12, mass: 0.6 }
              }
              style={{
                ...ui,
                transformOrigin: "center center",
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
        variant={
          tier.id === "intro"
            ? "tertiary"
            : tier.id === "pro"
              ? "premium"
              : "max"
        }
        style={{ borderRadius: 12 }}
        onClick={handleCta}
      >
        {cta}
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
