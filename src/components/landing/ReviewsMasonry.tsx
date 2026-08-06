import {
  DISPLAY_VAR,
  FONT_DISPLAY,
  FONT_UI,
  UI_VAR,
} from "@/components/landing/heroA/heroCities";

const ui = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;
const display = { fontFamily: FONT_DISPLAY, fontVariationSettings: DISPLAY_VAR } as const;

const INK = "#2b2521";
const QUOTE_INK = "#241c12";
const BODY = "#4a4a46";
const LABEL = "#3a3a37";
const SUFFIX = "#7a6f5c";
const EMBER = "#cb4a0a";
const PURPLE = "#7040c1";
const OLIVE = "#748b12";

interface Attribution {
  name: string;
  suffix?: string;
  suffixColor?: string;
}

function Attribution({ name, suffix, suffixColor = SUFFIX }: Attribution) {
  return (
    <figcaption style={{ ...ui, fontSize: 14, color: QUOTE_INK }}>
      <span style={{ fontWeight: 650 }}>{name}</span>
      {suffix && (
        <span style={{ fontWeight: 400, color: suffixColor }}>{` · ${suffix}`}</span>
      )}
    </figcaption>
  );
}

function Rule({ color }: { color: string }) {
  return (
    <div
      style={{ width: 34, height: 2, borderRadius: 2, background: color, flexShrink: 0 }}
      aria-hidden
    />
  );
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 24,
  padding: 32,
  display: "flex",
  flexDirection: "column",
  gap: 24,
  margin: 0,
};

function QuoteCard({
  quote,
  rule,
  fontSize = 18,
  quoteColor = QUOTE_INK,
  label,
  attribution,
}: {
  quote: string;
  rule: string;
  fontSize?: number;
  quoteColor?: string;
  label?: string;
  attribution: Attribution;
}) {
  return (
    <figure style={cardStyle}>
      {label && (
        <div
          style={{
            ...ui,
            fontVariationSettings: `${UI_VAR}, "wght" 750`,
            fontWeight: 750,
            fontSize: 11,
            letterSpacing: "1.76px",
            textTransform: "uppercase",
            color: OLIVE,
          }}
        >
          {label}
        </div>
      )}
      <blockquote
        style={{
          ...display,
          fontWeight: 470,
          fontSize,
          lineHeight: 1.42,
          color: quoteColor,
          margin: 0,
        }}
      >
        {quote}
      </blockquote>
      <Rule color={rule} />
      <Attribution {...attribution} />
    </figure>
  );
}

function StatCard({
  figure,
  caption,
  quote,
  attribution,
}: {
  figure: string;
  caption: string;
  quote: string;
  attribution: Attribution;
}) {
  return (
    <figure style={cardStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            ...display,
            fontWeight: 540,
            fontSize: 54,
            lineHeight: "54px",
            color: INK,
          }}
        >
          {figure}
        </div>
        <div style={{ ...ui, fontSize: 14, lineHeight: "21px", color: SUFFIX }}>{caption}</div>
      </div>
      <blockquote
        style={{
          ...display,
          fontWeight: 470,
          fontSize: 16.5,
          lineHeight: 1.42,
          color: QUOTE_INK,
          margin: 0,
        }}
      >
        {quote}
      </blockquote>
      <Attribution {...attribution} />
    </figure>
  );
}

/* --------------------------------- cards -------------------------------- */

const priya = (
  <QuoteCard
    key="priya"
    quote="“The 'pet-friendly' filter actually means pet-friendly. I had a hard time with other apps' pet filters.”"
    rule={PURPLE}
    attribution={{ name: "Priya S." }}
  />
);

const twelveMin = (
  <StatCard
    key="12min"
    figure="12 min"
    caption="from listing to first inquiry."
    quote="“Sent me a 1BR at $2,400 twelve minutes after it posted. Got there at noon. Signed the lease that night.”"
    attribution={{ name: "Daniel K.", suffix: "Brooklyn" }}
  />
);

const featured = (
  <QuoteCard
    key="featured"
    label="Featured"
    quote="“I'll be honest — I signed up expecting to cancel after the trial. But the alerts were actually relevant. I got 4 matches in the first week that fit my exact budget. Two were apartments I would have missed.”"
    rule={OLIVE}
    fontSize={20}
    quoteColor={INK}
    attribution={{
      name: "Jake M.",
      suffix: "Premium · 3 months",
      suffixColor: "rgba(43,37,33,0.7)",
    }}
  />
);

const fourDays = (
  <StatCard
    key="4days"
    figure="4 days"
    caption="from setup to signed lease."
    quote="“Set up Nook on Friday, got a match Saturday morning at 8am, signed the lease Tuesday. The rent-stabilized badge sold me.”"
    attribution={{ name: "Maya R.", suffix: "Williamsburg" }}
  />
);

const sara = (
  <QuoteCard
    key="sara"
    quote="“The AI assistant is genuinely useful. I sent it a listing and it pulled the building's permit history and recent rent changes — made me ask the landlord questions I wouldn't have thought of.”"
    rule={PURPLE}
    attribution={{ name: "Sara L." }}
  />
);

const chris = (
  <QuoteCard
    key="chris"
    quote="“Moving cross-country, didn't know which neighborhood I wanted. Set up three searches in different areas. Killed two after a week, found my place through the third.”"
    rule={EMBER}
    attribution={{ name: "Chris D." }}
  />
);

export function ReviewsMasonry() {
  return (
    <section id="reviews" className="rv-section">
      <style>{`
        .rv-section { background: #f5f0e4; padding: 104px 24px; }
        .rv-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
        .rv-head-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-top: 20px; }
        .rv-h2 { font-size: 48px; line-height: 1.2; letter-spacing: -1.2px; margin: 0; }
        .rv-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: start; }
        .rv-col { display: flex; flex-direction: column; gap: 24px; }
        .rv-col-2, .rv-col-3, .rv-flat { display: none; }
        @media (max-width: 1100px) {
          .rv-head-row { flex-direction: column; align-items: flex-start; gap: 16px; }
          .rv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rv-col-1, .rv-col-b { display: none; }
          .rv-col-2, .rv-col-3 { display: flex; }
        }
        @media (max-width: 680px) {
          .rv-section { padding: 72px 20px; }
          .rv-h2 { font-size: clamp(32px, 6vw, 40px); letter-spacing: -0.8px; }
          .rv-grid { grid-template-columns: minmax(0, 1fr); }
          .rv-col-2, .rv-col-3 { display: none; }
          .rv-flat { display: flex; }
        }
      `}</style>

      <div className="rv-inner">
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{ width: 8, height: 8, borderRadius: 999, background: EMBER, flexShrink: 0 }}
              aria-hidden
            />
            <span style={{ ...ui, fontSize: 14, fontWeight: 500, color: LABEL }}>Reviews</span>
          </div>

          <div className="rv-head-row">
            <h2 className="rv-h2" style={{ ...display, fontWeight: 600, color: INK }}>
              What renters are actually saying.
            </h2>
            <p style={{ ...ui, fontSize: 18, lineHeight: 1.6, color: BODY, margin: 0 }}>
              Sourced from beta users · 6 of 200+
            </p>
          </div>
        </header>

        <div className="rv-grid">
          {/* 3-column (desktop) */}
          <div className="rv-col rv-col-1">
            {priya}
            {twelveMin}
          </div>
          <div className="rv-col rv-col-b">
            {featured}
            {fourDays}
          </div>
          <div className="rv-col rv-col-b">
            {sara}
            {chris}
          </div>

          {/* 2-column (≤1100px) */}
          <div className="rv-col rv-col-2">
            {priya}
            {twelveMin}
            {sara}
          </div>
          <div className="rv-col rv-col-3">
            {featured}
            {fourDays}
            {chris}
          </div>

          {/* single column (≤680px) */}
          <div className="rv-col rv-flat">
            {featured}
            {twelveMin}
            {priya}
            {fourDays}
            {sara}
            {chris}
          </div>
        </div>
      </div>
    </section>
  );
}
