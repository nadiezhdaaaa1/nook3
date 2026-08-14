import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import checkAsset from "@/assets/check.png.asset.json";

import { OriginButton } from "@/components/ui/origin-button";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { accessQueryOptions } from "@/lib/queries/access";
import { useHasSession } from "@/lib/queries/useHasSession";
import { clampOnboardingStep } from "@/lib/queries/access";
import { useOnboardingStore } from "@/lib/onboarding/store";



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

  // One restrained brand-coloured burst, once per visit, only after the real
  // content is on screen. Reduced motion opts out entirely.
  const confettiRef = useRef<ConfettiRef>(null);
  const firedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (waiting || reduceMotion || firedRef.current) return;
    firedRef.current = true;
    const t = setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 70,
        spread: 70,
        startVelocity: 34,
        gravity: 0.9,
        ticks: 90,
        scalar: 0.9,
        origin: { x: 0.5, y: 0.55 },
        colors: ["#6A820A", "#C2664E", "#FAF6EE", "#1a1a18"],
        disableForReducedMotion: true,
      });
    }, 120);
    return () => clearTimeout(t);
  }, [waiting, reduceMotion]);


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

  const variant: "A" | "B" | "C" = !a?.onboarded
    ? "A"
    : a?.onboarded && a?.hasEverSubscribed
      ? "C"
      : "B";

  const copy = {
    A: {
      title1: "Thank you!",
      title2: "You just took the first real step toward your apartment",
      body1:
        "While everyone else is still refreshing fifteen tabs with their coffee — you're already ahead",
      body2:
        "One last thing: set your filters — budget, neighborhood, size. That's it. From there, Nook's watching every listing site for you, and the moment your match drops, it lands straight in your inbox.",
      italic: "Your dream apartment isn't a someday. It's an email away",
      cta: "Set my filters",
      to: () =>
        navigate({
          to: "/onboarding/step/$step",
          params: { step: String(clampOnboardingStep(lastStep)) },
        }),
    },
    B: {
      title1: "You're all set",
      title2: "Nook starts watching now",
      body1:
        "While everyone else is still refreshing fifteen tabs with their coffee, your search is already running.",
      body2:
        "Your filters are live. From here Nook watches every listing site for you, and the moment your match drops, it lands straight in your inbox. Nothing else to do — just keep an eye on your email.",
      italic: "Your dream apartment isn't a someday. It's an email away",
      cta: "Go to my alerts",
      to: () => navigate({ to: "/home" }),
    },
    C: {
      title1: "You're all set",
      title2: "Nook starts watching now",
      body1:
        "While everyone else is still refreshing fifteen tabs with their coffee, your search is already running.",
      body2:
        "Your searches are back on, exactly as you left them. Nook watches every listing site for you, and the moment your match drops, it lands straight in your inbox.",
      italic: "Your dream apartment isn't a someday. It's an email away",
      cta: "Go to my alerts",
      to: () => navigate({ to: "/home" }),
    },
  }[variant];

  const introTrialLine =
    a?.plan === "intro"
      ? variant === "A"
        ? "Your 3 free days start when your search goes live — not today."
        : "Your 3 free days start now."
      : null;

  return (
    <div className="relative grid min-h-dvh place-items-center bg-[#FAF6EE] px-6 py-16">
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[520px]">
        <div className="flex flex-col gap-8">
          <div
            className="flex flex-col items-center gap-3 text-center"
            style={{ color: "#241C12", lineHeight: 1.2, letterSpacing: "-0.48px" }}
          >
            <p
              className="font-display text-[40px] font-semibold"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {copy.title1}
            </p>
            <p
              className="font-display text-[32px] font-bold"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {copy.title2}
            </p>
          </div>

          <div className="flex w-full items-center gap-5 overflow-hidden rounded-[16px] border border-black/20 bg-[#D9DEC3] px-8 py-6">
            <p
              className="flex-1 text-left text-[16px] font-normal leading-[24px] text-[#241C12]"
              style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}
            >
              {copy.body1}
            </p>
            <img
              src={checkAsset.url}
              alt=""
              aria-hidden="true"
              className="pointer-events-none h-14 w-14 shrink-0 object-contain"
            />
          </div>

          <p
            className="w-full px-4 text-center text-[16px] font-normal leading-[24px] text-[#241C12]"
            style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "wdth" 100' }}
          >
            {copy.body2}
          </p>

          <p
            className="max-w-[420px] px-4 text-center text-[14px] italic leading-[21px] text-[#241C12]"
            style={{ fontVariationSettings: '"GRAD" 0, "ROND" 0, "slnt" -14, "wdth" 100' }}
          >
            {copy.italic}
          </p>

          <div className="flex flex-col items-center gap-3">
            <OriginButton
              type="button"
              variant="green"
              size="big"
              className="h-[56px] w-[320px] rounded-[12px] max-[520px]:w-full"
              onClick={() => copy.to()}
            >
              {copy.cta}
            </OriginButton>
            {introTrialLine && (
              <p className="m-0 text-[14px] leading-[1.5] text-charcoal-500">
                {introTrialLine}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
