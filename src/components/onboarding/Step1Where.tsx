import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Pencil, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import { CityPicker } from "@/components/onboarding/CityPicker";
import { RentSlider } from "@/components/onboarding/RentSlider";
import { MoveInPicker } from "@/components/onboarding/MoveInPicker";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity, type CityId } from "@/data/cities";
import { CITY_ACTIVE_LISTINGS } from "@/data/cities/icons";
import { CITY_TINT, CITY_PHOTO, CITY_ACCENT } from "@/data/cities/cards";

const H1: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 32,
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

const EASE = [0.22, 1, 0.36, 1] as const;

export function Step1Where() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { city, budget, moveIn, movingOut, set, patch } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [query, setQuery] = useState("");
  const [moveInChosen, setMoveInChosen] = useState(
    () => Boolean(moveIn.date) || useOnboardingStore.getState().lastStep > 1,
  );
  const [animatingId, setAnimatingId] = useState<CityId | null>(null);

  useEffect(() => {
    if (cityConfig && budget === null) {
      const d = cityConfig.budget.default;
      patch({
        budget: [Math.max(cityConfig.budget.min, Math.round(d * 0.5)), d],
        includeBrokerFee: cityConfig.brokerFeeDefault,
      });
    }
  }, [cityConfig, budget, patch]);

  // Release the interaction lock once the transition has finished.
  useEffect(() => {
    if (!animatingId) return;
    const t = setTimeout(() => setAnimatingId(null), reduce ? 200 : 1400);
    return () => clearTimeout(t);
  }, [animatingId, cityConfig, reduce]);

  const canContinue = Boolean(cityConfig && budget !== null && moveInChosen);

  const handleSelectCity = (id: CityId) => {
    setAnimatingId(id);
    setMoveInChosen(false);
    set("moveIn", { mode: "flexible" });
    set("city", id);
  };

  const handleClearCity = () => {
    set("city", null);
  };

  // Enter delays for the selected state (relative to when it mounts).
  const d = (t: number) => (reduce ? 0 : t);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header row */}
      <div className="ob-head flex items-center justify-between gap-6">
        <div style={{ maxWidth: 552 }}>
          <h1 className="font-display ob-h1" style={H1}>
            Pick your city
          </h1>
          <p style={SUB}>Where you searching for apartment</p>
        </div>
        {!cityConfig && (
          <div className="relative flex items-center shrink-0" style={{ width: 240 }}>
            <Search
              className="pointer-events-none absolute left-3 z-10"
              style={{ width: 20, height: 20, color: "#5a5a55" }}
            />
            <Input
              type="text"
              size="medium"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search cities..."
              autoComplete="off"
              aria-label="Search cities"
              className="w-full pl-10"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!cityConfig ? (
          <motion.div
            key="picker"
            className="ob-bleed"
            style={{ marginTop: 32 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { opacity: 1, transition: { duration: 0.55 } }
            }
            transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE }}
          >
            <CityPicker
              value={city}
              onChange={handleSelectCity}
              animatingId={animatingId}
              query={query}
            />
          </motion.div>
        ) : (
          <motion.div
            key="selected"
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reduce ? 0.15 : 0.3, ease: EASE }}
          >
            {/* Selected city banner */}
            <motion.div
              className="relative"
              style={{
                marginTop: 32,
                width: "100%",
                height: 68,
                background: CITY_TINT[cityConfig.id],
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: 16,
                overflow: "hidden",
                pointerEvents: animatingId ? "none" : "auto",
              }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduce ? 0.15 : 0.3, ease: EASE }}
            >
              <div
                className="absolute overflow-hidden"
                style={{
                  left: -8,
                  top: -6,
                  width: 80,
                  height: 80,
                  borderRadius: 9999,
                  background: "rgba(0,0,0,0.06)",
                }}
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
                className="font-display absolute flex items-center"
                style={{
                  left: 88,
                  top: 0,
                  bottom: 0,
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: 1.2,
                  letterSpacing: "-0.45px",
                  color: "#241c12",
                }}
              >
                {cityConfig.displayName}
              </div>
              <button
                type="button"
                onClick={handleClearCity}
                aria-label="Change city"
                className="ob-ghost-dark absolute inline-flex items-center justify-center"
                style={{
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  color: "#241c12",
                }}
              >
                <Pencil style={{ width: 18, height: 18 }} />
              </button>
            </motion.div>

            <div style={{ marginTop: 80, display: "flex", flexDirection: "column", gap: 40 }}>
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.3, delay: d(0.3), ease: EASE }}
              >
                <h2 className="font-display ob-h1" style={H1}>
                  Let's narrow down{" "}
                  <span style={{ color: CITY_ACCENT[cityConfig.id] }}>
                    {cityConfig.displayName}
                  </span>
                </h2>
                <p style={SUB}>Tell us your rent range and when you need to move</p>
              </motion.div>

              {budget !== null && (
                <motion.div
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.3, delay: d(0.38), ease: EASE }}
                >
                  <h3 className="font-display" style={H2}>
                    1. Monthly rent range
                  </h3>
                  <div style={{ marginTop: 16 }}>
                    <RentSlider city={cityConfig} value={budget} onChange={(v) => set("budget", v)} />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.3, delay: d(0.46), ease: EASE }}
              >
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
              </motion.div>

              <motion.label
                className="flex items-center cursor-pointer"
                style={{
                  background: "#ebf0d5",
                  border: "1px solid #809917",
                  borderRadius: 16,
                  padding: "16px 20px",
                  gap: 16,
                }}
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.3, delay: d(0.54), ease: EASE }}
              >
                <input
                  type="checkbox"
                  checked={movingOut}
                  onChange={(e) => set("movingOut", e.target.checked)}
                  className="ob-check"
                />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#2b2521" }}>
                    I'm also moving out of my current place
                  </div>
                  <div style={{ fontSize: 14, lineHeight: "24px", color: "#4a4a46" }}>
                    Share your move-out date later for $50 off Premium annual.
                  </div>
                </div>
              </motion.label>

              <motion.p
                style={{ fontSize: 13, lineHeight: "16px", color: "#4a4a46" }}
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.3, delay: d(0.62), ease: EASE }}
              >
                Today we're monitoring {CITY_ACTIVE_LISTINGS[cityConfig.id].toLocaleString()} active{" "}
                {cityConfig.displayName} listings
              </motion.p>

              <motion.div
                className="flex items-center justify-between gap-2 ob-next-row"
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.3, delay: d(0.7), ease: EASE }}
              >
                <button
                  type="button"
                  disabled
                  className="ob-ghost inline-flex items-center disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    height: 56,
                    gap: 8,
                    padding: "0 24px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#241c12",
                  }}
                >
                  <ArrowLeft style={{ width: 16, height: 16 }} />
                  <span>Back</span>
                </button>
                <OriginButton
                  type="button"
                  variant="main"
                  size="big"
                  disabled={!canContinue}
                  onClick={() => {
                    set("lastStep", 2);
                    navigate({ to: "/onboarding/step/$step", params: { step: "2" } });
                  }}
                  className="ob-next"
                >
                  Next <ArrowRight style={{ width: 16, height: 16 }} />
                </OriginButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
