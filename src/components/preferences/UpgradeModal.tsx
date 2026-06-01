import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Upgrade modal shown when a user hits their plan's search quota and tries to
 * add another. Highlights the next tier and links to onboarding pricing.
 */
export function UpgradeModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const plan = useAppStore((s) => s.user?.plan ?? "free");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const nextTier = plan === "free" ? "premium" : "max";

  const goPricing = () => {
    navigate({ to: "/onboarding/pricing" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-charcoal-950/40 backdrop-blur-sm p-0 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full sm:max-w-lg bg-paper rounded-t-card sm:rounded-card border border-charcoal-200 shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 h-9 w-9 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/8 text-charcoal-600 z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-7 pb-5 bg-gradient-to-br from-peach-100/80 via-paper to-sage-100/40">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-peach-900 mb-2">
            <Sparkles className="h-3 w-3" /> Plan limit reached
          </div>
          <h2 className="font-display text-2xl font-bold text-charcoal-950 leading-tight">
            Track more cities with{" "}
            <span className="accent-italic">
              {nextTier === "premium" ? "Premium" : "Max"}
            </span>
            .
          </h2>
          <p className="mt-2 text-sm text-charcoal-700">
            {plan === "free"
              ? "You're on Free — limited to 1 active search. Upgrade to run up to 3 at once."
              : "Premium covers 3 searches. Go Max for unlimited tracking across every city."}
          </p>
        </div>

        {/* Tier card */}
        <div className="px-6 py-5">
          <TierCard tier={nextTier} />
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-5 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={goPricing}
            className="flex-1 h-11 px-5 inline-flex items-center justify-center gap-2 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800"
          >
            <Zap className="h-4 w-4" />
            View plans
          </button>
        </div>
      </div>
    </div>
  );
}

function TierCard({ tier }: { tier: "premium" | "max" }) {
  const isMax = tier === "max";
  const features = isMax
    ? [
        "Unlimited active searches",
        "Real-time alerts across cities",
        "Roommate mode (multi-account)",
        "Priority concierge support",
      ]
    : [
        "Up to 3 active searches",
        "Real-time email alerts, no delay",
        "1 text alert per day",
        "Per-search notification settings",
      ];
  return (
    <div
      className={cn(
        "rounded-card border p-5",
        isMax
          ? "border-charcoal-950 bg-charcoal-950 text-paper"
          : "border-peach-300 bg-peach-100/40",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-8 w-8 rounded-pill inline-flex items-center justify-center",
              isMax ? "bg-paper text-charcoal-950" : "bg-peach-300/60 text-peach-900",
            )}
          >
            <Crown className="h-4 w-4" />
          </div>
          <div className="font-display text-lg font-bold">
            {isMax ? "Max" : "Premium"}
          </div>
        </div>
        <div
          className={cn(
            "text-right",
            isMax ? "text-paper" : "text-charcoal-950",
          )}
        >
          <div className="text-xl font-bold">{isMax ? "$29.99" : "$14.99"}</div>
          <div className={cn("text-[10px] font-mono uppercase tracking-[0.14em]", isMax ? "text-paper/60" : "text-charcoal-500")}>
            per month
          </div>
        </div>
      </div>
      <ul className="space-y-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check
              className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                isMax ? "text-sage-200" : "text-sage-700",
              )}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
