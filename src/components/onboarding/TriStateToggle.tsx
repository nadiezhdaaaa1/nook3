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
    <div className="flex items-center gap-2">
      <ObChip
        selected={isNice || isRequired}
        selectedVariant={isRequired ? "dark" : isNice ? "nice" : "secondary"}
        onClick={onCycle}
        aria-label={`${label}: ${state ?? "no preference"} — click to cycle`}
        className="flex-1"
      >
        <span className="truncate">{label}</span>
      </ObChip>
      <span
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-[12px] border px-3 py-2 text-[13px] font-medium whitespace-nowrap",
          isRequired
            ? "border-transparent bg-[#2B2521] text-white"
            : isNice
              ? "border-[#D66C38] bg-transparent text-[#D66C38]"
              : "border-black/20 bg-transparent text-[#2B2521]"
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
  );
}

