import { useMemo, useState } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { ObChip } from "@/components/onboarding/ObChip";
import { OB_H1, OB_SUB, OB_H2 } from "@/components/onboarding/stepStyles";
import { TriStateToggle } from "@/components/onboarding/TriStateToggle";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { AMENITY_GROUPS, AMENITY_PRESETS } from "@/data/amenities";

const LEGEND = (
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
  </div>
);


export function Step4Preferences() {
  const navigate = useNavigate();
  const {
    city, neighborhoods, amenities, transit, commute, cycleAmenity, cycleTransit, setTransit, patch, set,
  } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [showAllLines, setShowAllLines] = useState(false);
  const isCommuteCity = cityConfig?.transit.type === "limited";
  const COMMUTE_OPTIONS = [15, 30, 45, 60] as const;


  const allLines = cityConfig?.transit.lines ?? [];
  const smartLines = useMemo(() => {
    if (neighborhoods.length === 0) return allLines;
    const filtered = allLines.filter((l) =>
      l.servesNeighborhoods.some((n) => neighborhoods.includes(n)),
    );
    return filtered.length === 0 ? allLines : filtered;
  }, [allLines, neighborhoods]);

  if (!cityConfig) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }



  const visibleLines = showAllLines ? allLines : smartLines;
  const hiddenCount = allLines.length - smartLines.length;

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
        <h1 className="font-display ob-h1" style={OB_H1}>
          Any specific preferences?
        </h1>
        <p style={OB_SUB}>
          Tap once for "Nice to have", twice for "Must have", three times to clear.
        </p>
        <div className="mt-4">{LEGEND}</div>
      </header>


      {/* Presets */}
      <section className="space-y-3">
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
      </section>

      {/* Amenities groups */}
      {AMENITY_GROUPS.map((g) => (
        <section key={g.id} className="space-y-4">
          <h2 className="font-display" style={OB_H2}>
            {g.label}
          </h2>
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

      {/* Transit / Commute */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display" style={OB_H2}>
            {cityConfig.transit.label}
          </h2>
          {!isCommuteCity && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllLines((v) => !v)}
              className="text-xs font-semibold text-sage-700 hover:text-sage-900"
            >
              {showAllLines
                ? `Show only lines near my areas (${smartLines.length})`
                : `Show all ${allLines.length} lines`}
            </button>
          )}
        </div>

        {isCommuteCity ? (
          <div className="space-y-3">
            <p className="text-sm text-charcoal-600">
              {cityConfig.displayName} is a driving city. Set the max commute you'll tolerate from your neighborhoods.
            </p>
            <div className="flex flex-wrap" style={{ gap: 12 }}>
              <ObChip
                selected={commute.maxMinutes === null}
                onClick={() => patch({ commute: { maxMinutes: null } })}
              >
                No preference
              </ObChip>
              {COMMUTE_OPTIONS.map((m) => (
                <ObChip
                  key={m}
                  selected={commute.maxMinutes === m}
                  onClick={() => patch({ commute: { maxMinutes: m } })}
                >
                  ≤ {m} min
                </ObChip>
              ))}
            </div>
          </div>
        ) : (
          <>
            {!showAllLines && hiddenCount > 0 && (
              <p className="text-xs text-charcoal-500">
                Filtered to {smartLines.length} lines that serve your selected neighborhoods.
              </p>
            )}
            <div className="flex flex-wrap" style={{ gap: 12 }}>
              {visibleLines.map((line) => {
                const state = transit.lines[line.id];
                const isNice = state === "nice";
                const isRequired = state === "required";
                return (
                  <ObChip
                    key={line.id}
                    selected={isNice || isRequired}
                    selectedVariant={isRequired ? "dark" : isNice ? "nice" : "secondary"}
                    onClick={() => {
                      cycleTransit(line.id);
                      if (!transit.hasPreference) set("transit", { ...transit, hasPreference: true });
                    }}
                    aria-label={`${line.label} line: ${state ?? "no preference"}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ background: line.color }}
                      >
                        {line.label}
                      </span>
                      {isRequired && (
                        <span className="inline-flex items-center gap-1 text-[13px] opacity-80">
                          <Star className="h-3.5 w-3.5 fill-current" /> Must
                        </span>
                      )}
                      {isNice && (
                        <span className="inline-flex items-center gap-1 text-[13px] opacity-80">
                          <Heart className="h-3.5 w-3.5 fill-current" /> Nice
                        </span>
                      )}
                    </span>
                  </ObChip>
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  for (const id of Object.keys(transit.lines)) setTransit(id, null);
                  set("transit", { hasPreference: false, lines: {} });
                }}
                className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-950"
              >
                No transit preference
              </button>
              {Object.keys(transit.lines).length > 0 && (
                <span className="text-xs text-charcoal-400">·</span>
              )}
              {Object.keys(transit.lines).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    for (const id of Object.keys(transit.lines)) setTransit(id, null);
                  }}
                  className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-950"
                >
                  Clear selections
                </button>
              )}
            </div>
          </>
        )}
      </section>


      <OnboardingFooter
        nextLabel="Find apartments"
        onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "3" } })}
        onSkip={() => {
          set("lastStep", 4);
          navigate({ to: "/onboarding/loading" });
        }}
        onNext={() => {
          set("lastStep", 4);
          navigate({ to: "/onboarding/loading" });
        }}
      />

    </div>
  );
}
