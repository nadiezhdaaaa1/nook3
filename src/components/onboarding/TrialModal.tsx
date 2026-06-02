import { useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

interface Props {
  plan: Plan;
  onClose: () => void;
  onConfirm: () => void;
}

const COPY: Record<Exclude<Plan, "free">, { name: string; price: string; bullets: string[] }> = {
  premium: {
    name: "Premium",
    price: "$14.99/mo",
    bullets: [
      "3 days free, cancel anytime",
      "Unlimited email + 1 text/day",
      "Real-time alerts (no delay)",
    ],
  },
  max: {
    name: "Max",
    price: "$29/mo",
    bullets: [
      "3 days free, cancel anytime",
      "Unlimited texts + upcoming listings forecast",
      "Roommate mode included",
    ],
  },
};

export function TrialModal({ plan, onClose, onConfirm }: Props) {
  const [busy, setBusy] = useState(false);
  const { set } = useOnboardingStore();

  if (plan === "free") return null;
  const copy = COPY[plan];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal-950/40 animate-fade-in p-4">
      <div className="w-full max-w-md rounded-card bg-paper shadow-elevated animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-peach-700" />
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
              Start free trial
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <div className="font-display text-2xl font-bold text-charcoal-950">
              {copy.name} · {copy.price}
            </div>
            <p className="text-sm text-charcoal-600 mt-1">
              Free for 3 days. We'll remind you before the trial ends.
            </p>
          </div>
          <ul className="space-y-2.5">
            {copy.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-charcoal-800">
                <Check className="h-4 w-4 text-sage-700 flex-shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="text-xs text-charcoal-500 leading-relaxed">
            No payment required to start. Add a card later if you want to keep going past 3 days.
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              set("selectedPlan", plan);
              set("trialActive", true);
              onConfirm();
            }}
            className={cn(
              "w-full h-12 rounded-pill text-sm font-semibold transition-colors",
              busy
                ? "bg-charcoal-300 text-charcoal-500"
                : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
            )}
          >
            {busy ? "Starting trial…" : "Start free trial"}
          </button>
          <p className="text-xs text-charcoal-600 leading-relaxed text-center -mt-1">
            After your 3-day free trial, your plan auto-renews at{" "}
            <span className="font-semibold text-charcoal-950">{copy.price}</span> until cancelled.
            Cancel anytime in{" "}
            <span className="font-semibold text-charcoal-950">Account → Subscription</span>.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-xs font-semibold text-charcoal-500 hover:text-charcoal-950"
          >
            Maybe later — continue with Free
          </button>
        </div>
      </div>
    </div>
  );
}
