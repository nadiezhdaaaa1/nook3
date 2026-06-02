import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";
import { emailSchema } from "@/lib/validation/schemas";

function velocityCopy(hours: number | undefined): string {
  if (!hours) return "Expect your first match within a few days.";
  if (hours <= 6) return "New matches typically every few hours — fast market.";
  if (hours <= 24) return "Expect new matches roughly daily.";
  if (hours <= 72) return "Expect new matches every couple of days.";
  return "Listings are slower here — expect a few matches per week.";
}

export function Step5Alerts() {
  const navigate = useNavigate();
  const { email, city, set } = useOnboardingStore();
  const cityConfig = city ? getCity(city) : null;

  const [emailTouched, setEmailTouched] = useState(false);

  const emailResult = emailSchema.safeParse(email);
  const emailError = !emailResult.success ? emailResult.error.issues[0].message : null;

  const canContinue = !emailError;

  return (
    <div className="space-y-12">
      <header>
        <Eyebrow>Step 5 · Alert setup</Eyebrow>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          Where should we <span className="accent-italic">email you</span>?
        </h1>
        <p className="mt-4 text-base text-charcoal-600">
          We'll only ping when a listing matches your filters.
        </p>
      </header>

      <section className="space-y-2">
        <label htmlFor="alert-email" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 inline-flex items-center gap-1.5">
          <Mail className="h-3 w-3" /> Email address
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
          if (canContinue) navigate({ to: "/onboarding/loading" });
        }}
      />
    </div>
  );
}
