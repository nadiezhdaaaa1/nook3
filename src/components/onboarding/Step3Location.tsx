import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { Search, X, MapPin } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

export function Step3Location() {
  const navigate = useNavigate();
  const { city, neighborhoods, set, toggleNeighborhood } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [query, setQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

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

  if (!cityConfig) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }

  const canContinue = neighborhoods.length > 0;

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
        <div className="space-y-6">
          {groups.map(([group, items]) => {
            const isExpanded = expandedGroup === group;
            const visible = isExpanded ? items : items.slice(0, 10);
            const selectedInGroup = items.filter((n) => neighborhoods.includes(n)).length;
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
                <div className="flex flex-wrap gap-2">
                  {visible.map((n) => {
                    const selected = neighborhoods.includes(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => toggleNeighborhood(n)}
                        className={cn(
                          "h-9 px-3.5 inline-flex items-center rounded-pill border text-sm font-medium transition-colors",
                          selected
                            ? "bg-charcoal-950 text-paper border-charcoal-950"
                            : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-950",
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                  {items.length > 10 && (
                    <button
                      type="button"
                      onClick={() => setExpandedGroup(isExpanded ? null : group)}
                      className="h-9 px-3.5 inline-flex items-center rounded-pill border border-dashed border-charcoal-300 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950 hover:text-charcoal-950"
                    >
                      {isExpanded ? "Show less" : `+ ${items.length - 10} more`}
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

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
