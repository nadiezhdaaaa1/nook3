import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, Clock, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useOnboardingStore, type AlertChannel } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

const CHANNELS: { id: AlertChannel; label: string; desc: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email only",   desc: "Daily digest in your inbox.",     icon: Mail },
  { id: "text",  label: "Text only",    desc: "Instant SMS for hot listings.",   icon: MessageSquare },
  { id: "both",  label: "Email + Text", desc: "Digest + instant pings.",         icon: Bell },
];

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(255, "Email is too long.")
  .email("Enter a valid email.");

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone is required.")
  .max(20, "Phone is too long.")
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid 10-digit phone number.");

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function velocityCopy(hours: number | undefined): string {
  if (!hours) return "Expect your first match within a few days.";
  if (hours <= 6) return "New matches typically every few hours — fast market.";
  if (hours <= 24) return "Expect new matches roughly daily.";
  if (hours <= 72) return "Expect new matches every couple of days.";
  return "Listings are slower here — expect a few matches per week.";
}

export function Step5Alerts() {
  const navigate = useNavigate();
  const { alertChannel, email, phone, city, set } = useOnboardingStore();
  const cityConfig = city ? getCity(city) : null;

  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const needsEmail = alertChannel === "email" || alertChannel === "both";
  const needsPhone = alertChannel === "text" || alertChannel === "both";

  const emailResult = needsEmail ? emailSchema.safeParse(email) : null;
  const phoneResult = needsPhone ? phoneSchema.safeParse(phone) : null;
  const emailError = emailResult && !emailResult.success ? emailResult.error.issues[0].message : null;
  const phoneError = phoneResult && !phoneResult.success ? phoneResult.error.issues[0].message : null;

  const canContinue = (!needsEmail || !emailError) && (!needsPhone || !phoneError);

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

      <section className="grid sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Alert channel">
        {CHANNELS.map((c) => {
          const selected = alertChannel === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={selected}
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
          <label htmlFor="alert-email" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
            Email address
          </label>
          <input
            id="alert-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            aria-invalid={!!(emailTouched && emailError)}
            aria-describedby={emailTouched && emailError ? "alert-email-error" : undefined}
            className={cn(
              "w-full h-12 px-4 rounded-md bg-surface-elevated border focus:outline-none text-sm font-medium",
              emailTouched && emailError
                ? "border-danger focus:border-danger"
                : "border-border focus:border-charcoal-950",
            )}
          />
          {emailTouched && emailError && (
            <p id="alert-email-error" className="text-xs text-danger">{emailError}</p>
          )}
        </section>
      )}

      {needsPhone && (
        <section className="space-y-2">
          <label htmlFor="alert-phone" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
            Phone number
          </label>
          <input
            id="alert-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => set("phone", formatPhone(e.target.value))}
            onBlur={() => setPhoneTouched(true)}
            placeholder="(555) 123-4567"
            aria-invalid={!!(phoneTouched && phoneError)}
            aria-describedby={phoneTouched && phoneError ? "alert-phone-error" : undefined}
            className={cn(
              "w-full h-12 px-4 rounded-md bg-surface-elevated border focus:outline-none text-sm font-medium",
              phoneTouched && phoneError
                ? "border-danger focus:border-danger"
                : "border-border focus:border-charcoal-950",
            )}
          />
          {phoneTouched && phoneError && (
            <p id="alert-phone-error" className="text-xs text-danger">{phoneError}</p>
          )}
          <p className="text-xs text-charcoal-500">
            Standard SMS rates may apply. Reply STOP to unsubscribe.
          </p>
        </section>
      )}

      {cityConfig && (
        <section className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-card border border-border bg-surface-elevated p-4 flex gap-3">
            <Clock className="h-4 w-4 text-sage-700 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                {cityConfig.displayName} pace
              </div>
              <p className="text-sm text-charcoal-700">{velocityCopy(cityConfig.listingVelocityHours)}</p>
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface-elevated p-4 flex gap-3">
            <ShieldCheck className="h-4 w-4 text-sage-700 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                No spam, ever
              </div>
              <p className="text-sm text-charcoal-700">
                You can tweak frequency or unsubscribe with one tap from any alert.
              </p>
            </div>
          </div>
        </section>
      )}

      <OnboardingFooter
        canContinue={canContinue}
        nextLabel="Find my apartments"
        onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "4" } })}
        onNext={() => {
          setEmailTouched(true);
          setPhoneTouched(true);
          if (canContinue) navigate({ to: "/onboarding/loading" });
        }}
      />
    </div>
  );
}
