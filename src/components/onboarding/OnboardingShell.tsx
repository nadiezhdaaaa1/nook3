import { useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { X, ArrowLeft } from "lucide-react";
import { ExitModal } from "@/components/onboarding/ExitModal";
import { useOnboardingStore } from "@/lib/onboarding/store";
import nookLogo from "@/assets/Nook_Green.svg.asset.json";

const STEP_ROUTE_RE = /^\/onboarding\/step\/(\d)/;

const LABEL: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "#6e6459",
};

export function OnboardingShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const stepMatch = pathname.match(STEP_ROUTE_RE);
  const step = stepMatch ? Number(stepMatch[1]) : null;
  const [exitOpen, setExitOpen] = useState(false);
  const city = useOnboardingStore((s) => s.city);
  const set = useOnboardingStore((s) => s.set);

  const pct = step ? Math.round((step / 4) * 100) : 0;

  const onBack = () => {
    if (step && step > 1) {
      set("lastStep", step - 1);
      navigate({ to: "/onboarding/step/$step", params: { step: String(step - 1) } });
      return;
    }
    if (city) {
      set("city", null);
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf6ee" }}>
      <header
        className="ob-pill fixed left-1/2 -translate-x-1/2 z-40"
        style={{
          top: 24,
          width: "min(824px, calc(100vw - 32px))",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <div className="flex items-center" style={{ gap: 40 }}>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            style={{ padding: "0 8px" }}
            aria-label="Nook home"
          >
            <img src={nookLogo.url} alt="Nook" style={{ width: 70, height: 24 }} />
          </button>

          {step !== null && (
            <div className="flex flex-1 items-center min-w-0" style={{ gap: 12 }}>
              <span style={{ ...LABEL, width: 100, flexShrink: 0 }}>Step {step} of 4</span>
              <div
                className="flex-1 overflow-hidden"
                style={{ height: 6, borderRadius: 999, background: "rgba(0,0,0,0.2)" }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full ob-progress-fill"
                  style={{ width: `${pct}%`, background: "#d66c38", borderRadius: 999 }}
                />
              </div>
              <span className="ob-pct" style={{ ...LABEL, width: 40, textAlign: "right", flexShrink: 0 }}>
                {pct}%
              </span>
            </div>
          )}

          <div className="flex items-center" style={{ gap: 4 }}>
            <button
              type="button"
              onClick={onBack}
              className="ob-ghost inline-flex items-center"
              style={{
                gap: 8,
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                color: "#241c12",
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} /> Back
            </button>
            <button
              type="button"
              onClick={() => setExitOpen(true)}
              className="ob-ghost inline-flex items-center justify-center"
              style={{ padding: 12, borderRadius: 12, color: "#241c12" }}
              aria-label="Exit onboarding"
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>
      </header>

      <main
        className="flex-1 w-full mx-auto px-5"
        style={{ maxWidth: 800, paddingTop: 104, paddingBottom: 40 }}
      >
        <Outlet />
      </main>

      <ExitModal
        open={exitOpen}
        onStay={() => setExitOpen(false)}
        onExit={() => {
          setExitOpen(false);
          navigate({ to: "/" });
        }}
      />
    </div>
  );
}
