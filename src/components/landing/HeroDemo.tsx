import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bed, MapPin, TrendingDown, Mail } from "lucide-react";
import { z } from "zod";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { CitySwitcher } from "@/components/landing/CitySwitcher";
import { useLandingStore } from "@/lib/landing/landingStore";
import { useDetectedCity } from "@/lib/landing/useDetectedCity";
import { getCity } from "@/data/cities";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const emailSchema = z.string().trim().email().max(255);

const BEDS = [
  { id: "studio", label: "Studio", n: 0 },
  { id: "1br", label: "1 BR", n: 1 },
  { id: "2br", label: "2 BR", n: 2 },
  { id: "3br", label: "3 BR", n: 3 },
] as const;

function formatAgo(seconds: number): string {
  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  return `${Math.floor(seconds / 3600)} hr ago`;
}

export function HeroDemo() {
  useDetectedCity();
  const navigate = useNavigate();
  const { city, budget, beds, setBudget, setBeds } = useLandingStore();
  const cityConfig = getCity(city)!;
  const setOnboarding = useOnboardingStore((s) => s.set);
  const patch = useOnboardingStore((s) => s.patch);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // live "ago" tick
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Clamp budget to city range when city changes
  useEffect(() => {
    if (budget < cityConfig.budget.min || budget > cityConfig.budget.max) {
      setBudget(cityConfig.budget.default);
    }
  }, [cityConfig, budget, setBudget]);

  const targetBeds = BEDS.find((b) => b.id === beds)?.n ?? 1;

  // Filter sample listings to match form state
  const mockListings: SampleListing[] = useMemo(() => {
    const all = SAMPLE_LISTINGS[city] ?? [];
    const matching = all.filter((l) => l.beds === targetBeds && l.rent <= budget);
    const fallback = all.filter((l) => l.rent <= budget);
    const pool = matching.length >= 3 ? matching : matching.concat(fallback).filter((v, i, a) => a.indexOf(v) === i);
    return pool.slice(0, 3);
  }, [city, targetBeds, budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError("Enter a valid email.");
      return;
    }
    setEmailError(null);
    // Pre-fill onboarding store and skip Step 1 (city + budget already collected)
    patch({
      city,
      budget: [Math.round(budget * 0.5), budget],
      bedrooms: [beds],
      email,
    });
    setOnboarding("lastStep", 2);
    navigate({ to: "/onboarding/step/$step", params: { step: "2" } });
  };

  const sliderPct = ((budget - cityConfig.budget.min) / (cityConfig.budget.max - cityConfig.budget.min)) * 100;

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 pattern-dots pattern-fade-mask opacity-70 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-12 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-12 items-start">
          {/* LEFT — text + form */}
          <div>
            <Eyebrow>Real-time apartment alerts</Eyebrow>

            <motion.h1
              key={city}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display font-bold text-[44px] sm:text-[56px] lg:text-[72px] leading-[0.95] tracking-[-0.025em] text-charcoal-950 mt-6"
            >
              Be first to every apartment in{" "}
              <span className="accent-italic">{cityConfig.displayName}</span>.
            </motion.h1>

            <p className="mt-6 text-base lg:text-lg text-charcoal-600 max-w-xl leading-relaxed">
              Real-time alerts for rent-stabilized and market-rate listings. We watch{" "}
              {cityConfig.buildingDataSources?.length ? "100+" : "100+"} sources so you don't have to.
            </p>

            {/* Demo form */}
            <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                  Show me apartments in
                </label>
                <CitySwitcher variant="form" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                    Budget up to
                  </label>
                  <span className="font-display text-sm font-bold tabular-nums text-charcoal-950">
                    ${budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={cityConfig.budget.min}
                  max={cityConfig.budget.max}
                  step={cityConfig.budget.step}
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                  className="w-full accent-charcoal-950"
                  aria-label="Budget"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--charcoal-950)) 0%, hsl(var(--charcoal-950)) ${sliderPct}%, hsl(var(--border)) ${sliderPct}%, hsl(var(--border)) 100%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] font-mono text-charcoal-400">
                  <span>${cityConfig.budget.min.toLocaleString()}</span>
                  <span>${cityConfig.budget.max.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                  Bedrooms
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BEDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBeds(b.id)}
                      className={cn(
                        "h-11 rounded-pill border text-sm font-semibold transition-colors",
                        beds === b.id
                          ? "border-charcoal-950 bg-charcoal-950 text-paper"
                          : "border-charcoal-200 text-charcoal-700 hover:border-charcoal-950",
                      )}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="your.email@example.com"
                    className={cn(
                      "w-full h-12 pl-11 pr-4 rounded-md bg-surface-elevated border text-sm focus:outline-none",
                      emailError ? "border-danger" : "border-border focus:border-charcoal-950",
                    )}
                  />
                </div>
                {emailError && <p className="text-xs text-danger">{emailError}</p>}
              </div>

              <button
                type="submit"
                className="group w-full h-12 inline-flex items-center justify-center gap-2 px-6 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors"
              >
                Get free alerts
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="text-center text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-500">
                Free forever · Premium $14.99/mo · 3-day trial · No credit card
              </div>
            </form>

            <p className="mt-6 text-xs text-charcoal-500">
              Join <span className="font-semibold text-charcoal-700 tabular-nums">52,341</span> renters · No credit card required
            </p>
          </div>

          {/* RIGHT — phone mockup */}
          <PhoneMockup listings={mockListings} cityName={cityConfig.displayName} tick={tick} />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup({
  listings,
  cityName,
  tick,
}: {
  listings: SampleListing[];
  cityName: string;
  tick: number;
}) {
  const baseTimes = [12, 240, 660]; // seconds ago for each card

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:ml-auto"
    >
      {/* Phone frame */}
      <div className="relative bg-charcoal-950 rounded-[40px] p-3 shadow-elevated">
        <div className="bg-paper rounded-[32px] overflow-hidden">
          {/* Status bar */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between text-[10px] font-mono text-charcoal-700">
            <span>9:42</span>
            <span className="font-bold">Nook</span>
            <span>●●●</span>
          </div>

          {/* Live indicator */}
          <div className="px-5 pb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-peach-700 border-b border-border">
            <span className="relative h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-pill bg-peach-500 animate-ping opacity-75" />
              <span className="relative block h-1.5 w-1.5 rounded-pill bg-peach-500" />
            </span>
            LIVE · {cityName}
          </div>

          {/* Alert list */}
          <div className="divide-y divide-border max-h-[460px] overflow-hidden">
            {listings.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-500">
                No matches at this budget yet — try raising it.
              </div>
            ) : (
              listings.map((l, i) => (
                <motion.div
                  key={`${l.id}-${i}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.18em]">
                    {i === 0 ? (
                      <span className="text-peach-700 font-semibold">NEW · {formatAgo(baseTimes[i] + tick)}</span>
                    ) : (
                      <span className="text-charcoal-500">{formatAgo(baseTimes[i] + tick)}</span>
                    )}
                    {l.tag && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-tight bg-sage-100 text-sage-800 text-[8px]">
                        {l.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] font-semibold text-charcoal-950 leading-snug">
                    {l.address}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-charcoal-500">
                    <MapPin className="h-2.5 w-2.5" /> {l.neighborhood}
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div className="font-display text-base font-bold text-charcoal-950 tabular-nums">
                      ${l.rent.toLocaleString()}
                      <span className="text-[10px] font-normal text-charcoal-500">/mo</span>
                    </div>
                    {l.belowMedianPct && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-sage-700 font-semibold">
                        <TrendingDown className="h-2.5 w-2.5" /> {l.belowMedianPct}% below
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-charcoal-500 inline-flex items-center gap-2">
                    <Bed className="h-2.5 w-2.5" />
                    {l.beds === 0 ? "Studio" : `${l.beds} BR`} · {l.baths} BA
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
