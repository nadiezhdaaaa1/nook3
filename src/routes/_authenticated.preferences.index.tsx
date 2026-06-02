import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Mail, MessageSquare, Bell, Zap, CalendarDays, CalendarRange, Sparkles,
  ArrowRight, Lock, Moon, Info, Check, AlertCircle,
} from "lucide-react";
import { z } from "zod";

import { useOnboardingStore, type AlertChannel, type Frequency, type Plan } from "@/lib/onboarding/store";
import { useAppStore } from "@/lib/store";
import { usePreferencesStore } from "@/lib/preferences/store";
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

const CHANNELS: { id: AlertChannel; label: string; icon: typeof Mail; minPlan: Plan; freeFallback: string }[] = [
  { id: "email", label: "Email only", icon: Mail, minPlan: "free", freeFallback: "" },
  { id: "text", label: "Text only", icon: MessageSquare, minPlan: "premium", freeFallback: "You're on Free — email only available" },
  { id: "both", label: "Email + Text", icon: Bell, minPlan: "premium", freeFallback: "You're on Free — email only available" },
];

const FREQS: {
  id: Frequency; label: string; desc: string; bestFor: string;
  icon: typeof Zap; minPlan: Plan; recommended?: boolean; freeFallback?: string;
}[] = [
  { id: "maximum", label: "Maximum", desc: "Every match, the moment it's listed.", bestFor: "Best for fast markets, urgent moves", icon: Zap, minPlan: "premium", freeFallback: "You're on Free — alerts arrive ~3h later" },
  { id: "balanced", label: "Balanced", desc: "Top matches, 2–3 times a day.", bestFor: "Best for most renters", icon: CalendarDays, minPlan: "free", recommended: true },
  { id: "minimal", label: "Minimal", desc: "Once daily — only strong matches.", bestFor: "Best for browse mode, exploring", icon: CalendarRange, minPlan: "free" },
  { id: "weekly", label: "Weekly digest", desc: "One curated email each week.", bestFor: "Best for casual interest", icon: Sparkles, minPlan: "free" },
];

const emailSchema = z.string().trim().max(255).email();
const phoneSchema = z.string().trim().max(20).refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone");

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

function formatTimeLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr ?? "0");
  if (Number.isNaN(h)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function NotificationsTab() {
  const { alertChannel, frequency, email, phone, set } = useOnboardingStore();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const activeSearchId = useAppStore((s) => s.activeSearchId);
  const activeSearch = useAppStore((s) => s.searches.find((x) => x.id === s.activeSearchId));
  const { quietHours, perSearch, setQuiet, setPerSearch } = usePreferencesStore();

  const [emailOverrideOn, setEmailOverrideOn] = useState(false);
  const [phoneOverrideOn, setPhoneOverrideOn] = useState(false);
  const [overrideEmail, setOverrideEmail] = useState<string>("");
  const [overridePhone, setOverridePhone] = useState<string>("");
  const [overrideEmailTouched, setOverrideEmailTouched] = useState(false);
  const [overridePhoneTouched, setOverridePhoneTouched] = useState(false);

  const needsEmail = alertChannel === "email" || alertChannel === "both";
  const needsPhone = alertChannel === "text" || alertChannel === "both";

  const overrideEmailErr = emailOverrideOn && overrideEmail
    ? (emailSchema.safeParse(overrideEmail).success ? null : "Enter a valid email.")
    : null;
  const overridePhoneErr = phoneOverrideOn && overridePhone
    ? (phoneSchema.safeParse(overridePhone).success ? null : "Enter a valid phone number.")
    : null;

  const pill = PLAN_PILL[plan] ?? PLAN_PILL.free;
  const userRank = PLAN_RANK[plan];
  const searchName = activeSearch?.name ?? "this search";

  const tz = useMemo(() => detectTimezone(), []);

  const override = activeSearchId
    ? perSearch[activeSearchId] ?? { emailOverride: null, phoneOverride: null }
    : { emailOverride: null, phoneOverride: null };

  const commitEmailOverride = (next: string | null) => {
    if (activeSearchId) setPerSearch(activeSearchId, { emailOverride: next });
  };
  const commitPhoneOverride = (next: string | null) => {
    if (activeSearchId) setPerSearch(activeSearchId, { phoneOverride: next });
  };

  const handleEmailOverrideToggle = (on: boolean) => {
    if (!on && (override.emailOverride || overrideEmail)) {
      const ok = window.confirm(
        "Discard override email? Future alerts will go to your main email.",
      );
      if (!ok) return;
    }
    setEmailOverrideOn(on);
    if (on) {
      setOverrideEmail(override.emailOverride ?? "");
    } else {
      setOverrideEmail("");
      commitEmailOverride(null);
    }
  };

  const handlePhoneOverrideToggle = (on: boolean) => {
    if (!on && (override.phoneOverride || overridePhone)) {
      const ok = window.confirm(
        "Discard override phone? Future alerts will go to your main phone.",
      );
      if (!ok) return;
    }
    setPhoneOverrideOn(on);
    if (on) {
      setOverridePhone(override.phoneOverride ?? "");
    } else {
      setOverridePhone("");
      commitPhoneOverride(null);
    }
  };

  return (
    <div className="space-y-10 pb-32">
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

      {/* Scope banner — one place, not repeated per section */}
      {activeSearchId && (
        <div className="flex items-start gap-3 px-5 py-3 rounded-card bg-sage-100/60 border border-sage-200/70">
          <Info className="h-4 w-4 text-sage-800 mt-0.5 shrink-0" />
          <p className="text-xs text-charcoal-700 leading-relaxed">
            Editing <span className="font-semibold text-charcoal-950">{searchName}</span>
            <span className="text-charcoal-500"> · Settings here apply only to this search.</span>
          </p>
        </div>
      )}

      {/* Channel */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal-950">Alert channel</h3>
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
                title={locked ? "Upgrade to unlock →" : undefined}
                className={cn(
                  "relative p-4 rounded-card border-2 text-left transition-colors flex flex-col gap-2",
                  locked
                    ? "border-border bg-paper-warm/40 cursor-not-allowed"
                    : selected
                      ? "border-charcoal-950 bg-surface-elevated"
                      : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", selected && !locked ? "text-sage-700" : "text-charcoal-400")} />
                  <span className="text-sm font-semibold text-charcoal-950">{c.label}</span>
                  {locked && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
                      <Lock className="h-3 w-3" /> Premium
                    </span>
                  )}
                </div>
                {locked && plan === "free" && c.freeFallback && (
                  <p className="text-[12px] italic text-charcoal-500 leading-snug">{c.freeFallback}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Email — read-only display + override toggle */}
        {needsEmail && (
          <div className="space-y-3 pt-2">
            <div className="rounded-card border border-charcoal-950/8 bg-surface-elevated px-5 py-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                  Email address
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage-700">
                  <Check className="h-3 w-3" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-charcoal-950 truncate">
                  {email || "Not set"}
                </span>
                <Link
                  to="/preferences/account"
                  className="text-xs font-semibold text-sage-800 hover:text-sage-900 whitespace-nowrap inline-flex items-center gap-1"
                >
                  Change in Account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="rounded-card border border-charcoal-950/8 bg-surface-elevated px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-charcoal-800">
                  Use a different email for this search only
                </span>
                <ToggleSwitch
                  checked={emailOverrideOn || !!override.emailOverride}
                  onChange={handleEmailOverrideToggle}
                />
              </div>
              {(emailOverrideOn || override.emailOverride) && (
                <div className="mt-4 space-y-2">
                  <label htmlFor="ovr-email" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                    Override email for this search
                  </label>
                  <input
                    id="ovr-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={overrideEmail || override.emailOverride || ""}
                    onChange={(e) => {
                      setOverrideEmail(e.target.value);
                      commitEmailOverride(e.target.value || null);
                    }}
                    onBlur={() => setOverrideEmailTouched(true)}
                    placeholder="alerts@example.com"
                    aria-invalid={!!(overrideEmailTouched && overrideEmailErr)}
                    className={cn(
                      "w-full h-11 px-4 rounded-md bg-paper border focus:outline-none text-sm font-medium",
                      overrideEmailTouched && overrideEmailErr
                        ? "border-danger focus:border-danger"
                        : "border-border focus:border-charcoal-950",
                    )}
                  />
                  {overrideEmailTouched && overrideEmailErr ? (
                    <p className="text-xs text-danger inline-flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {overrideEmailErr}
                    </p>
                  ) : (
                    <p className="text-[11px] text-charcoal-500">
                      We'll only send <span className="font-medium text-charcoal-700">{searchName}</span> alerts here. Other searches keep your main email.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phone — same pattern */}
        {needsPhone && (
          <div className="space-y-3 pt-2">
            <div className="rounded-card border border-charcoal-950/8 bg-surface-elevated px-5 py-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                  Phone number
                </span>
                {phone && phoneSchema.safeParse(phone).success && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage-700">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-charcoal-950 truncate">
                  {phone || "Not set"}
                </span>
                <Link
                  to="/preferences/account"
                  className="text-xs font-semibold text-sage-800 hover:text-sage-900 whitespace-nowrap inline-flex items-center gap-1"
                >
                  Change in Account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="rounded-card border border-charcoal-950/8 bg-surface-elevated px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-charcoal-800">
                  Use a different phone for this search only
                </span>
                <ToggleSwitch
                  checked={phoneOverrideOn || !!override.phoneOverride}
                  onChange={handlePhoneOverrideToggle}
                />
              </div>
              {(phoneOverrideOn || override.phoneOverride) && (
                <div className="mt-4 space-y-2">
                  <label htmlFor="ovr-phone" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                    Override phone for this search
                  </label>
                  <input
                    id="ovr-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={overridePhone || override.phoneOverride || ""}
                    onChange={(e) => {
                      const v = formatPhone(e.target.value);
                      setOverridePhone(v);
                      commitPhoneOverride(v || null);
                    }}
                    onBlur={() => setOverridePhoneTouched(true)}
                    placeholder="(555) 123-4567"
                    aria-invalid={!!(overridePhoneTouched && overridePhoneErr)}
                    className={cn(
                      "w-full h-11 px-4 rounded-md bg-paper border focus:outline-none text-sm font-medium",
                      overridePhoneTouched && overridePhoneErr
                        ? "border-danger focus:border-danger"
                        : "border-border focus:border-charcoal-950",
                    )}
                  />
                  {overridePhoneTouched && overridePhoneErr ? (
                    <p className="text-xs text-danger inline-flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {overridePhoneErr}
                    </p>
                  ) : (
                    <p className="text-[11px] text-charcoal-500">
                      We'll only send <span className="font-medium text-charcoal-700">{searchName}</span> texts here. Other searches keep your main phone.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Frequency */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal-950">Frequency</h3>
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
                title={locked ? "Upgrade to unlock →" : undefined}
                className={cn(
                  "relative p-4 rounded-card border-2 text-left transition-colors flex items-start gap-3 min-h-[110px]",
                  locked
                    ? "border-border bg-paper-warm/40 cursor-not-allowed"
                    : selected
                      ? "border-charcoal-950 bg-surface-elevated"
                      : "border-border bg-transparent hover:border-charcoal-400",
                )}
              >
                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", selected && !locked ? "text-sage-700" : "text-charcoal-400")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-charcoal-950">{f.label}</span>
                    {f.recommended && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-sage-700 text-paper text-[10px] font-semibold uppercase tracking-[0.08em]">
                        Recommended
                      </span>
                    )}
                    {locked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
                        <Lock className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-charcoal-600 mt-1">{f.desc}</div>
                  {locked && plan === "free" && f.freeFallback ? (
                    <p className="text-[12px] italic text-charcoal-500 leading-snug mt-2">{f.freeFallback}</p>
                  ) : (
                    <p className="text-[12px] italic text-sage-700/90 mt-2">{f.bestFor}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quiet hours */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-charcoal-950 flex items-center gap-2">
              <Moon className="h-4 w-4 text-charcoal-500" /> Quiet hours
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
              Pause alerts during{" "}
              <span className="font-medium text-charcoal-700">
                {formatTimeLabel(quietHours.start)} – {formatTimeLabel(quietHours.end)}
              </span>{" "}
              <span className="text-charcoal-500">({tz}).</span>
              <br />
              <span className="text-charcoal-500">Applies to all searches.</span>
            </p>
          </div>
          <ToggleSwitch
            checked={quietHours.enabled}
            onChange={(v) => setQuiet("enabled", v)}
          />
        </div>
        {quietHours.enabled && (
          <div className="grid sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <label htmlFor="quiet-start" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Quiet hours start
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
                Quiet hours end
              </label>
              <input
                id="quiet-end"
                type="time"
                value={quietHours.end}
                onChange={(e) => setQuiet("end", e.target.value)}
                className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Timezone
              </label>
              <div className="w-full h-11 px-4 rounded-md bg-paper-warm/60 border border-border text-sm font-medium text-charcoal-700 flex items-center justify-between">
                <span>{tz}</span>
                <span className="text-[11px] text-charcoal-500">detected from your browser</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <StickySaveBar
        state={{
          alertChannel, frequency, email, phone,
          quietHours,
          override: activeSearchId ? override : null,
        }}
        successMessage={activeSearchId ? `Settings saved · Applied to ${searchName}` : "Settings saved"}
        getChanges={(b, c) => {
          const out: string[] = [];
          if (b.alertChannel !== c.alertChannel) out.push("alert channel");
          if (b.frequency !== c.frequency) out.push("frequency");
          if (b.email !== c.email) out.push("email");
          if (b.phone !== c.phone) out.push("phone");
          if (JSON.stringify(b.quietHours) !== JSON.stringify(c.quietHours)) out.push("quiet hours");
          if (JSON.stringify(b.override) !== JSON.stringify(c.override)) out.push("per-search override");
          return out;
        }}
        onDiscard={(snap) => {
          set("alertChannel", snap.alertChannel);
          set("frequency", snap.frequency);
          set("email", snap.email);
          set("phone", snap.phone);
          setQuiet("enabled", snap.quietHours.enabled);
          setQuiet("start", snap.quietHours.start);
          setQuiet("end", snap.quietHours.end);
          if (activeSearchId && snap.override) {
            setPerSearch(activeSearchId, snap.override);
            setOverrideEmail(snap.override.emailOverride ?? "");
            setOverridePhone(snap.override.phoneOverride ?? "");
            setEmailOverrideOn(!!snap.override.emailOverride);
            setPhoneOverrideOn(!!snap.override.phoneOverride);
          }
        }}
      />
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors shrink-0",
        checked ? "bg-charcoal-950" : "bg-charcoal-300",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
