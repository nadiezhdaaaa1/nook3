import { ArrowRight } from "lucide-react";
import { OriginButton } from "@/components/ui/origin-button";

interface Props {
  canContinue?: boolean;
  /** Kept for API compatibility — back navigation lives in the top bar. */
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
}

export function OnboardingFooter({
  canContinue = true,
  onNext,
  onSkip,
  nextLabel = "Next",
}: Props) {
  return (
    <div className="flex items-center justify-end gap-3 ob-next-row">
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="h-11 px-4 inline-flex items-center text-sm font-semibold text-charcoal-500 hover:text-charcoal-950"
        >
          Skip
        </button>
      )}
      <OriginButton
        type="button"
        variant="main"
        size="big"
        disabled={!canContinue}
        onClick={onNext}
        className="ob-next"
      >
        {nextLabel} <ArrowRight style={{ width: 16, height: 16 }} />
      </OriginButton>
    </div>
  );
}
