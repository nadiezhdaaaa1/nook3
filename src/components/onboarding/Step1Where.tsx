import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Search, ArrowRight } from "lucide-react";
import { CityPicker } from "@/components/onboarding/CityPicker";
import { RentSlider } from "@/components/onboarding/RentSlider";
import { MoveInPicker } from "@/components/onboarding/MoveInPicker";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { CITY_ACTIVE_LISTINGS } from "@/data/cities/icons";
import { CITY_TINT, CITY_PHOTO } from "@/data/cities/cards";

const H1: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 40,
  lineHeight: 1.2,
  letterSpacing: "-0.96px",
  color: "#241c12",
};

const SUB: React.CSSProperties = {
  marginTop: 8,
  fontSize: 16,
  lineHeight: "24px",
  color: "#5a5a55",
};

const H2: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 18,
  lineHeight: "28px",
  letterSpacing: "-0.27px",
  color: "#241c12",
};

export function Step1Where() {
  const navigate = useNavigate();
  const { city, budget, moveIn, movingOut, set, patch } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [query, setQuery] = useState("");
  const [moveInChosen, setMoveInChosen] = useState(
    () => Boolean(moveIn.date) || useOnboardingStore.getState().lastStep > 1,
  );

  useEffect(() => {
    if (cityConfig && budget === null) {
      const d = cityConfig.budget.default;
      patch({
        budget: [Math.max(cityConfig.budget.min, Math.round(d * 0.5)), d],
        includeBrokerFee: cityConfig.brokerFeeDefault,
      });
    }
  }, [cityConfig, budget, patch]);

  const canContinue = Boolean(cityConfig && budget !== null && moveInChosen);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header row */}
      <div className="ob-head flex items-start justify-between gap-6">
        <div>
          <h1 className="font-display" style={H1}>
            Pick your city
          </h1>
          <p style={SUB}>Where you searching for apartment</p>
        </div>
        <div
          className="ob-search relative flex items-center shrink-0"
          style={{
            width: 240,
            height: 48,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.2)",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <Search style={{ width: 20, height: 20, color: "rgba(36,28,18,0.5)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities..."
            autoComplete="off"
            aria-label="Search cities"
            className="w-full bg-transparent focus:outline-none"
            style={{ fontSize: 14, color: "#241c12" }}
          />
        </div>
      </div>

      {!cityConfig && (
        <div className="ob-fade-up ob-bleed" style={{ marginTop: 32 }}>
          <CityPicker value={city} onChange={(id) => set("city", id)} query={query} />
        </div>
      )}

      {cityConfig && (
        <>
          <div
            className="ob-fade-up flex items-center"
            style={{
              marginTop: 32,
              background: CITY_TINT[cityConfig.id],
              borderRadius: 24,
              padding: "12px 24px 12px 12px",
              gap: 20,
            }}
          >
            <div
              className="overflow-hidden shrink-0 ob-banner-photo"
              style={{ width: 100, height: 72, borderRadius: 14, background: "rgba(0,0,0,0.06)" }}
            >
              {CITY_PHOTO[cityConfig.id] && (
                <img
                  src={CITY_PHOTO[cityConfig.id]}
                  alt={cityConfig.displayName}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div
              className="font-display flex-1 ob-banner-name"
              style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.45px", color: "#241c12" }}
            >
              {cityConfig.displayName}
            </div>
            <button
              type="button"
              onClick={() => set("city", null)}
              className="ob-ghost-dark inline-flex items-center shrink-0"
              style={{ gap: 8, padding: "12px 16px", borderRadius: 12, fontWeight: 600, fontSize: 14, color: "#241c12" }}
            >
              <Pencil style={{ width: 20, height: 20 }} /> Change
            </button>
          </div>

          <div className="ob-fade-up" style={{ marginTop: 80, display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <h2 className="font-display" style={H1}>
                Let's narrow down <span style={{ color: "#5a5a55" }}>{cityConfig.displayName}</span>
              </h2>
              <p style={SUB}>Tell us your rent range and when you need to move</p>
            </div>

            {budget !== null && (
              <div>
                <h3 className="font-display" style={H2}>
                  1. Monthly rent range
                </h3>
                <div style={{ marginTop: 16 }}>
                  <RentSlider city={cityConfig} value={budget} onChange={(v) => set("budget", v)} />
                </div>
              </div>
            )}

            <div>
              <h3 className="font-display" style={H2}>
                2. Move-in date
              </h3>
              <div style={{ marginTop: 16 }}>
                <MoveInPicker
                  mode={moveIn.mode}
                  date={moveIn.date}
                  chosen={moveInChosen}
                  onChange={(mode, date) => {
                    setMoveInChosen(true);
                    set("moveIn", { mode, date });
                  }}
                />
              </div>
            </div>

            <label
              className="flex items-start cursor-pointer"
              style={{
                background: "#ebf0d5",
                border: "1px solid #809917",
                borderRadius: 16,
                padding: "16px 20px",
                gap: 16,
              }}
            >
              <input
                type="checkbox"
                checked={movingOut}
                onChange={(e) => set("movingOut", e.target.checked)}
                className="ob-check"
              />
              <div>
                <div style={{ fontWeight: 500, fontSize: 18, lineHeight: "24px", color: "#2b2521" }}>
                  I'm also moving out of my current place
                </div>
                <div style={{ marginTop: 4, fontSize: 15, lineHeight: "24px", color: "#4a4a46" }}>
                  Share your move-out date later for $50 off Premium annual.
                </div>
              </div>
            </label>

            <p style={{ fontSize: 13, lineHeight: "16px", color: "#4a4a46" }}>
              Today we're monitoring {CITY_ACTIVE_LISTINGS[cityConfig.id].toLocaleString()} active{" "}
              {cityConfig.displayName} listings
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  set("lastStep", 2);
                  navigate({ to: "/onboarding/step/$step", params: { step: "2" } });
                }}
                className="ob-next inline-flex items-center justify-center"
                style={{
                  gap: 8,
                  background: "#d66c38",
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "16px 24px",
                  fontWeight: 500,
                  fontSize: 16,
                  opacity: canContinue ? 1 : 0.35,
                  cursor: canContinue ? "pointer" : "not-allowed",
                }}
              >
                Next <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
