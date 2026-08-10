import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ExitModal } from "./ExitModal";
import { Logo } from "@/components/brand/Logo";


const STEP_ROUTE_RE = /^\/(?:onboarding\/step|search\/new)\/(\d)/;

const LABEL: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "#6e6459",
};

interface OnboardingHeaderProps {
  fixed?: boolean;
}

export function OnboardingHeader({ fixed = true }: OnboardingHeaderProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isNewSearch = pathname.startsWith("/search/new");
  const stepMatch = pathname.match(STEP_ROUTE_RE);
  const step = stepMatch ? Number(stepMatch[1]) : null;
  const [exitOpen, setExitOpen] = useState(false);

  const pct = step ? Math.round((step / 4) * 100) : 0;

  return (
    <>
      <header
        className={fixed ? "ob-pill fixed left-1/2 -translate-x-1/2 z-40" : "ob-pill w-full"}
        style={{
          top: fixed ? 24 : undefined,
          width: fixed ? "min(800px, calc(100vw - 32px))" : undefined,
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <div className="flex items-center justify-between" style={{ gap: 32 }}>
          <div style={{ padding: "0 8px" }} aria-label="Nook" role="img">
            <Logo className="h-6 w-auto" />
          </div>

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
            onClick={() =>
              isNewSearch
                ? navigate({ to: "/saved", search: { tab: "searches" } as never })
                : setExitOpen(true)
            }
            className="ob-ghost inline-flex items-center justify-center"
            style={{ padding: 12, borderRadius: 12, color: "#241c12" }}
            aria-label={isNewSearch ? "Cancel new search" : "Exit onboarding"}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </header>

      <ExitModal
        open={exitOpen}
        onStay={() => setExitOpen(false)}
        onExit={() => {
          setExitOpen(false);
          navigate({ to: "/" });
        }}
      />

    </>
  );
}
