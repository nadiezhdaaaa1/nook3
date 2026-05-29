import { useNavigate } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useOnboardingStore, type AlertChannel } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const CHANNELS: { id: AlertChannel; label: string; desc: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email only",   desc: "Daily digest in your inbox.",     icon: Mail },
  { id: "text",  label: "Text only",    desc: "Instant SMS for hot listings.",   icon: MessageSquare },
  { id: "both",  label: "Email + Text", desc: "Digest + instant pings.",         icon: Bell },
];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function isPhone(v: string) {
  return v.replace(/\D/g, "").length >= 10;
}

export function Step5Alerts() {
  const navigate = useNavigate();
  const { alertChannel, email, phone, set } = useOnboardingStore();
  const needsEmail = alertChannel === "email" || alertChannel === "both";
  const needsPhone = alertChannel === "text" || alertChannel === "both";
  const canContinue =
    (!needsEmail || isEmail(email)) && (!needsPhone || isPhone(phone));

  return (
    <div className="space-y-12">
      <header>
        <Eyebrow>Step 5 · Alert setup</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          How should we <span className="accent-italic">reach you</span>?
        </h1>
        <p className="mt-4 text-base text-charcoal-600">
          We'll only ping when a listing matches your filters.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-3">
        {CHANNELS.map((c) => {
          const selected = alertChannel === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => set("alertChannel", c.id)}
              className={cn(
                "p-5 rounded-card border-2 text-left transition-colors flex flex-col gap-2",
                selected
                  ? "border-charcoal-950 bg-surface-elevated"
                  : "border-border bg-transparent hover:border-charcoal-400",
              )}
            >
              <Icon className={cn("h-5 w-5", selected ? "text-sage-700" : "text-charcoal-400")} />
              <div className="text-sm font-semibold text-charcoal-950">{c.label}</div>
              <div className="text-xs text-charcoal-600">{c.desc}</div>
            </button>
          );
        })}
      </section>

      {needsEmail && (
        <section className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full h-12 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
          />
          {email && !isEmail(email) && (
            <p className="text-xs text-danger">Enter a valid email.</p>
          )}
        </section>
      )}

      {needsPhone && (
        <section className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full h-12 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
          />
          {phone && !isPhone(phone) && (
            <p className="text-xs text-danger">Enter a valid phone number.</p>
          )}
          <p className="text-xs text-charcoal-500">
            Standard SMS rates may apply. Reply STOP to unsubscribe.
          </p>
        </section>
      )}

      <OnboardingFooter
        canContinue={canContinue}
        nextLabel="Find my apartments"
        onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "4" } })}
        onNext={() => navigate({ to: "/onboarding/loading" })}
      />
    </div>
  );
}
