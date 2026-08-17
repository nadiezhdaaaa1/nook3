import shieldAsset from "@/assets/shield.png.asset.json";
import lightningAsset from "@/assets/lightning.png.asset.json";
import funnelAsset from "@/assets/funnel.png.asset.json";
import sparkleAsset from "@/assets/sparkle.png.asset.json";
import magnifierAsset from "@/assets/magnifier.png.asset.json";
import pauseAsset from "@/assets/pause.png.asset.json";
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
const LABEL = "#3a3a37";
const EMBER = "#cb4a0a";

const ITEMS = [
  {
    icon: shieldAsset.url,
    title: "Verified rent-stabilized units",
    body: "Every listing cross-checked against public databases. Real regulation gets a badge. Fake claims don't.",
  },
  {
    icon: lightningAsset.url,
    title: "First-mover advantage",
    body: "Best apartments vanish in hours. We ping you within minutes — before the open house crowd shows up.",
  },
  {
    icon: funnelAsset.url,
    title: "Filters that actually filter",
    body: "Pet-friendly that means pet-friendly. Budget that means budget. No bait pricing, no fake matches.",
  },
  {
    icon: sparkleAsset.url,
    title: "Wren AI on every match",
    body: "Ask Wren anything about a listing — price, neighborhood, commute. Answers, not just listings.",
  },
  {
    icon: magnifierAsset.url,
    title: "3 searches at once",
    body: "Two neighborhoods? 1BR or split 2BR? Run searches in parallel, no filter resets.",
  },
  {
    icon: pauseAsset.url,
    title: "Your filters stay put",
    body: "Set it once and it keeps running. Edit or delete a search any time — nothing to re-enter.",
  },
];

export function WhatYouGetGrid() {
  return (
    <section id="what" className="wyg-section">
      <style>{`
        .wyg-section { background: #f5f0e4; padding: 88px 24px; }
        .wyg-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
        .wyg-h2 { font-size: 48px; line-height: 54px; letter-spacing: -1.2px; max-width: 760px; }
        .wyg-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
        @media (max-width: 1100px) {
          .wyg-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 680px) {
          .wyg-section { padding: 64px 20px; }
          .wyg-grid { grid-template-columns: minmax(0, 1fr); }
          .wyg-h2 { font-size: clamp(32px, 6vw, 40px); line-height: 1.14; letter-spacing: -0.8px; }
        }
      `}</style>

      <div className="wyg-inner">
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{ width: 8, height: 8, borderRadius: 999, background: EMBER, flexShrink: 0 }}
              aria-hidden
            />
            <span style={{ ...ui, fontSize: 14, fontWeight: 500, color: LABEL }}>
              What's inside
            </span>
          </div>

          <h2 className="wyg-h2" style={{ ...display, fontWeight: 600, color: INK, marginTop: 20 }}>
            More than apartment alerts. A full rental search assistant.
          </h2>

          <p style={{ ...ui, fontSize: 18, lineHeight: 1.6, color: BODY, marginTop: 16 }}>
            Here's what Nook does that a free site refresh doesn't.
          </p>
        </header>

        <div className="wyg-grid">
          {ITEMS.map((it) => (
            <article
              key={it.title}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.20)",
                borderRadius: 20,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: 48,
                    height: 64,
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={it.icon}
                    alt={it.title}
                    width={70}
                    height={70}
                    loading="lazy"
                    style={{ width: 70, height: 70, objectFit: "contain", flexShrink: 0 }}
                  />
                </div>
                <h3
                  style={{
                    ...display,
                    fontWeight: 600,
                    fontSize: 24,
                    lineHeight: "30px",
                    letterSpacing: "-0.4px",
                    color: INK,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {it.title}
                </h3>
              </div>

              <p style={{ ...ui, fontSize: 15, lineHeight: 1.5, color: BODY }}>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
