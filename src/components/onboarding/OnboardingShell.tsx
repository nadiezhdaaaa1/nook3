import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { ProgressBar } from "@/components/onboarding/ProgressBar";

const STEP_ROUTE_RE = /^\/onboarding\/step\/(\d)/;

export function OnboardingShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const stepMatch = pathname.match(STEP_ROUTE_RE);
  const step = stepMatch ? Number(stepMatch[1]) : null;

  const onClose = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Exit? Your progress will be saved.")
    ) {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-charcoal-950/8 bg-paper">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <Logo className="text-lg" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
            aria-label="Exit onboarding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {step !== null && (
        <div className="border-b border-charcoal-950/8 bg-paper-warm">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-4">
            <ProgressBar step={step} total={5} />
          </div>
        </div>
      )}

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <Outlet />
      </main>
    </div>
  );
}
