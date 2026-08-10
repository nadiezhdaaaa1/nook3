import { useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ExitModal } from "@/components/onboarding/ExitModal";

import nookLogo from "@/assets/Nook_Green.svg.asset.json";

export function OnboardingShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [exitOpen, setExitOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf6ee" }}>
      <header className="flex items-center justify-center px-6 py-4">
        <div className="flex w-full items-center justify-between" style={{ maxWidth: 800 }}>
          <img
            src={nookLogo.url}
            alt="Nook"
            className="h-6 w-auto"
            style={{ width: 70, height: 24, objectFit: "contain" }}
          />

          <button
            type="button"
            onClick={() => setExitOpen(true)}
            className="inline-flex items-center justify-center"
            style={{ padding: 12, borderRadius: 12, color: "#241c12" }}
            aria-label="Exit onboarding"
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </header>

      <main
        className="flex-1 w-full mx-auto px-5"
        style={{ maxWidth: 800, paddingTop: 40, paddingBottom: 40 }}
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
