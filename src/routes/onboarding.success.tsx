import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Gift, Home } from "lucide-react";
import { useOnboardingStore, getReferralCode } from "@/lib/onboarding/store";
import { MoveOutModal } from "@/components/onboarding/MoveOutModal";

export const Route = createFileRoute("/onboarding/success")({
  component: Success,
});

function Success() {
  const navigate = useNavigate();
  const { email, phone, alertChannel, selectedPlan, trialActive, moveOut, set } =
    useOnboardingStore();
  const [moveOutOpen, setMoveOutOpen] = useState(false);
  const [referral, setReferral] = useState("");

  useEffect(() => {
    if (!useOnboardingStore.getState().completedAt) {
      set("completedAt", new Date().toISOString());
    }
    setReferral(getReferralCode());
  }, [set]);

  const copyRef = () => {
    if (typeof window === "undefined" || !referral) return;
    const url = `${window.location.origin}/?ref=${referral}`;
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className="text-center space-y-8 py-6">
      <div className="mx-auto h-16 w-16 rounded-pill bg-sage-100 flex items-center justify-center animate-scale-in">
        <Check className="h-8 w-8 text-sage-700" />
      </div>
      <div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950">
          You're all <span className="accent-italic">set</span>!
        </h1>
        <p className="mt-3 text-charcoal-600 max-w-md mx-auto">
          We monitor 100+ sources around the clock and ping you the moment a match appears.
        </p>
      </div>

      {/* Alert summary */}
      <div className="mx-auto max-w-md p-5 rounded-card bg-surface-elevated border border-border text-left text-sm space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
          Alerts going to
        </div>
        {email && (alertChannel === "email" || alertChannel === "both") && (
          <div className="font-medium text-charcoal-950">📧 {email}</div>
        )}
        {phone && (alertChannel === "text" || alertChannel === "both") && (
          <div className="font-medium text-charcoal-950">📱 {phone}</div>
        )}
        {selectedPlan && selectedPlan !== "free" && (
          <div className="text-xs text-sage-700 font-semibold pt-1">
            {trialActive ? "3-day free trial active · " : ""}
            {selectedPlan === "premium" ? "Premium" : "Max"} plan
          </div>
        )}
      </div>

      {/* Move-out CTA */}
      <button
        type="button"
        onClick={() => setMoveOutOpen(true)}
        className="mx-auto inline-flex items-center gap-2 px-5 h-11 rounded-pill border border-dashed border-charcoal-300 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950 hover:text-charcoal-950"
      >
        <Home className="h-4 w-4" />
        {moveOut ? "Edit move-out details" : "Are you moving out? Tell us about your place"}
      </button>

      {/* Referral block */}
      {referral && (
        <div className="mx-auto max-w-md p-5 rounded-card bg-peach-100/60 border border-peach-300/50 text-left">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-peach-900 mb-2">
            <Gift className="h-3.5 w-3.5" /> Refer a friend
          </div>
          <p className="text-sm text-charcoal-800">
            Share Nook with a friend and you both get an extra free week of Premium.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${referral}`}
              className="flex-1 h-10 px-3 rounded-md bg-paper border border-border text-xs font-mono text-charcoal-700"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={copyRef}
              className="h-10 px-4 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate({ to: "/preferences" })}
        className="h-12 px-8 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors"
      >
        Go to my preferences →
      </button>

      {moveOutOpen && <MoveOutModal onClose={() => setMoveOutOpen(false)} />}
    </div>
  );
}
