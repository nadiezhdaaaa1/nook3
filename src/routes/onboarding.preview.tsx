import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eyebrow } from "@/components/marketing/Eyebrow";

export const Route = createFileRoute("/onboarding/preview")({
  component: SamplePreview,
});

function SamplePreview() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <header>
        <Eyebrow>Sample alert</Eyebrow>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950 leading-tight">
          You'd have gotten <span className="accent-italic">12 matches</span> in your area this past week.
        </h1>
        <p className="mt-3 text-charcoal-600">
          Here's a recent one. We'll send these straight to your inbox.
        </p>
      </header>

      <div className="p-6 rounded-card bg-surface-elevated border border-border">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-sage-700">
          New listing · Likely RS
        </div>
        <div className="font-display text-2xl font-bold text-charcoal-950 mt-2">
          200 West 20th Street, #615
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-display text-3xl font-bold">$4,695/mo</span>
          <span className="text-sm text-sage-700 font-semibold">19% below area median</span>
        </div>
        <p className="mt-4 text-sm text-charcoal-600">1 bed · 1 bath · Clean building record</p>
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
