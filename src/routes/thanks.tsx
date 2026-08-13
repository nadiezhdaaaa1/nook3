import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import crownAsset from "@/assets/crown.png.asset.json";


import { OriginButton } from "@/components/ui/origin-button";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { accessQueryOptions } from "@/lib/queries/access";
import { useHasSession } from "@/lib/queries/useHasSession";
import { clampOnboardingStep } from "@/lib/queries/access";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { useAppStore } from "@/lib/store";


/**
 * Post-checkout confirmation. Three variants, picked from server-derived
 * access state rather than a query param so a reload can't fake them:
 *   A — paid, no search yet        → continue setting up the search
 *   B — paid and already onboarded → straight into the app
 *   C — reactivated (was a paid subscriber before) → welcome back
 */

export const Route = createFileRoute("/thanks")({
  head: () => ({
    meta: [
      { title: "You're all set — Nook" },
      {
        name: "description",
        content: "Your Nook subscription is active. Finish setting up your apartment search.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "You're all set — Nook" },
      {
        property: "og:description",
        content: "Your Nook subscription is active.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  ssr: false,
  component: Thanks,
});

const PROVISIONING_MS = 1500;

function Thanks() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const hasSession = useHasSession();
  const [provisioning, setProvisioning] = useState(true);

  const searchCount = useAppStore((s) => s.searches.length);
  const lastStep = useOnboardingStore((s) => s.lastStep);

  const access = useQuery({ ...accessQueryOptions(), enabled: hasSession });

  // Provisioning delay: mirrors the real gap between checkout completing and
  // the webhook landing, so the UI never shows a stale "unpaid" state.
  useEffect(() => {
    const t = setTimeout(() => setProvisioning(false), PROVISIONING_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hasSession) void qc.invalidateQueries({ queryKey: accessQueryOptions().queryKey });
  }, [hasSession, qc]);

  const a = access.data;
  const waiting = provisioning || (hasSession && access.isPending);

  if (waiting) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#FAF6EE] px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#6A820A]" aria-hidden="true" />
          <p className="m-0 text-[16px] font-medium text-charcoal-950" role="status">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  const variant: "A" | "B" | "C" =
    a?.onboarded && a?.hasEverSubscribed && searchCount > 0
      ? "B"
      : a?.hasEverSubscribed && a?.onboarded
        ? "C"
        : a?.onboarded
          ? "B"
          : "A";

  const copy = {
    A: {
      title: "Payment confirmed",
      body: "Your subscription is active. Finish setting up your search and Nook starts watching for listings right away.",
      cta: "Finish my search",
      to: () => navigate({ to: "/onboarding/step/$step", params: { step: String(clampOnboardingStep(lastStep)) } }),
    },
    B: {
      title: "You're all set",
      body: "Your subscription is active and your searches are live. New matches will land in your alerts as they appear.",
      cta: "Go to my searches",
      to: () => navigate({ to: "/home" }),
    },
    C: {
      title: "Welcome back",
      body: "Your subscription is active again. Your saved searches and listings are exactly where you left them.",
      cta: "Back to my searches",
      to: () => navigate({ to: "/home" }),
    },
  }[variant];

  return (
    <div className="grid min-h-dvh place-items-center bg-[#FAF6EE] px-6 py-16">
      <div className="w-full max-w-[520px] text-center">
        <img
          src={crownAsset.url}
          alt=""
          aria-hidden="true"
          className="mx-auto h-[120px] w-[120px] rounded-full object-contain"
        />

        <h1 className="font-display mt-6 mb-0 text-[32px] font-bold leading-[1.15] text-charcoal-950">
          {copy.title}
        </h1>
        <p className="mx-auto mt-3 max-w-[420px] text-[16px] leading-[1.5] text-charcoal-500">
          {copy.body}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <OriginButton
            type="button"
            variant="main"
            size="big"
            className="w-full max-w-[320px]"
            onClick={() => copy.to()}
          >
            {copy.cta}
          </OriginButton>
          <OriginButton
            type="button"
            variant="tertiary"
            size="big"
            className="w-full max-w-[320px]"
            onClick={() => navigate({ to: "/account" })}
          >
            View my plan
          </OriginButton>
        </div>
      </div>
    </div>
  );
}
