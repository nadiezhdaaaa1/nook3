import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Sparkles, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OriginButton } from "@/components/ui/origin-button";

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
  const isPremium = nextTier === "premium";

  const goPricing = () => {
    navigate({ to: "/onboarding/pricing" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full overflow-hidden rounded-t-card bg-white shadow-2xl sm:max-w-lg sm:rounded-card">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-pill text-charcoal-600 hover:bg-charcoal-950/8"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-4 px-6 pt-8 pb-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 font-sans text-[12px] uppercase tracking-[0.18em] text-peach-900">
              <Sparkles className="h-4 w-4" /> Plan limit reached
            </div>
            <h2 className="font-display text-[28px] font-bold leading-tight tracking-[-0.04em] text-charcoal-950">
              Track more cities with {isPremium ? "Premium" : "Max"}
            </h2>
          </div>

          {/* Body copy */}
          <div className="flex flex-col gap-4 text-charcoal-700">
            <p className="text-base leading-relaxed">
              {plan === "free"
                ? "You're on Free — limited to 1 active search. Upgrade to run up to 3 at once."
                : "Premium covers 3 searches. Go Max for unlimited tracking across every city."}
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {(isPremium
                ? [
                    "Up to 3 active searches",
                    "Real-time email alerts, no delay",
                    "Per-search notification settings",
                  ]
                : [
                    "Unlimited active searches",
                    "Real-time alerts across cities",
                    "Roommate mode (multi-account)",
                    "Priority concierge support",
                  ]
              ).map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <OriginButton
              type="button"
              variant="tertiary"
              size="big"
              className="w-full sm:w-auto"
              onClick={onClose}
            >
              Maybe later
            </OriginButton>
            <OriginButton
              type="button"
              variant="main"
              size="big"
              className="w-full sm:flex-1"
              onClick={goPricing}
            >
              View plans
            </OriginButton>
          </div>
        </div>
      </div>
    </div>
  );
}
