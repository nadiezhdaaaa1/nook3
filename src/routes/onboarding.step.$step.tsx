import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Step1Where } from "@/components/onboarding/Step1Where";
import { Step2Place } from "@/components/onboarding/Step2Place";
import { Step3Location } from "@/components/onboarding/Step3Location";
import { Step4Preferences } from "@/components/onboarding/Step4Preferences";

export const Route = createFileRoute("/onboarding/step/$step")({
  component: StepDispatcher,
});

function StepDispatcher() {
  const { step } = Route.useParams();
  const n = Number(step);

  // Step 5 (email alert setup) is deprecated — email is captured at signup.
  if (n === 5) {
    return <Navigate to="/onboarding/loading" />;
  }

  if (!Number.isFinite(n) || n < 1 || n > 4) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }

  switch (n) {
    case 1: return <Step1Where />;
    case 2: return <Step2Place />;
    case 3: return <Step3Location />;
    case 4: return <Step4Preferences />;
    default: return null;
  }
}
