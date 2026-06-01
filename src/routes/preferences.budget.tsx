import { createFileRoute, Link } from "@tanstack/react-router";
import { RentSlider } from "@/components/onboarding/RentSlider";
import { MoveInPicker } from "@/components/onboarding/MoveInPicker";
import { RentProtectionPicker } from "@/components/onboarding/RentProtectionPicker";
import { SaveBar } from "@/components/preferences/SaveBar";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";

export const Route = createFileRoute("/preferences/budget")({
  component: BudgetTab,
});

function BudgetTab() {
  const { city, budget, moveIn, rentProtection, includeBrokerFee, neighborhoods, set } = useOnboardingStore();
  const cityConfig = getCity(city);

  if (!cityConfig || budget === null) {
    return (
      <div className="p-6 rounded-card bg-surface-elevated border border-border">
        <h2 className="font-display text-xl font-bold text-charcoal-950">No city selected</h2>
        <p className="text-sm text-charcoal-600 mt-2">
          Finish onboarding first so we know where you're looking.
        </p>
        <Link
          to="/onboarding/step/$step"
          params={{ step: "1" }}
          className="mt-4 inline-flex h-10 px-4 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold items-center"
        >
          Start onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">Budget & Criteria</h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Set max rent, when you need to move in, and protection options.
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Monthly rent range</h3>
        <RentSlider city={cityConfig} value={budget} onChange={(v) => set("budget", v)} />
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Move-in date</h3>
        <MoveInPicker
          mode={moveIn.mode}
          date={moveIn.date}
          onChange={(mode, date) => set("moveIn", { mode, date })}
        />
      </section>

      {cityConfig.rentProtection.enabled && (
        <section className="space-y-4">
          <RentProtectionPicker
            city={cityConfig}
            value={rentProtection}
            onChange={(v) => set("rentProtection", v)}
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
                Common in {cityConfig.displayName}. Uncheck to see no-fee only.
              </div>
            </div>
          </label>
        </section>
      )}

      <SaveBar signal={`${budget}|${moveIn.mode}|${moveIn.date}|${rentProtection}|${includeBrokerFee}`} />
    </div>
  );
}
