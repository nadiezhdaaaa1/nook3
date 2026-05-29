import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { CityPicker } from "@/components/onboarding/CityPicker";
import { RentSlider } from "@/components/onboarding/RentSlider";
import { MoveInPicker } from "@/components/onboarding/MoveInPicker";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";

export function Step1Where() {
  const navigate = useNavigate();
  const { city, budget, moveIn, set, patch } = useOnboardingStore();
  const cityConfig = getCity(city);

  // when city changes, pre-fill budget if not set
  useEffect(() => {
    if (cityConfig && budget === null) {
      patch({
        budget: cityConfig.budget.default,
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
            patch({
              city: id,
              budget: c?.budget.default ?? null,
              includeBrokerFee: c?.brokerFeeDefault ?? false,
            });
          }}
        />
      </section>

      {cityConfig && budget !== null && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-charcoal-950">
            2. Maximum monthly rent
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
