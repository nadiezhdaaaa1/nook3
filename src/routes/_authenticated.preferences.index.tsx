import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Bell, Zap, CalendarDays, CalendarRange, Sparkles, ArrowRight } from "lucide-react";
import { z } from "zod";
import { useOnboardingStore, type AlertChannel, type Frequency } from "@/lib/onboarding/store";
import { useAppStore } from "@/lib/store";
import { SaveBar } from "@/components/preferences/SaveBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preferences/")({
  component: NotificationsTab,
});

const PLAN_PILL: Record<string, { text: string; cta: string | null }> = {
  free: { text: "Free plan — 1 search, email alerts only", cta: "Upgrade" },
  premium: { text: "Premium — 3 searches, real-time alerts, SMS", cta: "Manage plan" },
  max: { text: "Max — Unlimited searches, all features unlocked", cta: null },
};

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
    alertChannel, frequency, email, phone,
    set,
  } = useOnboardingStore();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const needsEmail = alertChannel === "email" || alertChannel === "both";
  const needsPhone = alertChannel === "text" || alertChannel === "both";
  const emailError = needsEmail && email ? (emailSchema.safeParse(email).success ? null : "Enter a valid email.") : null;
  const phoneError = needsPhone && phone ? (phoneSchema.safeParse(phone).success ? null : "Enter a valid phone number.") : null;

  const pill = PLAN_PILL[plan] ?? PLAN_PILL.free;

  return (
    <div className="space-y-12">
      {/* Plan-context pill */}
      <div className="flex items-center justify-between gap-4 px-5 h-14 rounded-card bg-paper-warm border border-charcoal-950/8">
        <div className="flex items-center gap-2.5 min-w-0">
          <Sparkles className="h-4 w-4 text-sage-700 shrink-0" />
          <span className="text-sm text-charcoal-700 truncate">{pill.text}</span>
        </div>
        {pill.cta && (
          <Link
            to="/preferences/account"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sage-800 hover:text-sage-900 whitespace-nowrap"
          >
            {pill.cta} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>


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

      <SaveBar signal={`${plan}|${alertChannel}|${frequency}|${email}|${phone}`} />
    </div>
  );
}
