import { Sparkles, Zap, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore, selectQuota } from "@/lib/store";
import { UpgradeModal } from "./UpgradeModal";

const DISMISS_KEY = "nook.banner.planlimits.dismissed.v1";

/**
 * Subtle banner shown when a free/premium user is at or near their quota.
 * Free at 1/1 → "Tracking 1 city? Premium lets you watch 3."
 * Premium at 3/3 → "Max unlocks unlimited searches."
 * Dismissible (persisted to localStorage), hidden entirely on Max plan.
 */
export function PlanLimitsBanner() {
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const quota = useAppStore(selectQuota);
  const [dismissed, setDismissed] = useState(true);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (plan === "max") return null;
  if (quota.remaining > 0 && plan !== "free") return null;
  if (dismissed) return null;

  const isFreeAtLimit = plan === "free" && quota.used >= quota.max;
  const isPremiumAtLimit = plan === "premium" && quota.used >= quota.max;

  const headline = isFreeAtLimit
    ? "You're tracking 1 city. Want 3?"
    : isPremiumAtLimit
      ? "You're using all 3 searches. Need more?"
      : "Looking in more than one neighborhood? Upgrade to add searches.";

  const sub = isFreeAtLimit
    ? "Premium lets you run 3 searches in parallel — perfect for comparing neighborhoods or cities."
    : isPremiumAtLimit
      ? "Max removes the cap entirely — track unlimited searches across every city."
      : "Premium adds 2 more search slots — $14.99/mo, cancel anytime.";

  const dismiss = () => {
    if (typeof window !== "undefined") localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <>
      <div className="relative mb-6 rounded-card border border-peach-300/60 bg-gradient-to-r from-peach-100/70 via-paper to-sage-100/40 p-4 md:p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-pill bg-paper border border-peach-300 flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 text-peach-900" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-peach-900 mb-1">
            {quota.label}
          </div>
          <div className="font-display text-base md:text-lg font-bold text-charcoal-950 leading-tight">
            {headline}
          </div>
          <div className="text-xs md:text-sm text-charcoal-600 mt-1">{sub}</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setUpgradeOpen(true)}
            className="h-10 px-4 inline-flex items-center gap-1.5 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800"
          >
            <Zap className="h-3.5 w-3.5" /> Upgrade
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 h-7 w-7 rounded-pill inline-flex items-center justify-center text-charcoal-500 hover:bg-charcoal-950/8 hover:text-charcoal-950"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setUpgradeOpen(true)}
          className="sm:hidden absolute right-10 top-2 h-7 px-3 rounded-pill bg-charcoal-950 text-paper text-[11px] font-semibold"
        >
          Upgrade
        </button>
      </div>
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </>
  );
}
