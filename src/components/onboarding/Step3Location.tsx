import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { Search, X, MapPin, Map as MapIcon, List, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { NeighborhoodMap } from "@/components/onboarding/NeighborhoodMap";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { getNeighborhoodPrice, scoreNeighborhood } from "@/data/cities/neighborhoodPrices";
import { getCityPresets, resolvePreset } from "@/data/cities/presets";
import { cn } from "@/lib/utils";

export function Step3Location() {
  const navigate = useNavigate();
  const { city, neighborhoods, budget, set, toggleNeighborhood } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [query, setQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const groups = useMemo(
    () => (cityConfig ? Object.entries(cityConfig.neighborhoodGroups) : []),
    [cityConfig],
  );

  const matchedByQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const all: { group: string; name: string }[] = [];
    for (const [g, items] of groups) {
      for (const n of items) {
        if (n.toLowerCase().includes(q)) all.push({ group: g, name: n });
      }
    }
    return all;
  }, [query, groups]);

  const allKnown = useMemo(() => {
    const s = new Set<string>();
    if (!cityConfig) return s;
    for (const items of Object.values(cityConfig.neighborhoodGroups)) {
      for (const n of items) s.add(n);
    }
    return s;
  }, [cityConfig]);
  const presets = useMemo(() => (cityConfig ? getCityPresets(cityConfig.id) : []), [cityConfig]);

  if (!cityConfig) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }

  const applyPreset = (names: string[]) => {
    const merged = Array.from(new Set([...neighborhoods, ...names]));
    set("neighborhoods", merged);
  };

  const removePreset = (names: string[]) => {
    const removed = new Set(names);
    set("neighborhoods", neighborhoods.filter((n) => !removed.has(n)));
  };


  const canContinue = neighborhoods.length > 0;
  const tooMany = neighborhoods.length >= 15;

  return (
    <div className="space-y-10">
      <header>
        <Eyebrow>Step 3 · Location</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          Where <span className="accent-italic">specifically</span>?
        </h1>
        <p className="mt-4 text-base text-charcoal-600">
          Pick neighborhoods in {cityConfig.displayName}. Add as many as you want.
        </p>
      </header>

      {/* View toggle */}
      <div className="inline-flex p-1 rounded-pill bg-surface-elevated border border-border">
        <button
          type="button"
          onClick={() => setView("list")}
          className={cn(
            "h-9 px-4 inline-flex items-center gap-2 rounded-pill text-xs font-semibold transition-colors",
            view === "list" ? "bg-charcoal-950 text-paper" : "text-charcoal-600",
          )}
        >
          <List className="h-3.5 w-3.5" /> List
        </button>
        <button
          type="button"
          onClick={() => setView("map")}
          className={cn(
            "h-9 px-4 inline-flex items-center gap-2 rounded-pill text-xs font-semibold transition-colors",
            view === "map" ? "bg-charcoal-950 text-paper" : "text-charcoal-600",
          )}
        >
          <MapIcon className="h-3.5 w-3.5" /> Map
        </button>
      </div>

      {/* Quick presets */}
      {presets.length > 0 && (
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-3">
            Quick picks · tap to add a bundle
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
            {presets.map((p) => {
              const resolved = resolvePreset(p, allKnown);
              const allSelected = resolved.length > 0 && resolved.every((n) => neighborhoods.includes(n));
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => (allSelected ? removePreset(resolved) : applyPreset(resolved))}
                  disabled={resolved.length === 0}
                  className={cn(
                    "group text-left p-3.5 rounded-card border transition-colors",
                    allSelected
                      ? "bg-sage-100/60 border-sage-400/60 hover:border-sage-500"
                      : "bg-surface-elevated border-border hover:border-charcoal-950 disabled:opacity-40 disabled:hover:border-border",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg leading-none">{p.emoji}</span>
                    <span className="text-sm font-semibold text-charcoal-950">{p.label}</span>
                  </div>
                  <div className="text-[11px] text-charcoal-500 leading-snug">{p.description}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.14em] mt-1.5 text-charcoal-400">
                    +{resolved.length} areas{allSelected ? " · added · tap to remove" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 15+ warning */}
      {tooMany && (
        <div className="flex items-start gap-3 p-4 rounded-card bg-peach-100/50 border border-peach-300/60">
          <AlertTriangle className="h-4 w-4 text-peach-700 mt-0.5 shrink-0" />
          <div className="text-sm text-charcoal-800">
            <strong className="text-charcoal-950">{neighborhoods.length} neighborhoods selected.</strong>{" "}
            That's a wide net — you may get more alerts than you want. Consider trimming to your top 5–10.
          </div>
        </div>
      )}

      {/* Selected chips */}
      {neighborhoods.length > 0 && (
        <div className="p-4 rounded-card bg-sage-100/60 border border-sage-300/40">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-sage-900 mb-3">
            Selected · {neighborhoods.length}
          </div>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleNeighborhood(n)}
                className="h-8 px-3 inline-flex items-center gap-1.5 rounded-pill bg-charcoal-950 text-paper text-xs font-medium hover:bg-charcoal-800"
              >
                {n}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => set("neighborhoods", [])}
              className="h-8 px-3 inline-flex items-center text-xs font-semibold text-sage-900 hover:text-charcoal-950"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {view === "map" ? (
        <NeighborhoodMap
          city={cityConfig}
          selected={neighborhoods}
          onToggle={toggleNeighborhood}
        />
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search neighborhoods..."
              className="w-full h-12 pl-11 pr-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium placeholder:text-charcoal-400"
            />
          </div>

          {/* Results */}
          {matchedByQuery !== null ? (
            <div className="space-y-2">
              {matchedByQuery.length === 0 ? (
                <p className="text-sm text-charcoal-500 py-6 text-center">
                  No matches in {cityConfig.displayName}.
                </p>
              ) : (
                matchedByQuery.map(({ group, name }) => {
                  const selected = neighborhoods.includes(name);
                  return (
                    <button
                      key={`${group}-${name}`}
                      type="button"
                      onClick={() => toggleNeighborhood(name)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 rounded-md border transition-colors text-left",
                        selected
                          ? "bg-charcoal-950 text-paper border-charcoal-950"
                          : "bg-surface-elevated border-border hover:border-charcoal-400",
                      )}
                    >
                      <MapPin className="h-4 w-4 opacity-70" />
                      <span className="text-sm font-medium">{name}</span>
                      <span className={cn("ml-auto text-[11px] font-mono", selected ? "text-paper/70" : "text-charcoal-400")}>
                        {group}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map(([group, items]) => {
                const isExpanded = expandedGroup === group;
                const selectedInGroup = items.filter((n) => neighborhoods.includes(n)).length;

                // Rank items by budget fit (when we have prices + range)
                const ranked = items
                  .map((name) => {
                    const price = city ? getNeighborhoodPrice(city, name) : null;
                    const { score, fit } = scoreNeighborhood(price, budget);
                    return { name, price, score, fit };
                  })
                  .sort((a, b) => b.score - a.score);

                const bestFits = ranked.filter((r) => r.fit === "in").slice(0, 3);
                const bestFitNames = new Set(bestFits.map((r) => r.name));
                const rest = ranked.filter((r) => !bestFitNames.has(r.name));
                const restVisible = isExpanded ? rest : rest.slice(0, Math.max(0, 10 - bestFits.length));

                return (
                  <section key={group}>
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="font-display text-base font-semibold text-charcoal-950">
                        {group}
                        {selectedInGroup > 0 && (
                          <span className="ml-2 text-xs font-mono text-sage-700">
                            · {selectedInGroup} selected
                          </span>
                        )}
                      </h3>
                      <span className="text-[11px] font-mono text-charcoal-400">
                        {items.length} areas
                      </span>
                    </div>

                    {bestFits.length > 0 && (
                      <div className="mb-3 p-3 rounded-card bg-sage-100/40 border border-sage-300/30">
                        <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-sage-900">
                          <Sparkles className="h-3 w-3" />
                          Best fit for your budget
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {bestFits.map(({ name, price }) => {
                            const selected = neighborhoods.includes(name);
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => toggleNeighborhood(name)}
                                className={cn(
                                  "h-9 pl-3.5 pr-2.5 inline-flex items-center gap-2 rounded-pill border text-sm font-medium transition-colors",
                                  selected
                                    ? "bg-charcoal-950 text-paper border-charcoal-950"
                                    : "bg-paper border-sage-400/60 text-charcoal-900 hover:border-charcoal-950",
                                )}
                              >
                                {name}
                                {price !== null && (
                                  <span
                                    className={cn(
                                      "text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded",
                                      selected ? "bg-paper/15 text-paper/90" : "bg-sage-200/60 text-sage-900",
                                    )}
                                  >
                                    ~${(price / 1000).toFixed(price >= 10000 ? 0 : 1)}k
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {restVisible.map(({ name, price, fit }) => {
                        const selected = neighborhoods.includes(name);
                        const above = fit === "above";
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => toggleNeighborhood(name)}
                            title={price !== null ? `~$${price.toLocaleString()}/mo` : undefined}
                            className={cn(
                              "h-9 px-3.5 inline-flex items-center rounded-pill border text-sm font-medium transition-colors",
                              selected
                                ? "bg-charcoal-950 text-paper border-charcoal-950"
                                : above
                                  ? "bg-transparent border-charcoal-200 text-charcoal-400 hover:border-charcoal-950 hover:text-charcoal-950"
                                  : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-950",
                            )}
                          >
                            {name}
                          </button>
                        );
                      })}
                      {rest.length > restVisible.length && !isExpanded && (
                        <button
                          type="button"
                          onClick={() => setExpandedGroup(group)}
                          className="h-9 px-3.5 inline-flex items-center rounded-pill border border-dashed border-charcoal-300 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950 hover:text-charcoal-950"
                        >
                          + {rest.length - restVisible.length} more
                        </button>
                      )}
                      {isExpanded && rest.length > 10 - bestFits.length && (
                        <button
                          type="button"
                          onClick={() => setExpandedGroup(null)}
                          className="h-9 px-3.5 inline-flex items-center rounded-pill border border-dashed border-charcoal-300 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950 hover:text-charcoal-950"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Trust signal */}
      <div className="flex items-start gap-3 p-4 rounded-card bg-charcoal-950/[0.03] border border-charcoal-200/60">
        <ShieldCheck className="h-4 w-4 text-sage-700 mt-0.5 shrink-0" />
        <div className="text-xs text-charcoal-600 leading-relaxed">
          Nook monitors every new listing in your selected {cityConfig.displayName} neighborhoods
          {cityConfig.buildingDataSources && cityConfig.buildingDataSources.length > 0 && (
            <> and cross-checks {cityConfig.buildingDataSources.join(" + ")} records before alerting you</>
          )}
          . You can change this anytime in your dashboard.
        </div>
      </div>


      <OnboardingFooter
        canContinue={canContinue}
        onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "2" } })}
        onNext={() => {
          set("lastStep", 4);
          navigate({ to: "/onboarding/step/$step", params: { step: "4" } });
        }}
      />
    </div>
  );
}
