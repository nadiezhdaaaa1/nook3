import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Bell, Zap, CalendarDays, CalendarRange, Sparkles, Check } from "lucide-react";
import { z } from "zod";
import { useOnboardingStore, type AlertChannel, type Frequency, type Plan } from "@/lib/onboarding/store";
import { SaveBar } from "@/components/preferences/SaveBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preferences/")({
  component: NotificationsTab,
});

const PLANS: { id: Plan; label: string; price: string; desc: string }[] = [
  { id: "free", label: "Free", price: "$0", desc: "Daily digest, basic filters." },
  { id: "premium", label: "Premium", price: "$15/mo", desc: "Instant alerts, all filters, no-fee finder." },
  { id: "max", label: "Max", price: "$29/mo", desc: "Concierge matches + early access." },
];

const CHANNELS: { id: AlertChannel; label: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email only", icon: Mail },
  { id: "text", label: "Text only", icon: MessageSquare },
  { id: "both", label: "Email + Text", icon: Bell },
];

const FREQS: { id: Frequency; label: string; desc: string; icon: typeof Zap }[] = [
  { id: "maximum", label: "Maximum", desc: "Every match, the moment it's listed.", icon: Zap },
  { id: "balanced", label: "Balanced", desc: "Top matches, 2–3 times a day.", icon: CalendarDays },
  { id: "minimal", label: "Minimal", desc: "Once daily — only strong matches.", icon: CalendarRange },
  { id: "weekly", label: "Weekly digest", desc: "One curated email each week.", icon: Sparkles },
];

const emailSchema = z.string().trim().max(255).email();
const phoneSchema = z
  .string()
  .trim()
  .max(20)
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone");

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function NotificationsTab() {
  const {
    selectedPlan, alertChannel, frequency, email, phone, trialActive,
    set,
  } = useOnboardingStore();
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const needsEmail = alertChannel === "email" || alertChannel === "both";
  const needsPhone = alertChannel === "text" || alertChannel === "both";
  const emailError = needsEmail && email ? (emailSchema.safeParse(email).success ? null : "Enter a valid email.") : null;
  const phoneError = needsPhone && phone ? (phoneSchema.safeParse(phone).success ? null : "Enter a valid phone number.") : null;
  const currentPlan = selectedPlan ?? "free";

  return (
    <div className="space-y-12">
      <header>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">Notifications</h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Plan, alert channel, and how often we ping you.
        </p>
      </header>

      {/* Plan */}
      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Subscription plan</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {PLANS.map((p) => {
            const isCurrent = currentPlan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => set("selectedPlan", p.id)}
                className={cn(
                  "p-5 rounded-card border-2 text-left transition-colors relative",
                  isCurrent
                    ? "border-charcoal-950 bg-surface-elevated"
                    : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                {isCurrent && (
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-sage-700 text-paper text-[9px] font-mono uppercase tracking-[0.16em]">
                    <Check className="h-2.5 w-2.5" /> Current
                  </div>
                )}
                <div className="flex items-baseline justify-between pr-16">
                  <div className="font-display text-base font-bold text-charcoal-950">{p.label}</div>
                  <div className="text-xs font-mono text-charcoal-600">{p.price}</div>
                </div>
                <div className="text-xs text-charcoal-600 mt-2 leading-relaxed">{p.desc}</div>
                {isCurrent && trialActive && p.id !== "free" && (
                  <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.16em] text-peach-700">
                    Free trial active
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Channel */}
      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Alert channel</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {CHANNELS.map((c) => {
            const selected = alertChannel === c.id;
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => set("alertChannel", c.id)}
                className={cn(
                  "p-4 rounded-card border-2 text-left transition-colors flex items-center gap-3",
                  selected
                    ? "border-charcoal-950 bg-surface-elevated"
                    : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                <Icon className={cn("h-4 w-4", selected ? "text-sage-700" : "text-charcoal-400")} />
                <span className="text-sm font-semibold text-charcoal-950">{c.label}</span>
              </button>
            );
          })}
        </div>

        {needsEmail && (
          <div className="space-y-2">
            <label htmlFor="pref-email" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
              Email address
            </label>
            <input
              id="pref-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              aria-invalid={!!(emailTouched && emailError)}
              className={cn(
                "w-full h-11 px-4 rounded-md bg-surface-elevated border focus:outline-none text-sm font-medium",
                emailTouched && emailError ? "border-danger focus:border-danger" : "border-border focus:border-charcoal-950",
              )}
            />
            {emailTouched && emailError && <p className="text-xs text-danger">{emailError}</p>}
          </div>
        )}
        {needsPhone && (
          <div className="space-y-2">
            <label htmlFor="pref-phone" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
              Phone number
            </label>
            <input
              id="pref-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => set("phone", formatPhone(e.target.value))}
              onBlur={() => setPhoneTouched(true)}
              placeholder="(555) 123-4567"
              aria-invalid={!!(phoneTouched && phoneError)}
              className={cn(
                "w-full h-11 px-4 rounded-md bg-surface-elevated border focus:outline-none text-sm font-medium",
                phoneTouched && phoneError ? "border-danger focus:border-danger" : "border-border focus:border-charcoal-950",
              )}
            />
            {phoneTouched && phoneError && <p className="text-xs text-danger">{phoneError}</p>}
          </div>
        )}
      </section>

      {/* Frequency */}
      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Frequency</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {FREQS.map((f) => {
            const selected = frequency === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => set("frequency", f.id)}
                className={cn(
                  "p-4 rounded-card border-2 text-left transition-colors flex items-start gap-3",
                  selected
                    ? "border-charcoal-950 bg-surface-elevated"
                    : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                <Icon className={cn("h-4 w-4 mt-0.5", selected ? "text-sage-700" : "text-charcoal-400")} />
                <div>
                  <div className="text-sm font-semibold text-charcoal-950">{f.label}</div>
                  <div className="text-xs text-charcoal-600 mt-0.5">{f.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <SaveBar signal={`${selectedPlan}|${alertChannel}|${frequency}|${email}|${phone}`} />
    </div>
  );
}
