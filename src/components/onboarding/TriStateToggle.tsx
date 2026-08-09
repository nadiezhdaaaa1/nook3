import { Heart, Star } from "lucide-react";
import { ObChip } from "@/components/onboarding/ObChip";
import { cn } from "@/lib/utils";
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
      selected={isNice || isRequired}
      selectedVariant={isRequired ? "dark" : isNice ? "nice" : "secondary"}
      onClick={onCycle}
      aria-label={`${label}: ${state ?? "no preference"} — click to cycle`}
      className="flex-1"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="min-w-0 flex-1 truncate text-left">{label}</span>
        <span
          className={cn(
            "inline-flex items-center justify-center gap-1.5 text-[13px] font-medium whitespace-nowrap",
            isRequired
              ? "text-white"
              : isNice
                ? "text-[#D66C38]"
                : "text-[#2B2521]"
          )}
          aria-hidden
        >
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
      </div>
    </ObChip>
  );
}

