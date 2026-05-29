import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { Step1Where } from "@/components/onboarding/Step1Where";
import { StepPlaceholder } from "@/components/onboarding/StepPlaceholder";

export const Route = createFileRoute("/onboarding/step/$step")({
  component: StepDispatcher,
});

function StepDispatcher() {
  const { step } = Route.useParams();
  const navigate = useNavigate();
  const n = Number(step);

  if (!Number.isFinite(n) || n < 1 || n > 5) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }

  switch (n) {
    case 1:
      return <Step1Where />;
    case 2:
      return (
        <StepPlaceholder
          stepLabel="Step 2 · Place type & protection"
          title="Place type & protection"
          subtitle="Bedrooms, bathrooms, and rent-protection preferences."
          onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "1" } })}
          onNext={() => navigate({ to: "/onboarding/step/$step", params: { step: "3" } })}
        />
      );
    case 3:
      return (
        <StepPlaceholder
          stepLabel="Step 3 · Location"
          title="Where specifically?"
          subtitle="Neighborhood picker + interactive map (coming in the next build pass)."
          onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "2" } })}
          onNext={() => navigate({ to: "/onboarding/step/$step", params: { step: "4" } })}
        />
      );
    case 4:
      return (
        <StepPlaceholder
          stepLabel="Step 4 · Preferences (optional)"
          title="Any specific preferences?"
          subtitle="Amenities + subway lines with smart filter."
          onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "3" } })}
          onNext={() => navigate({ to: "/onboarding/step/$step", params: { step: "5" } })}
          onSkip={() => navigate({ to: "/onboarding/step/$step", params: { step: "5" } })}
        />
      );
    case 5:
      return (
        <StepPlaceholder
          stepLabel="Step 5 · Alert setup"
          title="How should we reach you?"
          subtitle="Email & text channel selection."
          onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "4" } })}
          onNext={() => navigate({ to: "/onboarding/loading" })}
          nextLabel="Find my apartments"
        />
      );
    default:
      return null;
  }
}
