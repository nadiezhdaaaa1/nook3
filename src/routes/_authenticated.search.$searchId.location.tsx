import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SaveBar } from "@/components/preferences/SaveBar";
import { NeighborhoodPicker } from "@/components/onboarding/NeighborhoodPicker";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/search/$searchId/location")({
  component: LocationTab,
});

function LocationTab() {
  const { city, neighborhoods, transit, cycleTransit, setTransit } = useOnboardingStore();
  const cityConfig = getCity(city);
  const allLines = cityConfig?.transit.lines ?? [];
  const smartLines = useMemo(() => {
    if (neighborhoods.length === 0) return allLines;
    const filtered = allLines.filter((l) =>
      l.servesNeighborhoods.some((n) => neighborhoods.includes(n)),
    );
    return filtered.length === 0 ? allLines : filtered;
  }, [allLines, neighborhoods]);

  if (!cityConfig) {
    return (
      <div className="p-6 rounded-card bg-surface-elevated border border-border">
        <h2 className="font-display text-xl font-bold text-charcoal-950">No city selected</h2>
        <p className="text-sm text-charcoal-600 mt-2">Finish onboarding first.</p>
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

  const visibleLines = showAllLines ? allLines : smartLines;
  const hiddenCount = allLines.length - smartLines.length;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">Location</h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Neighborhoods in {cityConfig.displayName} and preferred transit lines.
        </p>
      </header>

      <NeighborhoodPicker cityConfig={cityConfig} />

      {/* Transit */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-charcoal-950">
            {cityConfig.transit.label}
          </h3>
          {hiddenCount > 0 && (
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
        <div className="flex flex-wrap gap-2">
          {visibleLines.map((line) => {
            const state = transit.lines[line.id];
            const isNice = state === "nice";
            const isRequired = state === "required";
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => cycleTransit(line.id)}
                aria-label={`${line.label} line: ${state ?? "no preference"}`}
                className={cn(
                  "h-12 min-w-12 px-3 inline-flex items-center gap-2 rounded-pill border-2 text-sm font-bold transition-all",
                  isRequired
                    ? "border-charcoal-950 bg-charcoal-950 text-paper"
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
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-paper/90">
                    Must
                  </span>
                )}
                {isNice && (
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-charcoal-700">
                    Nice
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {Object.keys(transit.lines).length > 0 && (
          <button
            type="button"
            onClick={() => {
              for (const id of Object.keys(transit.lines)) setTransit(id, null);
            }}
            className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-950"
          >
            Clear transit preferences
          </button>
        )}
      </section>

      <SaveBar
        signal={`${neighborhoods.join(",")}|${Object.entries(transit.lines)
          .map(([k, v]) => `${k}:${v}`)
          .join(",")}`}
      />
    </div>
  );
}
