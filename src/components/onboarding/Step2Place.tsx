import { useNavigate, Navigate } from "@tanstack/react-router";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { PillGroup } from "@/components/onboarding/PillGroup";
import { RentProtectionPicker } from "@/components/onboarding/RentProtectionPicker";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";

const BEDS = [
  { id: "studio", label: "Studio" },
  { id: "1br", label: "1 bed" },
  { id: "2br", label: "2 bed" },
  { id: "3br", label: "3 bed" },
  { id: "4br+", label: "4+ bed" },
];

const BATHS = [
  { id: "1ba", label: "1" },
  { id: "1.5ba", label: "1.5" },
  { id: "2ba", label: "2" },
  { id: "2.5ba", label: "2.5+" },
];

export function Step2Place() {
  const navigate = useNavigate();
  const {
    city, bedrooms, bathrooms, rentProtection, includeBrokerFee, neighborhoods,
    set, toggleBedroom,
  } = useOnboardingStore();
  const cityConfig = getCity(city);

  if (!cityConfig) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }

  const canContinue = bedrooms.length > 0;

  return (
    <div className="space-y-12">
      <header>
        <Eyebrow>Step 2 · Place type</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          What kind of <span className="accent-italic">place</span>?
        </h1>
        <p className="mt-4 text-base text-charcoal-600">
          Pick beds, baths, and your protection preferences.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-charcoal-950">
          1. Bedrooms <span className="text-charcoal-400 font-normal">· pick any</span>
        </h2>
        <PillGroup
          options={BEDS}
          value={bedrooms}
          multi
          onChange={toggleBedroom}
          size="lg"
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-charcoal-950">
          2. Minimum bathrooms
        </h2>
        <PillGroup
          options={BATHS}
          value={bathrooms}
          onChange={(id) => set("bathrooms", id)}
          size="lg"
        />
      </section>

      {cityConfig.rentProtection.enabled && (
        <section className="space-y-4">
          <RentProtectionPicker
            city={cityConfig}
            value={rentProtection}
            onChange={(v) => set("rentProtection", v)}
            neighborhoodCount={neighborhoods.length}
          />
        </section>
      )}

      {cityConfig.brokerFeeDefault && (
        <section>
          <label className="flex items-start gap-3 p-4 rounded-card border border-border bg-surface-elevated cursor-pointer hover:border-charcoal-400 transition-colors">
            <input
              type="checkbox"
              checked={includeBrokerFee}
              onChange={(e) => set("includeBrokerFee", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-charcoal-950"
            />
            <div>
              <div className="text-sm font-semibold text-charcoal-950">
                Include apartments with a broker fee
              </div>
              <div className="text-xs text-charcoal-600 mt-0.5">
                {cityConfig.brokerFeeContext ??
                  `Common in ${cityConfig.displayName}. Uncheck to see no-fee only.`}
              </div>
            </div>
          </label>
        </section>
      )}

      <div className="rounded-card border border-border bg-surface-muted px-4 py-3 text-xs text-charcoal-600">
        {cityConfig.buildingDataAvailable && cityConfig.buildingDataLabel
          ? `Nook checks ${cityConfig.buildingDataLabel} for every ${cityConfig.displayName} listing.`
          : "Nook checks 100+ sources for every listing."}
      </div>


      <OnboardingFooter
        canContinue={canContinue}
        onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "1" } })}
        onNext={() => {
          set("lastStep", 3);
          navigate({ to: "/onboarding/step/$step", params: { step: "3" } });
        }}
      />
    </div>
  );
}
