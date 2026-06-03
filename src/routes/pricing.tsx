import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /pricing → marketing pricing section on home
export const Route = createFileRoute("/pricing")({
  beforeLoad: () => {
    throw redirect({ to: "/onboarding/pricing", statusCode: 301 });
  },
  component: () => null,
});
