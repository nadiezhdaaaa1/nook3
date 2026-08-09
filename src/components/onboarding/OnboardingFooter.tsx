import { ArrowRight, ArrowLeft } from "lucide-react";
import { OriginButton } from "@/components/ui/origin-button";

interface Props {
  canContinue?: boolean;
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
}

export function OnboardingFooter({
  canContinue = true,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Next",
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 ob-next-row">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="ob-ghost inline-flex items-center"
          style={{
            height: 56,
            gap: 8,
            padding: "0 16px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            color: "#241c12",
          }}
        >
          <ArrowLeft style={{ width: 20, height: 20 }} />
          <span className="hidden sm:inline">Back</span>
        </button>
      ) : (
        <div />
      )}

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
    </div>
  );
}

