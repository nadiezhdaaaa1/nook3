import { createFileRoute } from "@tanstack/react-router";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your alerts — Nook" },
      { name: "description", content: "Tell us what you're looking for in 5 quick steps." },
    ],
  }),
  component: OnboardingShell,
});
