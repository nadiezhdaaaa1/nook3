import { useMemo, useState } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { TriStateToggle } from "@/components/onboarding/TriStateToggle";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { AMENITY_GROUPS, AMENITY_PRESETS } from "@/data/amenities";
import { cn } from "@/lib/utils";

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
        <Eyebrow>Step 4 · Preferences · optional</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          Any specific <span className="accent-italic">preferences</span>?
        </h1>
        <p className="mt-4 text-base text-charcoal-600">
          Tap once for "Nice to have", twice for "Must have", three times to clear.
        </p>
        <div className="mt-4">{LEGEND}</div>
      </header>


      {/* Presets */}
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
        </div>
      </section>

      {/* Amenities groups */}
      {AMENITY_GROUPS.map((g) => (
        <section key={g.id} className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-charcoal-950">
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
          <h2 className="font-display text-lg font-semibold text-charcoal-950">
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => patch({ commute: { maxMinutes: null } })}
                className={cn(
                  "h-11 px-4 rounded-pill border-2 text-sm font-semibold transition-colors",
                  commute.maxMinutes === null
                    ? "border-charcoal-950 bg-charcoal-950 text-paper"
                    : "border-charcoal-200 bg-surface-elevated text-charcoal-700 hover:border-charcoal-400",
                )}
              >
                No preference
              </button>
              {COMMUTE_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => patch({ commute: { maxMinutes: m } })}
                  className={cn(
                    "h-11 px-4 rounded-pill border-2 text-sm font-semibold transition-colors",
                    commute.maxMinutes === m
                      ? "border-charcoal-950 bg-charcoal-950 text-paper"
                      : "border-charcoal-200 bg-surface-elevated text-charcoal-700 hover:border-charcoal-400",
                  )}
                >
                  ≤ {m} min
                </button>
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
            <div className="flex flex-wrap gap-2">
              {visibleLines.map((line) => {
                const state = transit.lines[line.id];
                const isNice = state === "nice";
                const isRequired = state === "required";
                return (
                  <button
                    key={line.id}
                    type="button"
                    onClick={() => {
                      cycleTransit(line.id);
                      if (!transit.hasPreference) set("transit", { ...transit, hasPreference: true });
                    }}
                    aria-label={`${line.label} line: ${state ?? "no preference"}`}
                    className={cn(
                      "h-12 min-w-12 px-3 inline-flex items-center gap-2 rounded-pill border-2 text-sm font-bold transition-all",
                      isRequired
                        ? "border-charcoal-950 bg-charcoal-950 text-paper ring-2 ring-offset-2 ring-offset-paper ring-charcoal-950"
                        : isNice
                          ? "border-charcoal-950 bg-paper"
                          : "border-charcoal-200 bg-surface-elevated text-charcoal-700 hover:border-charcoal-400 opacity-90",
                    )}
                  >
                    <span
                      className="h-6 w-6 inline-flex items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: line.color }}
                    >
                      {line.label}
                    </span>
                    {isRequired && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-paper/90">
                        <Star className="h-3 w-3 fill-current" /> Must
                      </span>
                    )}
                    {isNice && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-charcoal-700">
                        <Heart className="h-3 w-3 fill-current" /> Nice
                      </span>
                    )}
                  </button>
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
        nextLabel="Find my apartments"
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
