import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, TrendingDown, Shield, Heart, GitCompare, MessageCircle, Bookmark, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { SampleListingsMap } from "@/components/onboarding/SampleListingsMap";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/preview")({
  component: SamplePreview,
});

function SamplePreview() {
  const navigate = useNavigate();
  const { city, budget, neighborhoods } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [compare, setCompare] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  const allListings: SampleListing[] = useMemo(
    () => (city && SAMPLE_LISTINGS[city]) || [],
    [city],
  );

  // Filter by budget range; if no neighborhoods picked, ignore the area filter.
  const matched = useMemo(() => {
    let pool = allListings;
    if (budget) {
      const [lo, hi] = budget;
      pool = pool.filter((l) => l.rent >= lo * 0.85 && l.rent <= hi);
    }
    if (neighborhoods.length > 0) {
      const wanted = pool.filter((l) => neighborhoods.includes(l.neighborhood));
      if (wanted.length > 0) pool = wanted;
    }
    return pool.sort((a, b) => a.rent - b.rent);
  }, [allListings, budget, neighborhoods]);

  const pins = useMemo(
    () => matched.filter((l) => l.coords).map((l) => ({ id: l.id, coords: l.coords!, rent: l.rent })),
    [matched],
  );

  const toggle = (set: Set<string>, id: string, fn: (s: Set<string>) => void) => {
    const n = new Set(set);
    n.has(id) ? n.delete(id) : n.add(id);
    fn(n);
  };

  return (
    <div className="space-y-8">
      <header>
        <Eyebrow>Sample alert</Eyebrow>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950 leading-tight">
          You'd have gotten{" "}
          <span className="accent-italic">{matched.length} match{matched.length === 1 ? "" : "es"}</span>{" "}
          in your area this past week.
        </h1>
        <p className="mt-3 text-charcoal-600">
          {budget
            ? `Within $${budget[0].toLocaleString()}–$${budget[1].toLocaleString()}/mo`
            : "Here's what they looked like."}
          {" "}We'll send these straight to your inbox.
        </p>
      </header>

      {matched.length === 0 ? (
        <div className="p-8 rounded-card bg-surface-elevated border border-border text-center space-y-2">
          <p className="text-sm text-charcoal-700">
            No sample matches in {cityConfig?.displayName ?? "your area"} for this budget.
          </p>
          <p className="text-xs text-charcoal-500">
            Real listings hit your inbox the moment they appear — even when our sample pool is thin.
          </p>
        </div>
      ) : (
        <>
          {cityConfig && pins.length > 0 && (
            <SampleListingsMap
              city={cityConfig}
              listings={pins}
              activeId={activeId}
              onSelect={(id) => {
                setActiveId(id);
                document.getElementById(`listing-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          )}

          <div className="space-y-4">
            {matched.map((s) => {
              const isSaved = saved.has(s.id);
              const isCompare = compare.has(s.id);
              const isActive = activeId === s.id;
              return (
                <article
                  key={s.id}
                  id={`listing-${s.id}`}
                  onMouseEnter={() => setActiveId(s.id)}
                  className={cn(
                    "group rounded-card bg-surface-elevated border overflow-hidden transition-all",
                    isActive ? "border-charcoal-950 shadow-md" : "border-border",
                  )}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Photo */}
                    <div className="relative sm:w-64 sm:flex-shrink-0 h-48 sm:h-auto bg-charcoal-100 overflow-hidden">
                      <img
                        src={s.image}
                        alt={`${s.address} — ${s.neighborhood}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {s.tag && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-paper/95 backdrop-blur text-[10px] font-mono uppercase tracking-[0.16em] text-sage-800">
                          <Shield className="h-3 w-3" /> {s.tag}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-5 space-y-3">
                      <div>
                        <div className="font-display text-lg font-bold text-charcoal-950 leading-tight">
                          {s.address}
                        </div>
                        <div className="text-xs text-charcoal-500 inline-flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {s.neighborhood}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-display text-2xl font-bold text-charcoal-950 tabular-nums">
                          ${s.rent.toLocaleString()}
                          <span className="text-sm font-normal text-charcoal-500">/mo</span>
                        </span>
                        {s.belowMedianPct && (
                          <span className="inline-flex items-center gap-1 text-xs text-sage-700 font-semibold">
                            <TrendingDown className="h-3 w-3" /> {s.belowMedianPct}% below median
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-charcoal-700">
                        {s.beds === 0 ? "Studio" : `${s.beds} bed`} · {s.baths} bath
                      </div>

                      {s.buildingNote && cityConfig?.buildingDataAvailable && (
                        <div className="text-[10px] font-mono text-charcoal-500 uppercase tracking-wider">
                          {s.buildingNote}
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          className="flex-1 sm:flex-initial h-10 px-4 inline-flex items-center justify-center gap-2 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Contact
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(saved, s.id, setSaved)}
                          aria-pressed={isSaved}
                          title={isSaved ? "Saved" : "Save for later"}
                          className={cn(
                            "h-10 w-10 inline-flex items-center justify-center rounded-pill border transition-colors",
                            isSaved
                              ? "bg-sage-700 border-sage-700 text-paper"
                              : "border-charcoal-300 text-charcoal-700 hover:border-charcoal-950",
                          )}
                        >
                          {isSaved ? <Bookmark className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(compare, s.id, setCompare)}
                          aria-pressed={isCompare}
                          title={isCompare ? "Remove from compare" : "Add to compare"}
                          className={cn(
                            "h-10 px-3 inline-flex items-center gap-1.5 rounded-pill border text-xs font-semibold transition-colors",
                            isCompare
                              ? "bg-charcoal-950 border-charcoal-950 text-paper"
                              : "border-charcoal-300 text-charcoal-700 hover:border-charcoal-950",
                          )}
                        >
                          <GitCompare className="h-3.5 w-3.5" />
                          {isCompare ? "Comparing" : "Compare"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Compare bar */}
      {compare.size >= 2 && (
        <div className="sticky bottom-4 z-20 mx-auto max-w-md p-3 pl-5 flex items-center justify-between gap-3 rounded-pill bg-charcoal-950 text-paper shadow-xl">
          <span className="text-xs font-mono uppercase tracking-[0.18em]">
            {compare.size} to compare
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCompare(new Set())}
              className="text-xs text-paper/70 hover:text-paper px-2"
            >
              Clear
            </button>
            <button
              type="button"
              className="h-9 px-4 rounded-pill bg-paper text-charcoal-950 text-xs font-semibold hover:bg-paper/90"
            >
              Compare side-by-side
            </button>
          </div>
        </div>
      )}

      {cityConfig?.buildingDataSources && cityConfig.buildingDataSources.length > 0 && (
        <div className="rounded-card border border-border bg-surface-elevated p-4 flex gap-3">
          <ShieldCheck className="h-4 w-4 text-sage-700 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
              How we vet {cityConfig.displayName} listings
            </div>
            <p className="text-sm text-charcoal-700">
              Every match is cross-checked against {cityConfig.buildingDataSources.join(", ")} records before it reaches your inbox.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate({ to: "/onboarding/pricing" })}
        className="w-full h-12 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors"
      >
        See my plan options →
      </button>
    </div>
  );
}
