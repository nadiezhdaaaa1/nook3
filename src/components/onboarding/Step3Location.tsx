import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { Search, X, MapPin, Sparkles, AlertTriangle, ShieldCheck, ChevronDown } from "lucide-react";
import { IconList, IconMap } from "@tabler/icons-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { ObChip } from "@/components/onboarding/ObChip";
import { ViewSwitcher } from "@/components/onboarding/ViewSwitcher";
import { OB_H1, OB_SUB, OB_H2, OB_STEP_VARIANTS, OB_SECTION_VARIANTS } from "@/components/onboarding/stepStyles";
import { NeighborhoodMap } from "@/components/onboarding/NeighborhoodMap";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { getNeighborhoodPrice, scoreNeighborhood } from "@/data/cities/neighborhoodPrices";
import { getCityPresets, resolvePreset } from "@/data/cities/presets";
import { cn } from "@/lib/utils";

const reduceMotion = (reduce: boolean | null) =>
  reduce
    ? ({ hidden: { opacity: 1 }, visible: { opacity: 1 } } as const)
    : null;

export function Step3Location() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const stepVariants = reduceMotion(reduce) ?? OB_STEP_VARIANTS;
  const sectionVariants = reduceMotion(reduce) ?? OB_SECTION_VARIANTS;
  const { city, neighborhoods, budget, set, toggleNeighborhood } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [query, setQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [quickPicksOpen, setQuickPicksOpen] = useState(false);

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

  const selectedChipsEl = neighborhoods.length > 0 ? (
    <motion.div variants={sectionVariants}>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-sage-900 mb-3">
        Selected · {neighborhoods.length}
      </div>
      <div className="flex flex-wrap" style={{ gap: 4 }}>
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
    </motion.div>
  ) : null;

  return (
    <motion.div className="space-y-10" variants={stepVariants} initial="hidden" animate="visible">
      <motion.header variants={sectionVariants}>
        <h1 className="font-display ob-h1" style={OB_H1}>
          Where specifically?
        </h1>
        <p style={OB_SUB}>
          Pick neighborhoods in {cityConfig.displayName}. Add as many as you want.
        </p>
      </motion.header>

      {/* View toggle */}
      <motion.div variants={sectionVariants}>
        <ViewSwitcher
          value={view}
          onChange={(v) => setView(v)}
          options={[
            { value: "list", label: "List", icon: IconList },
            { value: "map", label: "Map", icon: IconMap },
          ]}
          ariaLabel="Neighborhood view"
        />
      </motion.div>

      {/* Quick presets */}
      {presets.length > 0 && (
        <motion.div variants={sectionVariants}>
          <button
            type="button"
            onClick={() => setQuickPicksOpen((v) => !v)}
            aria-expanded={quickPicksOpen}
            className="w-full flex items-center justify-between p-3.5 rounded-card border transition-colors text-left bg-surface-elevated border-border hover:border-charcoal-950"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-charcoal-950">Quick picks</span>
              <span className="text-[11px] font-mono text-charcoal-400">
                {presets.length} bundles
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-charcoal-500 transition-transform duration-200",
                quickPicksOpen && "rotate-180",
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {quickPicksOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
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
                            ? "border-transparent hover:border-charcoal-400"
                            : "bg-surface-elevated border-border hover:border-charcoal-950 disabled:opacity-40 disabled:hover:border-border",
                        )}
                        style={allSelected ? { backgroundColor: "#241C12" } : undefined}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg leading-none">{p.emoji}</span>
                          <span className={cn("text-sm font-semibold", allSelected ? "text-paper" : "text-charcoal-950")}>
                            {p.label}
                          </span>
                        </div>
                        <div className={cn("text-[11px] leading-snug", allSelected ? "text-paper/70" : "text-charcoal-500")}>
                          {p.description}
                        </div>
                        <div className={cn(
                          "text-[10px] font-mono uppercase tracking-[0.14em] mt-1.5",
                          allSelected ? "text-paper/60" : "text-charcoal-400",
                        )}>
                          +{resolved.length} areas{allSelected ? " · added · tap to remove" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 15+ warning */}
      {tooMany && (
        <motion.div variants={sectionVariants} className="flex items-start gap-3 p-4 rounded-[12px] bg-peach-100/50 border border-peach-300/60">
          <AlertTriangle className="h-4 w-4 text-peach-700 mt-0.5 shrink-0" />
          <div className="text-sm text-charcoal-800">
            <strong className="text-charcoal-950">{neighborhoods.length} neighborhoods selected.</strong>{" "}
            That's a wide net — you may get more alerts than you want. Consider trimming to your top 5–10.
          </div>
        </motion.div>
      )}

      {/* Selected chips */}
      {view === "list" && selectedChipsEl}

      <motion.div variants={sectionVariants}>
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
              <div className="space-y-2 mt-4">
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
              <div className="space-y-8 mt-4">
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
                      <div className="flex items-baseline justify-between mb-3 px-3">
                        <h3 className="font-display" style={OB_H2}>
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
                        <div className="mb-3 p-3 rounded-card" style={{ backgroundColor: "#EBF0D5", border: "1px solid rgba(0,0,0,0.1)" }}>
                          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-sage-900">
                            <Sparkles className="h-3 w-3" />
                            Best fit for your budget
                          </div>
                          <div className="flex flex-wrap" style={{ gap: 8 }}>
                            {bestFits.map(({ name, price }) => {
                              const selected = neighborhoods.includes(name);
                              return (
                                <ObChip
                                  key={name}
                                  selected={selected}
                                  onClick={() => toggleNeighborhood(name)}
                                  size="small"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    {name}
                                    {price !== null && (
                                      <span className="text-[13px] tabular-nums opacity-70">
                                        ~${(price / 1000).toFixed(price >= 10000 ? 0 : 1)}k
                                      </span>
                                    )}
                                  </span>
                                </ObChip>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap px-3" style={{ gap: 8 }}>
                        {restVisible.map(({ name, price }) => {
                          const selected = neighborhoods.includes(name);
                          return (
                            <ObChip
                              key={name}
                              selected={selected}
                              onClick={() => toggleNeighborhood(name)}
                              title={price !== null ? `~$${price.toLocaleString()}/mo` : undefined}
                              size="small"
                            >
                              {name}
                            </ObChip>
                          );
                        })}
                        {rest.length > restVisible.length && !isExpanded && (
                          <ObChip onClick={() => setExpandedGroup(group)} size="small">
                            + {rest.length - restVisible.length} more
                          </ObChip>
                        )}
                        {isExpanded && rest.length > 10 - bestFits.length && (
                        <ObChip onClick={() => setExpandedGroup(null)} size="small">Show less</ObChip>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Selected chips under map in map mode */}
      {view === "map" && selectedChipsEl}

      {/* Trust signal */}
      <motion.div variants={sectionVariants} className="flex items-start gap-3 p-4 rounded-[12px] bg-charcoal-950/[0.03] border border-charcoal-200/60">
        <ShieldCheck className="h-4 w-4 text-sage-700 mt-0.5 shrink-0" />
        <div className="text-xs text-charcoal-600 leading-relaxed">
          Nook monitors every new listing in your selected {cityConfig.displayName} neighborhoods
          {cityConfig.buildingDataSources && cityConfig.buildingDataSources.length > 0 && (
            <> and cross-checks {cityConfig.buildingDataSources.join(" + ")} records before alerting you</>
          )}
          . You can change this anytime in your dashboard.
        </div>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <OnboardingFooter
          canContinue={canContinue}
          onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "2" } })}
          onNext={() => {
            set("lastStep", 4);
            navigate({ to: "/onboarding/step/$step", params: { step: "4" } });
          }}
        />
      </motion.div>
    </motion.div>
  );
}
