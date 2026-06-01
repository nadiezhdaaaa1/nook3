import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { MapPin, TrendingDown, Shield } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { SAMPLE_LISTINGS } from "@/data/sampleListings";

export const Route = createFileRoute("/onboarding/preview")({
  component: SamplePreview,
});

function SamplePreview() {
  const navigate = useNavigate();
  const { city, budget, neighborhoods } = useOnboardingStore();
  const cityConfig = getCity(city);

  const count = useMemo(() => {
    if (!cityConfig || !budget) return 8;
    const nCount = Math.max(neighborhoods.length, 3);
    const ratio = budget[1] / cityConfig.budget.median1BR;
    const c = Math.round(nCount * ratio * 2);
    return Math.max(2, Math.min(50, c));
  }, [cityConfig, budget, neighborhoods]);

  const samples = (city && SAMPLE_LISTINGS[city]) || [];

  return (
    <div className="space-y-8">
      <header>
        <Eyebrow>Sample alert</Eyebrow>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950 leading-tight">
          You'd have gotten{" "}
          <span className="accent-italic">{count} matches</span> in your area this past week.
        </h1>
        <p className="mt-3 text-charcoal-600">
          Here's what one of them looked like. We'll send these straight to your inbox.
        </p>
      </header>

      <div className="space-y-3">
        {samples.slice(0, 2).map((s) => (
          <article
            key={s.address}
            className="p-6 rounded-card bg-surface-elevated border border-border space-y-3"
          >
            {s.tag && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-sage-700">
                <Shield className="h-3 w-3" /> {s.tag}
              </div>
            )}
            <div>
              <div className="font-display text-xl font-bold text-charcoal-950">
                {s.address}
              </div>
              <div className="text-xs text-charcoal-500 inline-flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {s.neighborhood}
              </div>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-3xl font-bold text-charcoal-950">
                ${s.rent.toLocaleString()}
                <span className="text-base font-normal text-charcoal-500">/mo</span>
              </span>
              {s.belowMedianPct && (
                <span className="inline-flex items-center gap-1 text-sm text-sage-700 font-semibold">
                  <TrendingDown className="h-3.5 w-3.5" /> {s.belowMedianPct}% below median
                </span>
              )}
            </div>
            <div className="text-sm text-charcoal-700">
              {s.beds === 0 ? "Studio" : `${s.beds} bed`} · {s.baths} bath
            </div>
            {s.buildingNote && cityConfig?.buildingDataAvailable && (
              <div className="pt-3 border-t border-border text-xs font-mono text-charcoal-500 uppercase tracking-wider">
                Building: {s.buildingNote}
              </div>
            )}
          </article>
        ))}
      </div>

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
