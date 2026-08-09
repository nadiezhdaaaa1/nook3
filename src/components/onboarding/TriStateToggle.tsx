import { Heart, Star } from "lucide-react";
import { ObChip } from "@/components/onboarding/ObChip";
import type { TriState } from "@/lib/onboarding/store";

interface Props {
  label: string;
  state: TriState | undefined;
  onCycle: () => void;
}

export function TriStateToggle({ label, state, onCycle }: Props) {
  const isNice = state === "nice";
  const isRequired = state === "required";

  return (
    <ObChip
      fullWidth
      selected={isNice || isRequired}
      selectedVariant={isRequired ? "dark" : "secondary"}
      onClick={onCycle}
      aria-label={`${label}: ${state ?? "no preference"} — click to cycle`}
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="truncate">{label}</span>
        <span className="inline-flex items-center gap-1.5 text-[13px] opacity-80">
          {isRequired ? (
            <>
              <Star className="h-3.5 w-3.5 fill-current" /> Must
            </>
          ) : isNice ? (
            <>
              <Heart className="h-3.5 w-3.5 fill-current" /> Nice
            </>
          ) : (
            "Tap"
          )}
        </span>
      </span>
    </ObChip>
  );
}
