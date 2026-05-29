import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/loading")({
  component: LoadingMatches,
});

const STEPS = [
  "Searching 100+ listing sources",
  "Scanning listings in your selected areas",
  "Checking building safety records",
  "Building your custom alert profile",
];

function LoadingMatches() {
  const navigate = useNavigate();
  const { city } = useOnboardingStore();
  const cityConfig = getCity(city);
  const stepsToShow = cityConfig?.buildingDataAvailable ? STEPS : STEPS.filter((_, i) => i !== 2);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= stepsToShow.length) {
      const t = setTimeout(() => navigate({ to: "/onboarding/preview" }), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 900);
    return () => clearTimeout(t);
  }, [done, stepsToShow.length, navigate]);

  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className="h-16 w-16 rounded-pill bg-sage-100 flex items-center justify-center mb-6">
        <Search className="h-7 w-7 text-sage-700 animate-pulse" />
      </div>
      <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950">
        Finding your <span className="accent-italic">matches</span>
      </h1>
      <p className="mt-3 text-charcoal-600">This usually takes a few seconds…</p>
      <ul className="mt-10 space-y-3 text-left max-w-md w-full">
        {stepsToShow.map((label, i) => {
          const isDone = i < done;
          const isActive = i === done;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md border transition-all",
                isDone
                  ? "border-sage-300 bg-sage-100/60 text-sage-900"
                  : isActive
                    ? "border-charcoal-950 bg-surface-elevated text-charcoal-950"
                    : "border-border bg-surface-elevated text-charcoal-400",
              )}
            >
              {isDone ? (
                <Check className="h-4 w-4 text-sage-700 flex-shrink-0" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-charcoal-700 animate-spin flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-charcoal-300 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
