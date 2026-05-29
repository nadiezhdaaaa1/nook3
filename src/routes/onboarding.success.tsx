import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/lib/onboarding/store";

export const Route = createFileRoute("/onboarding/success")({
  component: Success,
});

function Success() {
  const navigate = useNavigate();
  const { email, phone, alertChannel, set } = useOnboardingStore();

  useEffect(() => {
    if (!useOnboardingStore.getState().completedAt) {
      set("completedAt", new Date().toISOString());
    }
  }, [set]);

  return (
    <div className="text-center space-y-6 py-10">
      <div className="mx-auto h-16 w-16 rounded-pill bg-sage-100 flex items-center justify-center">
        <Check className="h-8 w-8 text-sage-700" />
      </div>
      <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950">
        You're all <span className="accent-italic">set</span>!
      </h1>
      <p className="text-charcoal-600 max-w-md mx-auto">
        We monitor 100+ sources around the clock and send an alert the moment a match appears.
      </p>

      <div className="mt-8 mx-auto max-w-md p-5 rounded-card bg-surface-elevated border border-border text-left text-sm">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-2">
          Alerts going to
        </div>
        {email && <div>📧 {email}</div>}
        {phone && (alertChannel === "text" || alertChannel === "both") && (
          <div>📱 {phone}</div>
        )}
        {!email && !phone && <div className="text-charcoal-500">No contact set yet.</div>}
      </div>

      <button
        type="button"
        onClick={() => navigate({ to: "/preferences" })}
        className="h-12 px-8 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors"
      >
        Done →
      </button>
    </div>
  );
}
