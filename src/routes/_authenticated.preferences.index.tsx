import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail, MessageSquare, Bell, Zap, CalendarDays, CalendarRange, Sparkles,
  ArrowRight, Lock, Moon, Settings2,
} from "lucide-react";
import { z } from "zod";
import { useOnboardingStore, type AlertChannel, type Frequency, type Plan } from "@/lib/onboarding/store";
import { useAppStore } from "@/lib/store";
import { usePreferencesStore, type PerSearchOverride, type QuietHours } from "@/lib/preferences/store";
import { StickySaveBar } from "@/components/preferences/StickySaveBar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preferences/")({
  component: NotificationsTab,
});

const PLAN_PILL: Record<Plan, { text: string; cta: string | null }> = {
  free: { text: "Free plan — 1 search, email alerts only", cta: "Upgrade" },
  premium: { text: "Premium — 3 searches, real-time alerts, SMS", cta: "Manage plan" },
  max: { text: "Max — Unlimited searches, all features unlocked", cta: null },
};

const PLAN_RANK: Record<Plan, number> = { free: 0, premium: 1, max: 2 };

const CHANNELS: { id: AlertChannel; label: string; icon: typeof Mail; minPlan: Plan }[] = [
  { id: "email", label: "Email only", icon: Mail, minPlan: "free" },
  { id: "text", label: "Text only", icon: MessageSquare, minPlan: "premium" },
  { id: "both", label: "Email + Text", icon: Bell, minPlan: "premium" },
];

const FREQS: { id: Frequency; label: string; desc: string; icon: typeof Zap; minPlan: Plan }[] = [
  { id: "maximum", label: "Maximum", desc: "Every match, the moment it's listed.", icon: Zap, minPlan: "premium" },
  { id: "balanced", label: "Balanced", desc: "Top matches, 2–3 times a day.", icon: CalendarDays, minPlan: "free" },
  { id: "minimal", label: "Minimal", desc: "Once daily — only strong matches.", icon: CalendarRange, minPlan: "free" },
  { id: "weekly", label: "Weekly digest", desc: "One curated email each week.", icon: Sparkles, minPlan: "free" },
];

const emailSchema = z.string().trim().max(255).email();
const phoneSchema = z.string().trim().max(20).refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone");

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function NotificationsTab() {
  const { alertChannel, frequency, email, phone, set } = useOnboardingStore();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const activeSearchId = useAppStore((s) => s.activeSearchId);
  const { quietHours, perSearch, setQuiet, setPerSearch } = usePreferencesStore();

  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [perSearchOpen, setPerSearchOpen] = useState(false);

  const needsEmail = alertChannel === "email" || alertChannel === "both";
  const needsPhone = alertChannel === "text" || alertChannel === "both";
  const emailError = needsEmail && email ? (emailSchema.safeParse(email).success ? null : "Enter a valid email.") : null;
  const phoneError = needsPhone && phone ? (phoneSchema.safeParse(phone).success ? null : "Enter a valid phone number.") : null;

  const pill = PLAN_PILL[plan] ?? PLAN_PILL.free;
  const userRank = PLAN_RANK[plan];

  const override = activeSearchId
    ? perSearch[activeSearchId] ?? { emailOverride: null, phoneOverride: null }
    : { emailOverride: null, phoneOverride: null };

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
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal-950">Alert channel</h3>
          <p className="text-xs text-charcoal-500 mt-1">Applies to this search only.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {CHANNELS.map((c) => {
            const locked = PLAN_RANK[c.minPlan] > userRank;
            const selected = alertChannel === c.id;
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                disabled={locked}
                onClick={() => !locked && set("alertChannel", c.id)}
                className={cn(
                  "relative p-4 rounded-card border-2 text-left transition-colors flex items-center gap-3",
                  locked
                    ? "border-border bg-paper-warm/40 cursor-not-allowed opacity-70"
                    : selected
                      ? "border-charcoal-950 bg-surface-elevated"
                      : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                <Icon className={cn("h-4 w-4", selected && !locked ? "text-sage-700" : "text-charcoal-400")} />
                <span className="text-sm font-semibold text-charcoal-950">{c.label}</span>
                {locked && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
                    <Lock className="h-3 w-3" /> Premium
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {plan === "free" && (
          <p className="text-xs text-charcoal-500">
            SMS alerts require Premium.{" "}
            <Link to="/preferences/account" className="text-sage-800 font-semibold hover:underline">
              Upgrade →
            </Link>
          </p>
        )}

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
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal-950">Frequency</h3>
          <p className="text-xs text-charcoal-500 mt-1">Applies to this search only.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {FREQS.map((f) => {
            const locked = PLAN_RANK[f.minPlan] > userRank;
            const selected = frequency === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                disabled={locked}
                onClick={() => !locked && set("frequency", f.id)}
                className={cn(
                  "relative p-4 rounded-card border-2 text-left transition-colors flex items-start gap-3",
                  locked
                    ? "border-border bg-paper-warm/40 cursor-not-allowed opacity-70"
                    : selected
                      ? "border-charcoal-950 bg-surface-elevated"
                      : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                <Icon className={cn("h-4 w-4 mt-0.5", selected && !locked ? "text-sage-700" : "text-charcoal-400")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal-950">{f.label}</span>
                    {locked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
                        <Lock className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-charcoal-600 mt-0.5">{f.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quiet hours */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-charcoal-950 flex items-center gap-2">
              <Moon className="h-4 w-4 text-charcoal-500" /> Quiet hours
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Pause alerts during this window. Applies to all searches.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={quietHours.enabled}
            onClick={() => setQuiet("enabled", !quietHours.enabled)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors shrink-0",
              quietHours.enabled ? "bg-charcoal-950" : "bg-charcoal-300",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform",
                quietHours.enabled ? "translate-x-5" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
        {quietHours.enabled && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="quiet-start" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Start
              </label>
              <input
                id="quiet-start"
                type="time"
                value={quietHours.start}
                onChange={(e) => setQuiet("start", e.target.value)}
                className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="quiet-end" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                End
              </label>
              <input
                id="quiet-end"
                type="time"
                value={quietHours.end}
                onChange={(e) => setQuiet("end", e.target.value)}
                className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
              />
            </div>
          </div>
        )}
      </section>

      {/* Per-search controls */}
      {activeSearchId && (
        <section className="space-y-4">
          <button
            type="button"
            onClick={() => setPerSearchOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-4 text-left"
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-charcoal-950 flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-charcoal-500" /> Per-search overrides
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Send this search's alerts to a different inbox or number.
              </p>
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-500">
              {perSearchOpen ? "Hide" : "Show"}
            </span>
          </button>
          {perSearchOpen && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="ovr-email" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                  Email override (optional)
                </label>
                <input
                  id="ovr-email"
                  type="email"
                  inputMode="email"
                  value={override.emailOverride ?? ""}
                  onChange={(e) =>
                    setPerSearch(activeSearchId, { emailOverride: e.target.value || null })
                  }
                  placeholder={email || "you@example.com"}
                  className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
                />
                <p className="text-[11px] text-charcoal-500">Leave empty to use your account email.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="ovr-phone" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                  Phone override (optional)
                </label>
                <input
                  id="ovr-phone"
                  type="tel"
                  inputMode="tel"
                  value={override.phoneOverride ?? ""}
                  onChange={(e) =>
                    setPerSearch(activeSearchId, {
                      phoneOverride: e.target.value ? formatPhone(e.target.value) : null,
                    })
                  }
                  placeholder={phone || "(555) 123-4567"}
                  disabled={plan === "free"}
                  className={cn(
                    "w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium",
                    plan === "free" && "opacity-60 cursor-not-allowed",
                  )}
                />
                <p className="text-[11px] text-charcoal-500">
                  {plan === "free" ? "SMS overrides require Premium." : "Leave empty to use your account phone."}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <SaveBar
        signal={`${plan}|${alertChannel}|${frequency}|${email}|${phone}|${quietHours.enabled}|${quietHours.start}|${quietHours.end}|${override.emailOverride}|${override.phoneOverride}`}
      />
    </div>
  );
}
