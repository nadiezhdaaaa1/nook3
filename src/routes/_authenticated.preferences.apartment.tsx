import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Heart, Star } from "lucide-react";
import { PillGroup } from "@/components/onboarding/PillGroup";
import { ObChip } from "@/components/onboarding/ObChip";
import { TriStateToggle } from "@/components/onboarding/TriStateToggle";
import { OB_H2 } from "@/components/onboarding/stepStyles";
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

      {/* Amenities block — same style as onboarding step 4 */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.14em] text-charcoal-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-surface-elevated border border-border" /> Tap
          </span>
          <span className="inline-flex items-center gap-1.5 text-sage-900">
            <Heart className="h-3 w-3 fill-current" /> Nice
          </span>
          <span className="inline-flex items-center gap-1.5 text-sage-900">
            <Star className="h-3 w-3 fill-current" /> Must
          </span>
          <span className="ml-auto font-mono text-xs normal-case tracking-normal text-charcoal-950 hidden sm:block">
            <span className="text-sage-900 font-semibold">{counts.must}</span> must ·{" "}
            <span className="text-sage-700 font-semibold">{counts.nice}</span> nice
          </span>
        </div>

        {/* Presets */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
            Quick presets
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
            {AMENITY_PRESETS.map((p) => (
              <ObChip key={p.id} onClick={() => applyPreset(p.id)}>
                + {p.label}
              </ObChip>
            ))}
            {Object.keys(amenities).length > 0 && (
              <button
                type="button"
                onClick={() => patch({ amenities: {} })}
                className="inline-flex items-center h-[54px] px-6 text-[16px] font-semibold text-charcoal-500 hover:text-charcoal-950 rounded-[12px] transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {AMENITY_GROUPS.map((g) => (
          <div key={g.id} className="space-y-4">
            <h3 className="font-display" style={OB_H2}>
              {g.label}
            </h3>
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
