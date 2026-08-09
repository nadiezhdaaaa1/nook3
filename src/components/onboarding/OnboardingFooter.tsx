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
    <div className="flex items-center gap-2 ob-next-row">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="ob-ghost inline-flex items-center"
          style={{
            height: 56,
            gap: 8,
            padding: "0 20px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            color: "#241c12",
          }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>Back</span>
        </button>
      )}
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="ob-ghost inline-flex items-center"
          style={{
            height: 56,
            gap: 8,
            padding: "0 24px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            color: "#241c12",
          }}
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
        className="ob-next ml-auto"
      >
        {nextLabel} <ArrowRight style={{ width: 16, height: 16 }} />
      </OriginButton>
    </div>
  );
}

