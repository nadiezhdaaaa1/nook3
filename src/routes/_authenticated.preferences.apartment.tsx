import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Heart, Star } from "lucide-react";
import { PillGroup } from "@/components/onboarding/PillGroup";
import { SaveBar } from "@/components/preferences/SaveBar";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { AMENITY_GROUPS, AMENITY_PRESETS } from "@/data/amenities";
import { cn } from "@/lib/utils";

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

  const counts = useMemo(() => {
    let must = 0;
    let nice = 0;
    for (const v of Object.values(amenities)) {
      if (v === "required") must++;
      else if (v === "nice") nice++;
    }
    return { must, nice };
  }, [amenities]);

  return (
    <div className="space-y-12">
      <header>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">Apartment Details</h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Beds, baths, and amenities. Tap once for <span className="text-sage-700 font-semibold">nice</span>, twice for <span className="text-sage-900 font-semibold">must</span>.
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

      {/* Amenities block */}
      <section className="space-y-6">
        {/* Legend bar */}
        <div className="flex items-center gap-4 flex-wrap rounded-card bg-surface-elevated border border-border px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-charcoal-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md bg-sage-100 border border-sage-300" />
              Tap = nice to have
            </span>
            <span className="text-charcoal-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md bg-sage-900" />
              Tap again = must have
            </span>
          </div>
          <div className="ml-auto font-mono text-xs text-charcoal-950 hidden sm:block">
            <span className="text-sage-900 font-semibold">{counts.must}</span> must ·{" "}
            <span className="text-sage-700 font-semibold">{counts.nice}</span> nice
          </div>
        </div>

        <p className="text-sm text-charcoal-600">
          Pick what matters — <b className="text-sage-900">must-haves</b> filter listings,{" "}
          <b className="text-sage-700">nice-to-haves</b> nudge your match score. Skip anything you don't care about.
        </p>

        {/* Presets */}
        <div className="space-y-3">
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
        </div>

        {AMENITY_GROUPS.map((g) => (
          <div key={g.id} className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-charcoal-950">{g.label}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((a) => {
                const state = amenities[a.id]; // undefined | "nice" | "required"
                const isNice = state === "nice";
                const isMust = state === "required";
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => cycleAmenity(a.id)}
                    aria-pressed={!!state}
                    className={cn(
                      "inline-flex items-center gap-2 h-9 px-3.5 rounded-pill text-sm border transition-all leading-none",
                      !state &&
                        "bg-surface-elevated border-border text-charcoal-800 hover:border-sage-500 font-medium",
                      isNice &&
                        "bg-sage-100 border-sage-300 text-sage-900 font-semibold",
                      isMust &&
                        "bg-sage-900 border-sage-900 text-paper font-semibold shadow-sm",
                    )}
                  >
                    {isNice && <Heart className="h-3 w-3 fill-current" />}
                    {isMust && <Star className="h-3 w-3 fill-current" />}
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <SaveBar
        signal={`${bedrooms.join(",")}|${bathrooms}|${Object.entries(amenities)
          .map(([k, v]) => `${k}:${v}`)
          .join(",")}`}
      />
    </div>
  );
}
