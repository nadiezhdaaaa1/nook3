import { Outlet, useRouterState } from "@tanstack/react-router";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";

export function OnboardingShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPreview = pathname === "/onboarding/preview";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf6ee" }}>
      {!isPreview && <OnboardingHeader fixed />}

      <main
        className={`w-full mx-auto ${isPreview ? "h-full" : "flex-1 px-5"}`}
        style={isPreview ? { height: "calc(100vh - 96px)", paddingTop: 96 } : { maxWidth: 800, paddingTop: 160, paddingBottom: 40 }}
      >
        <Outlet />
      </main>
    </div>
  );
}
