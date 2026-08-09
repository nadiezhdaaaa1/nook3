import { useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
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
          width: "min(800px, calc(100vw - 32px))",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <div className="flex items-center" style={{ gap: 24 }}>
          <div style={{ padding: "0 8px" }} aria-label="Nook" role="img">
            <div
              style={{
                width: 70,
                height: 24,
                backgroundColor: "rgba(0,0,0,0.2)",
                WebkitMaskImage: `url(${nookLogo.url})`,
                maskImage: `url(${nookLogo.url})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
          </div>

          <button
            type="button"
            disabled={step === 1}
            onClick={onBack}
            className="ob-ghost inline-flex items-center"
            style={{
              gap: 8,
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              color: "#241c12",
              opacity: step === 1 ? 0.35 : 1,
              cursor: step === 1 ? "not-allowed" : "pointer",
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {step !== null && (
            <div className="flex flex-1 items-center min-w-0" style={{ gap: 12 }}>
              <span style={{ ...LABEL, width: 100, flexShrink: 0 }}>Step {step} of 4</span>
              <div
                className="flex flex-1 overflow-hidden"
                style={{ height: 6, borderRadius: 40 }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-full flex-1 ob-progress-fill"
                    style={{ background: step && n <= step ? "#d66c38" : "rgba(0,0,0,0.2)" }}
                  />
                ))}
              </div>
              <span className="ob-pct" style={{ ...LABEL, width: 40, textAlign: "right", flexShrink: 0 }}>
                {pct}%
              </span>
            </div>
          )}

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
      </header>

      <main
        className="flex-1 w-full mx-auto px-5"
        style={{ maxWidth: 800, paddingTop: 160, paddingBottom: 40 }}
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
