import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";

export const Route = createFileRoute("/_authenticated/search/new")({
  beforeLoad: ({ location }) => {
    if (location.pathname.replace(/\/$/, "") === "/search/new") {
      throw redirect({ to: "/search/new/$step", params: { step: "1" } });
    }
  },
  component: NewSearchLayout,
});

function NewSearchLayout() {
  return (
    <div className="min-h-[calc(100dvh-64px)]" style={{ background: "#faf6ee" }}>
      <div className="w-full mx-auto px-5" style={{ maxWidth: 800, paddingTop: 24 }}>
        <OnboardingHeader fixed={false} />
      </div>
      <main className="w-full mx-auto px-5" style={{ maxWidth: 800, paddingTop: 40, paddingBottom: 40 }}>
        <Outlet />
      </main>
    </div>
  );
}
