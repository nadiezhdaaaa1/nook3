import { useNavigate } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { Bed, Bath, Ruler, ShieldCheck, CheckCircle2, Check } from "lucide-react";
import keysAsset from "@/assets/keys.png.asset.json";
import { OriginButton } from "@/components/ui/origin-button";
import {
  COLORS,
  DISPLAY_VAR,
  FONT_DISPLAY,
  FONT_UI,
  UI_VAR,
} from "@/components/landing/heroA/heroCities";

const ui = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;
const display = { fontFamily: FONT_DISPLAY, fontVariationSettings: DISPLAY_VAR } as const;

const INK = COLORS.ink;
const BODY = COLORS.body;
const MUTED = COLORS.muted;
const LABEL = "#3a3a37";
const LEAF = "#6a820a";
const EMBER = "#cb4a0a";
const CLAY = COLORS.clay;
const GLASS = "rgba(255,255,255,0.4)";
const GLASS_BORDER = "#b3aea6";
const CARD_BORDER = "rgba(0,0,0,0.2)";
const CARD_SHADOW =
  "0 16px 32px -4px rgba(12,12,13,0.10), 0 4px 4px -4px rgba(12,12,13,0.05)";

const LABEL_STYLE = {
  ...ui,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "1.2px",
  color: MUTED,
  textTransform: "uppercase",
} as const;

export function HowItWorksThreeSteps() {
  const reduce = useReducedMotion();

  return (
    <section id="how" className="hiw-section">
      <style>{`
        .hiw-section { background: #faf6ee; padding: 104px 24px; }
        .hiw-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
        .hiw-h2 { font-size: 48px; line-height: 54px; letter-spacing: -1.2px; max-width: 760px; }
        .hiw-route { position: relative; height: 64px; }
        .hiw-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 72px; margin-top: 24px; }
        .hiw-pin-inline { display: none; }
        .hiw-dot-pulse { animation: hiw-pulse 1.6s ease-in-out infinite; }
        @keyframes hiw-pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        @media (prefers-reduced-motion: reduce) { .hiw-dot-pulse { animation: none } }
        @media (max-width: 1100px) {
          .hiw-route { display: none; }
          .hiw-steps { grid-template-columns: minmax(0, 1fr); gap: 48px; margin-top: 0; }
          .hiw-pin-inline { display: flex; }
        }
        @media (max-width: 680px) {
          .hiw-section { padding: 64px 20px; }
          .hiw-h2 { font-size: clamp(32px, 6vw, 40px); line-height: 1.14; letter-spacing: -0.8px; }
        }
      `}</style>

      <div className="hiw-inner">
        {/* Header */}
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden
              style={{ width: 8, height: 8, borderRadius: 999, background: EMBER }}
            />
            <span style={{ ...ui, fontSize: 14, fontWeight: 500, color: LABEL }}>
              How it works
            </span>
          </div>
          <h2
            className="hiw-h2"
            style={{ ...display, fontWeight: 600, color: INK, marginTop: 20 }}
          >
            From scrolling to signing: how to find an apartment fast
          </h2>
          <p style={{ ...ui, fontSize: 18, lineHeight: 1.6, color: BODY, marginTop: 16 }}>
            Three things happen the moment you sign up.
          </p>
        </header>

        {/* Route + steps */}
        <div>
          <div className="hiw-route" aria-hidden>
            <svg
              width="100%"
              height="64"
              viewBox="0 0 1200 64"
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0 }}
            >
              <line
                x1="18"
                y1="32"
                x2="1164"
                y2="32"
                stroke={GLASS_BORDER}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 7"
              />
            </svg>
            {[0, 424, 848].map((x, i) => (
              <div
                key={x}
                style={{
                  position: "absolute",
                  top: 14,
                  left: `${(x / 1200) * 100}%`,
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: LEAF,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...ui,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                {i + 1}
              </div>
            ))}
            <img
              src={keysAsset.url}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              style={{
                position: "absolute",
                right: -6,
                top: -8,
                width: 64,
                height: 64,
                objectFit: "contain",
                
              }}
            />
          </div>

          <div className="hiw-steps">
            <Step
              n={1}
              title="Tell us what you want"
              body="Budget, bedrooms, neighborhoods, deal-breakers. Save up to 3 searches at once."
              chip="Set up in 60 seconds"
            >
              <FormMock />
            </Step>
            <Step
              n={2}
              title="We do the watching"
              body="We scan the market 24/7 and check every listing against public records — violations, regulation status, complaints. The noise gets filtered out."
              chip="Updates every few minutes"
            >
              <LogMock reduce={!!reduce} />
            </Step>
            <Step
              n={3}
              title="You get pinged. You go see it."
              body="Email alert the second a match drops. Full address, real rent, one-tap to contact the landlord. You're usually first."
              chip="Alerts within 30 minutes"
            >
              <NotificationMock />
            </Step>
          </div>
        </div>

        {/* Closing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            paddingTop: 24,
          }}
        >
          <div
            style={{
              ...display,
              fontWeight: 600,
              fontSize: 28,
              letterSpacing: "-0.5px",
              color: INK,
              textAlign: "center",
            }}
          >
            Most users find their place within 3 weeks
          </div>
          <HiwCta to="/onboarding" label="Start apartment search" />
        </div>
      </div>
    </section>
  );
}

function HiwCta({ to, label }: { to: string; label: string }) {
  const navigate = useNavigate();
  return (
    <OriginButton
      variant="main"
      onClick={() => navigate({ to })}
      className="focus-visible-ring"
    >
      {label}
    </OriginButton>
  );
}

function Step({
  n,
  title,
  body,
  chip,
  children,
}: {
  n: number;
  title: string;
  body: string;
  chip: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="hiw-pin-inline"
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: LEAF,
          alignItems: "center",
          justifyContent: "center",
          ...ui,
          fontSize: 16,
          fontWeight: 500,
          color: "#ffffff",
          marginBottom: 16,
        }}
      >
        {n}
      </div>
      <h3
        style={{
          ...display,
          fontWeight: 600,
          fontSize: 24,
          lineHeight: "30px",
          letterSpacing: "-0.4px",
          color: INK,
        }}
      >
        {title}
      </h3>
      <p style={{ ...ui, fontSize: 15, lineHeight: 1.5, color: BODY, marginTop: 8 }}>
        {body}
      </p>
      <div
        style={{
          marginTop: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: GLASS,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        <CheckCircle2 size={16} style={{ color: LEAF }} strokeWidth={2} />
        <span style={{ ...ui, fontSize: 13, fontWeight: 500, color: LABEL }}>{chip}</span>
      </div>
      <div style={{ marginTop: 32 }}>{children}</div>
    </div>
  );
}

function cardStyle(padding: number) {
  return {
    background: "#ffffff",
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 20,
    boxShadow: CARD_SHADOW,
    padding,
  } as const;
}

function FormMock() {
  const bedrooms = ["1+", "2", "3"];
  const hoods = ["Upper West Side", "Upper East Side", "Stuyvesant Town/PCV", "East Village"];
  const checks = ["Pet-friendly", "Rent-regulated only", "No broker fee"];
  return (
    <div style={{ ...cardStyle(20), display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div>
          <div style={LABEL_STYLE}>Bedrooms</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {bedrooms.map((b, i) => (
              <span
                key={b}
                style={{
                  ...ui,
                  fontSize: 14,
                  fontWeight: 500,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: 8,
                  padding: 0,
                  background: i === 0 ? INK : GLASS,
                  border: `1px solid ${i === 0 ? INK : GLASS_BORDER}`,
                  color: i === 0 ? "#f8f3e1" : INK,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={LABEL_STYLE}>Budget</div>
          <div
            style={{
              position: "relative",
              marginTop: 20,
              height: 8,
              borderRadius: 24,
              background: "#e2d8c4",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 48,
                right: 35,
                top: 0,
                height: 8,
                borderRadius: 24,
                background: LEAF,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 48,
                top: -4,
                marginLeft: -8,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#ffffff",
                border: `2px solid ${LEAF}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 35,
                top: -4,
                marginRight: -8,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#ffffff",
                border: `2px solid ${LEAF}`,
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div style={LABEL_STYLE}>Neighborhoods</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {hoods.map((h) => (
            <span
              key={h}
              style={{
                ...ui,
                fontSize: 12.5,
                color: INK,
                background: GLASS,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: 8,
                padding: "6px 12px",
              }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {checks.map((c) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                background: LEAF,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={10} strokeWidth={3} style={{ color: "#ffffff" }} />
            </span>
            <span style={{ ...ui, fontSize: 13.5, color: INK }}>{c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function LogMock({ reduce }: { reduce: boolean }) {
  const lines = [
    "Scanning rental market…",
    "Checking building records…",
    "Verifying regulated units…",
    "Filtering for your match…",
  ];
  return (
    <div style={{ ...cardStyle(24), display: "flex", flexDirection: "column", gap: 16 }}>
      {lines.map((l, i) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            className={reduce ? undefined : "hiw-dot-pulse"}
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "rgba(203,74,10,0.18)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <span
              style={{ width: 7, height: 7, borderRadius: 999, background: EMBER }}
            />
          </span>
          <span style={{ ...ui, fontSize: 13.5, color: INK }}>{l}</span>
        </div>
      ))}
      <div style={{ height: 1, background: "rgba(0,0,0,0.08)" }} />
      <div style={LABEL_STYLE}>Last sweep · 47 seconds ago</div>
    </div>
  );
}

function NotificationMock() {
  return (
    <div style={{ position: "relative", paddingTop: 15 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 10,
          right: 10,
          height: 60,
          background: "rgba(255,255,255,0.75)",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          transform: "rotate(2deg)",
          boxShadow: "0 4px 12px rgba(36,28,18,0.10)",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "#ffffff",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          boxShadow: CARD_SHADOW,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              ...ui,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.56px",
              color: LEAF,
            }}
          >
            NEW MATCH 🏠
          </span>
          <span style={{ ...ui, fontSize: 11, color: MUTED }}>now</span>
        </div>
        <div style={{ ...ui, fontSize: 18, fontWeight: 500, lineHeight: 1.3, color: "#000000" }}>
          Loft-Style 1BR with Exposed Brick
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Spec icon={<Bed size={16} strokeWidth={1.75} />} label="1 Bed" />
          <Spec icon={<Bath size={16} strokeWidth={1.75} />} label="1 Bath" />
          <Spec icon={<Ruler size={16} strokeWidth={1.75} />} label="710 ft²" />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ ...display, fontWeight: 600, fontSize: 24, color: "#000000" }}>
            $2,850
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={12} strokeWidth={2} style={{ color: BODY }} />
            <span
              style={{
                ...ui,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: BODY,
              }}
            >
              Rent stabilization
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#241c12" }}>
      {icon}
      <span style={{ ...ui, fontSize: 14, fontWeight: 500, color: "#241c12" }}>{label}</span>
    </span>
  );
}
