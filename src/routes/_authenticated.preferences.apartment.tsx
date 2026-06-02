import { createFileRoute } from "@tanstack/react-router";
import { PillGroup } from "@/components/onboarding/PillGroup";
import { TriStateToggle } from "@/components/onboarding/TriStateToggle";
import { SaveBar } from "@/components/preferences/SaveBar";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { AMENITY_GROUPS, AMENITY_PRESETS } from "@/data/amenities";

export const Route = createFileRoute("/_authenticated/preferences/apartment")({
  component: ApartmentTab,
});

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

function ApartmentTab() {
  const { bedrooms, bathrooms, amenities, set, toggleBedroom, cycleAmenity, patch } =
    useOnboardingStore();

  const applyPreset = (presetId: string) => {
    const preset = AMENITY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const next: Record<string, "nice" | "required"> = { ...amenities };
    for (const id of preset.ids) {
      if (!next[id]) next[id] = "nice";
    }
    patch({ amenities: next });
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">Apartment Details</h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Beds, baths, and amenities. Tap an amenity once for "Nice", twice for "Must".
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">
          Bedrooms <span className="text-charcoal-400 font-normal">· pick any</span>
        </h3>
        <PillGroup options={BEDS} value={bedrooms} multi onChange={toggleBedroom} size="lg" />
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Minimum bathrooms</h3>
        <PillGroup
          options={BATHS}
          value={bathrooms}
          onChange={(id) => set("bathrooms", id)}
          size="lg"
        />
      </section>

      <section className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
          Quick presets
        </div>
        <div className="flex flex-wrap gap-2">
          {AMENITY_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              className="h-9 px-4 inline-flex items-center rounded-pill border border-charcoal-200 bg-surface-elevated text-sm font-medium text-charcoal-800 hover:border-charcoal-950 hover:text-charcoal-950 transition-colors"
            >
              + {p.label}
            </button>
          ))}
          {Object.keys(amenities).length > 0 && (
            <button
              type="button"
              onClick={() => patch({ amenities: {} })}
              className="h-9 px-4 inline-flex items-center text-sm font-semibold text-charcoal-500 hover:text-charcoal-950"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      {AMENITY_GROUPS.map((g) => (
        <section key={g.id} className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-charcoal-950">{g.label}</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {g.items.map((a) => (
              <TriStateToggle
                key={a.id}
                label={a.label}
                state={amenities[a.id]}
                onCycle={() => cycleAmenity(a.id)}
              />
            ))}
          </div>
        </section>
      ))}

      <SaveBar
        signal={`${bedrooms.join(",")}|${bathrooms}|${Object.entries(amenities)
          .map(([k, v]) => `${k}:${v}`)
          .join(",")}`}
      />
    </div>
  );
}
