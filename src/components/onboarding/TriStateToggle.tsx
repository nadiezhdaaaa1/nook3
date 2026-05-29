import { cn } from "@/lib/utils";
import type { TriState } from "@/lib/onboarding/store";
import { Heart, Star } from "lucide-react";

interface Props {
  label: string;
  state: TriState | undefined;
  onCycle: () => void;
}

export function TriStateToggle({ label, state, onCycle }: Props) {
  const isNice = state === "nice";
  const isRequired = state === "required";

  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`${label}: ${state ?? "no preference"} — click to cycle`}
      className={cn(
        "w-full h-12 px-4 inline-flex items-center justify-between gap-3 rounded-md border transition-colors text-sm font-medium",
        isRequired
          ? "bg-sage-700 text-paper border-sage-700"
          : isNice
            ? "bg-sage-100 text-sage-900 border-sage-300"
            : "bg-surface-elevated text-charcoal-800 border-border hover:border-charcoal-400",
      )}
    >
      <span>{label}</span>
      <span className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.14em]",
        isRequired ? "text-paper/90" : isNice ? "text-sage-900" : "text-charcoal-400",
      )}>
        {isRequired ? (<><Star className="h-3 w-3 fill-current" /> Must</>) :
         isNice    ? (<><Heart className="h-3 w-3 fill-current" /> Nice</>) :
                     "Tap"}
      </span>
    </button>
  );
}
