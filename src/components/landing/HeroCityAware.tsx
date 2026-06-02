import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Bath, Ruler, ShieldCheck, Mail } from "lucide-react";
import { LandingCitySelector } from "./LandingCitySelector";
import { useLandingStore } from "@/lib/landing/landingStore";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { SAMPLE_LISTINGS } from "@/data/sampleListings";

export function HeroCityAware() {
  const navigate = useNavigate();
  const { city, budget } = useLandingStore();
  const setOnboarding = useOnboardingStore((s) => s.set);
  const storedEmail = useOnboardingStore((s) => s.email);
  const [email, setEmail] = useState(storedEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const cityConfig = getCity(city)!;
  const listing =
    (SAMPLE_LISTINGS[city] ?? []).find((l) => l.tag) ??
    (SAMPLE_LISTINGS[city] ?? [])[0];

  const lowEnd = Math.max(cityConfig.budget.min, Math.round(budget * 0.7) - 250);
  const highEnd = budget;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Enter a valid email");
      return;
    }
    setEmailError(null);
    setOnboarding("email", trimmed);
    navigate({ to: "/onboarding" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-brand-cream)" }}
    >
      <div className="absolute inset-0 pattern-dots pattern-fade-mask opacity-50 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-12 lg:pt-20 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div>
            <LandingCitySelector />

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display font-medium text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.02] tracking-[-0.025em] text-[var(--color-brand-charcoal)] mt-6"
            >
              Find it before it's gone.
              <span className="block italic font-normal text-[var(--color-brand-sage)] mt-2">
                Without losing your mind.
              </span>
            </motion.h1>

            <p className="mt-7 text-base lg:text-lg text-[var(--color-charcoal-700)] max-w-xl leading-relaxed">
              Nook watches the rental market 24/7 and pings you the moment a
              match appears. Verified, no spam.
            </p>

            <form onSubmit={handleStart} className="mt-9 max-w-md">
              <label htmlFor="hero-email" className="sr-only">Email</label>
              <div
                className="flex items-center gap-2 rounded-pill border bg-white pl-4 pr-1.5 py-1.5 transition-colors focus-within:border-[var(--color-brand-terracotta)]"
                style={{ borderColor: emailError ? "var(--color-brand-terracotta)" : "var(--color-brand-clay)" }}
              >
                <Mail className="h-4 w-4 text-[var(--color-charcoal-500)] shrink-0" />
                <input
                  id="hero-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none text-sm text-[var(--color-brand-charcoal)] placeholder:text-[var(--color-charcoal-500)] min-w-0"
                />
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-pill text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-elevated whitespace-nowrap"
                  style={{ backgroundColor: "var(--color-brand-terracotta)" }}
                >
                  Start free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              {emailError && (
                <p className="mt-2 text-xs text-[var(--color-brand-terracotta)] pl-4">{emailError}</p>
              )}
              <p className="mt-2 text-[13px] text-[var(--color-charcoal-600)] pl-4">
                3-day trial. Cancel anytime.
              </p>
            </form>
          </div>

          {/* RIGHT — preview card */}
          <HeroPreviewCard
            city={cityConfig.displayName}
            address={listing?.address ?? "245 Bedford Ave, Apt 3R"}
            neighborhood={
              listing?.neighborhood
                ? `${listing.neighborhood}, ${cityConfig.displayName}`
                : `${cityConfig.displayName}`
            }
            rent={listing?.rent ?? 2850}
            beds={listing?.beds ?? 2}
            baths={listing?.baths ?? 1}
            sqft={875}
            regulated={Boolean(listing?.tag)}
            budgetLow={lowEnd}
            budgetHigh={highEnd}
            regulationLabel={cityConfig.rentProtection?.label ?? "Rent-stabilized"}
          />
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  city: string;
  address: string;
  neighborhood: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  regulated: boolean;
  budgetLow: number;
  budgetHigh: number;
  regulationLabel: string;
}

function HeroPreviewCard(p: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[440px] mx-auto lg:ml-auto"
    >
      {/* Floating LIVE MATCH badge */}
      <div
        className="absolute -top-4 -right-2 z-10 inline-flex flex-col items-end gap-0.5 rounded-pill px-4 py-2 text-white shadow-elevated"
        style={{ backgroundColor: "var(--color-brand-terracotta)" }}
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] font-semibold">
          <span className="relative h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-pill bg-white animate-ping opacity-75" />
            <span className="relative block h-1.5 w-1.5 rounded-pill bg-white" />
          </span>
          Live match
        </span>
        <span className="text-[10px] opacity-80">Sent 2 min ago</span>
      </div>

      <div
        className="rounded-card border shadow-card p-6 lg:p-7"
        style={{
          backgroundColor: "var(--color-brand-soft)",
          borderColor: "var(--color-brand-clay)",
        }}
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-brand-terracotta)] font-semibold">
          New match · 2 min ago
        </div>

        <div className="mt-3 font-display text-2xl lg:text-[28px] leading-tight font-medium text-[var(--color-brand-charcoal)]">
          {p.address}
        </div>
        <div className="mt-1 text-sm text-[var(--color-charcoal-600)]">
          {p.neighborhood}
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <div className="font-display text-3xl font-bold tabular-nums text-[var(--color-brand-charcoal)]">
            ${p.rent.toLocaleString()}
            <span className="text-sm font-normal text-[var(--color-charcoal-500)]">/mo</span>
          </div>
          {p.regulated && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-[10px] font-mono uppercase tracking-[0.14em] font-semibold"
              style={{
                backgroundColor: "color-mix(in oklab, var(--color-brand-sage) 22%, transparent)",
                color: "var(--color-sage-900)",
              }}
            >
              <ShieldCheck className="h-3 w-3" />
              {p.regulationLabel}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-5 text-sm text-[var(--color-charcoal-700)]">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {p.beds} Bed{p.beds === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4" /> {p.baths} Bath
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-4 w-4" /> {p.sqft} ft²
          </span>
        </div>

        <div
          className="mt-6 pt-5 border-t"
          style={{ borderColor: "var(--color-brand-clay)" }}
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-charcoal-500)]">
            Match quality
          </div>
          <div className="mt-1 font-display text-lg font-medium text-[var(--color-brand-sage)]">
            Strong
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-charcoal-700)]">
            <li>· Within your budget (${p.budgetLow.toLocaleString()}–{p.budgetHigh.toLocaleString()})</li>
            <li>· Walk score 91</li>
            <li>· Pet-friendly ✓</li>
          </ul>
        </div>

        <button
          type="button"
          className="mt-6 w-full h-11 inline-flex items-center justify-center gap-2 rounded-pill text-sm font-semibold transition-colors hover:opacity-90"
          style={{
            backgroundColor: "var(--color-brand-charcoal)",
            color: "var(--color-brand-cream)",
          }}
        >
          View listing →
        </button>
      </div>
    </motion.div>
  );
}
