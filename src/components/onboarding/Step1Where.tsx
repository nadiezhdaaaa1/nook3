import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Pencil } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { RentSlider } from "@/components/onboarding/RentSlider";
import { MoveInPicker } from "@/components/onboarding/MoveInPicker";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { CITY_ACTIVE_LISTINGS } from "@/data/cities/icons";

export function Step1Where() {
  const navigate = useNavigate();
  const { city, budget, moveIn, movingOut, set, patch } = useOnboardingStore();
  void patch;
  const cityConfig = getCity(city);

  useEffect(() => {
    if (cityConfig && budget === null) {
      const d = cityConfig.budget.default;
      patch({
        budget: [Math.max(cityConfig.budget.min, Math.round(d * 0.5)), d],
        includeBrokerFee: cityConfig.brokerFeeDefault,
      });
    }
  }, [cityConfig, budget, patch]);

  const canContinue = Boolean(cityConfig && budget !== null);

  return (
    <div className="space-y-12">
      <header>
        <Eyebrow>Step 1 · Where & when</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          Where are you looking <span className="accent-italic">to live</span>?
        </h1>
        <p className="mt-4 text-base text-charcoal-600">
          Pick your city and tell us your budget.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-charcoal-950">
          1. Your city
        </h2>
        <CityPicker
          value={city}
          onChange={(id) => {
            const c = getCity(id);
            const d = c?.budget.default ?? null;
            patch({
              city: id,
              budget: c && d !== null ? [Math.max(c.budget.min, Math.round(d * 0.5)), d] : null,
              includeBrokerFee: c?.brokerFeeDefault ?? false,
            });
          }}
        />
      </section>

      {cityConfig && budget !== null && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-charcoal-950">
            2. Monthly rent range
          </h2>
          <RentSlider
            city={cityConfig}
            value={budget}
            onChange={(v) => set("budget", v)}
          />
        </section>
      )}

      {cityConfig && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-charcoal-950">
            3. Move-in date
          </h2>
          <MoveInPicker
            mode={moveIn.mode}
            date={moveIn.date}
            onChange={(mode, date) => set("moveIn", { mode, date })}
          />
        </section>
      )}

      {cityConfig && (
        <section>
          <label
            className="flex gap-3 items-start p-5 rounded-card bg-sage-100/60 border border-sage-300 cursor-pointer hover:border-sage-500 transition-colors"
          >
            <input
              type="checkbox"
              checked={movingOut}
              onChange={(e) => set("movingOut", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-sage-500 text-sage-700 focus:ring-sage-500"
            />
            <div>
              <div className="text-sm font-semibold text-charcoal-950">
                I'm also moving out of my current place
              </div>
              <div className="text-xs text-charcoal-600 mt-1">
                Share your move-out date later for <span className="font-semibold text-sage-900">$50 off Premium annual</span>.
              </div>
            </div>
          </label>
        </section>
      )}

      {cityConfig && (
        <p className="text-xs text-charcoal-500 text-center -mt-4">
          Today we're monitoring{" "}
          <span className="font-mono tabular-nums text-charcoal-700">
            {CITY_ACTIVE_LISTINGS[cityConfig.id].toLocaleString()}
          </span>{" "}
          active {cityConfig.displayName} listings.
        </p>
      )}

      <OnboardingFooter
        canContinue={canContinue}
        onBack={() => navigate({ to: "/" })}
        onNext={() => {
          set("lastStep", 2);
          navigate({ to: "/onboarding/step/$step", params: { step: "2" } });
        }}
      />
    </div>
  );
}

