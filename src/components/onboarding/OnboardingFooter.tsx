import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  canContinue?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
}

export function OnboardingFooter({
  canContinue = true,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Next",
  backLabel = "Back",
}: Props) {
  return (
    <div className="pt-6 mt-4 border-t border-charcoal-950/8 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="h-11 px-4 inline-flex items-center gap-2 rounded-pill text-sm font-semibold text-charcoal-700 hover:text-charcoal-950"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </button>

      <div className="flex items-center gap-3">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="h-11 px-4 inline-flex items-center text-sm font-semibold text-charcoal-500 hover:text-charcoal-950"
          >
            Skip
          </button>
        )}
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className={cn(
            "h-12 px-6 inline-flex items-center gap-2 rounded-pill text-sm font-semibold transition-colors",
            canContinue
              ? "bg-charcoal-950 text-paper hover:bg-charcoal-800"
              : "bg-charcoal-200 text-charcoal-500 cursor-not-allowed",
          )}
        >
          {nextLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
