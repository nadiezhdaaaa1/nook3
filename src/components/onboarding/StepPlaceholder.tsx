import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";

interface Props {
  stepLabel: string;
  title: string;
  subtitle: string;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
}

export function StepPlaceholder({
  stepLabel,
  title,
  subtitle,
  onBack,
  onNext,
  onSkip,
  nextLabel,
}: Props) {
  return (
    <div className="space-y-10">
      <header>
        <Eyebrow>{stepLabel}</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-4 text-base text-charcoal-600">{subtitle}</p>
      </header>

      <div className="p-8 rounded-card bg-surface-elevated border border-border">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-sage-700 mb-2">
          In progress
        </div>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          This step's full UI is being built in the next phase. Continue to verify
          the flow end-to-end, or come back later — your progress is saved.
        </p>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onNext={onNext}
        onSkip={onSkip}
        nextLabel={nextLabel}
      />
    </div>
  );
}
