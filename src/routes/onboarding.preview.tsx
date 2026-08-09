import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, TrendingDown, Shield, Sparkles, ShieldCheck, ArrowRight, X, ChevronDown, ChevronUp } from "lucide-react";
import { SampleListingsMap } from "@/components/onboarding/SampleListingsMap";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";
import { OriginButton } from "@/components/ui/origin-button";
import {
  OB_H1,
  OB_SUB,
  OB_STEP_VARIANTS,
  OB_SECTION_VARIANTS,
} from "@/components/onboarding/stepStyles";

export const Route = createFileRoute("/onboarding/preview")({
  component: SamplePreview,
});

const HERO_CARD_STYLE = {
  borderRadius: 24,
  border: "1px solid rgba(0,0,0,0.20)",
  background: "#ffffff",
  padding: 24,
  boxShadow: "0 16px 8px rgba(12,12,13,0.10), 0 4px 1px rgba(12,12,13,0.05)",
} as const;

function wrenTake(s: SampleListing) {
  // Deterministic per-listing pick from a themed pool.
  const hash = Array.from(s.id).reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = <T,>(arr: T[]) => arr[hash % arr.length];
  const hasRS = !!s.tag && /stab|rs|control/i.test(s.tag);
  const deeplyUnder = (s.belowMedianPct ?? 0) >= 15;
  const under = (s.belowMedianPct ?? 0) >= 10;
  const bedLabel = s.beds === 0 ? "studio" : `${s.beds}BR`;

  if (deeplyUnder) {
    return pick([
      `${s.belowMedianPct}% under median for ${s.neighborhood} ${bedLabel}s — this gets ~40 inquiries by tonight. Apply today, not tomorrow.`,
      `Priced like 2022. Owner likely wants a fast close — go in pre-approved with one month + deposit ready.`,
      `Outlier on price for the block. Either it just hit or the broker mistyped — either way, first qualified app usually wins.`,
    ]);
  }
  if (hasRS) {
    return pick([
      `Rent-protected unit. Your rent here in 2030 is mostly already decided — worth touring even if the layout is mid.`,
      `${s.tag} status means renewal increases are capped by law. Long-term math beats a shinier non-stabilized listing.`,
      `Stabilized buildings rarely list publicly. If the tour goes well, don't sleep on it for a "maybe better" option.`,
    ]);
  }
  if (under) {
    return pick([
      `Roughly ${s.belowMedianPct}% below the ${s.neighborhood} median — fair, not insane. Tour by the weekend.`,
      `Reasonable for ${s.neighborhood}. Check the F-line/L-train walk on a weekday morning before signing.`,
      `Solid price. Ask the broker what's been renovated in the last 12 months and how long the last tenant stayed.`,
    ]);
  }
  if (s.rent >= 4000) {
    return pick([
      `At this price you should negotiate — 1 month free or broker fee covered is on the table for ${s.neighborhood} right now.`,
      `Premium rent for ${s.neighborhood}. Worth it only if you confirm the building isn't on the open-violations list.`,
      `Top of your budget. Tour two cheaper ones first so you know what you're paying the premium for.`,
    ]);
  }
  return pick([
    `Average price for ${s.neighborhood}. Decision will come down to light, noise, and the actual commute — not the photos.`,
    `Fair listing. The ${bedLabel}s in this pocket move in under a week, so book a tour in the next 48h.`,
    `Nothing flashy, but the fundamentals check out. Bring your application docs to the showing.`,
  ]);
}
type CityConfig = ReturnType<typeof getCity>;

function ListingCard({
  listing,
  cityConfig,
  onClose,
}: {
  listing: SampleListing;
  cityConfig: CityConfig;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      key={listing.id}
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-[320px] max-w-[calc(100%-32px)]"
      style={HERO_CARD_STYLE}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2
            className="font-sans text-base font-semibold leading-tight tracking-tight text-[#000000]"
            style={{ letterSpacing: "-0.42px" }}
          >
            {listing.address}
          </h2>
          <p className="mt-1 text-sm text-black/70 inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {listing.neighborhood}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close listing"
        >
          <X className="h-4 w-4 text-black/60" />
        </button>
      </div>

      <div className="mt-3 flex items-baseline gap-3 flex-wrap">
        <span className="font-display text-2xl font-medium text-[#000000] tabular-nums leading-none tracking-tight">
          ${listing.rent.toLocaleString()}
          <span className="text-lg font-medium text-black/60">/mo</span>
        </span>
        {listing.belowMedianPct && (
          <span className="inline-flex items-center gap-1 text-xs text-sage-700 font-semibold">
            <TrendingDown className="h-3 w-3" /> {listing.belowMedianPct}% below median
          </span>
        )}
      </div>

      <div className="mt-2 text-sm text-charcoal-700">
        {listing.beds === 0 ? "Studio" : `${listing.beds} bed`} · {listing.baths} bath
      </div>

      {listing.tag && (
        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-paper/95 backdrop-blur text-[10px] font-mono uppercase tracking-[0.16em] text-sage-800 border border-border">
          <Shield className="h-3 w-3" /> {listing.tag}
        </div>
      )}

      {listing.buildingNote && cityConfig?.buildingDataAvailable && (
        <div className="mt-2 text-[10px] font-mono text-charcoal-500 uppercase tracking-wider">
          {listing.buildingNote}
        </div>
      )}

      <div className="mt-3 p-3 rounded-md bg-sage-100/70 border border-sage-300/40">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-sage-700 shrink-0" />
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-sage-800 font-semibold">
              Wren's take
            </div>
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-sage-700 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-sage-700 shrink-0" />
          )}
        </button>
        {open && (
          <p className="mt-2 text-xs text-charcoal-800 leading-relaxed">
            {wrenTake(listing)}
          </p>
        )}
      </div>
    </motion.article>
  );
}


function SamplePreview() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { city, budget, neighborhoods } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [activeId, setActiveId] = useState<string | null>(null);

  const allListings: SampleListing[] = useMemo(
    () => (city && SAMPLE_LISTINGS[city]) || [],
    [city],
  );

  // Filter by budget range; if no neighborhoods picked, ignore the area filter.
  const matched = useMemo(() => {
    let pool = allListings;
    if (budget) {
      const [lo, hi] = budget;
      pool = pool.filter((l) => l.rent >= lo * 0.85 && l.rent <= hi);
    }
    if (neighborhoods.length > 0) {
      const wanted = pool.filter((l) => neighborhoods.includes(l.neighborhood));
      if (wanted.length > 0) pool = wanted;
    }
    return pool.sort((a, b) => a.rent - b.rent);
  }, [allListings, budget, neighborhoods]);

  const activeListing = useMemo(
    () => matched.find((s) => s.id === activeId) || null,
    [matched, activeId],
  );

  const card = useMemo(() => {
    if (!activeListing) return null;
    return (
      <motion.article
        key={activeListing.id}
        initial={{ opacity: 0, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-[320px] max-w-[calc(100%-32px)]"
        style={HERO_CARD_STYLE}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2
              className="font-sans text-base font-semibold leading-tight tracking-tight text-[#000000]"
              style={{ letterSpacing: "-0.42px" }}
            >
              {activeListing.address}
            </h2>
            <p className="mt-1 text-sm text-black/70 inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {activeListing.neighborhood}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close listing"
          >
            <X className="h-4 w-4 text-black/60" />
          </button>
        </div>

        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <span className="font-display text-2xl font-medium text-[#000000] tabular-nums leading-none tracking-tight">
            ${activeListing.rent.toLocaleString()}
            <span className="text-lg font-medium text-black/60">/mo</span>
          </span>
          {activeListing.belowMedianPct && (
            <span className="inline-flex items-center gap-1 text-xs text-sage-700 font-semibold">
              <TrendingDown className="h-3 w-3" /> {activeListing.belowMedianPct}% below median
            </span>
          )}
        </div>

        <div className="mt-2 text-sm text-charcoal-700">
          {activeListing.beds === 0 ? "Studio" : `${activeListing.beds} bed`} · {activeListing.baths} bath
        </div>

        {activeListing.tag && (
          <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-paper/95 backdrop-blur text-[10px] font-mono uppercase tracking-[0.16em] text-sage-800 border border-border">
            <Shield className="h-3 w-3" /> {activeListing.tag}
          </div>
        )}

        {activeListing.buildingNote && cityConfig?.buildingDataAvailable && (
          <div className="mt-2 text-[10px] font-mono text-charcoal-500 uppercase tracking-wider">
            {activeListing.buildingNote}
          </div>
        )}

        <div className="mt-3 p-3 rounded-md bg-sage-100/70 border border-sage-300/40">
          <div className="flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-sage-700 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-sage-800 font-semibold mb-1">
                Wren's take
              </div>
              <p className="text-xs text-charcoal-800 leading-relaxed">
                {wrenTake(activeListing)}
              </p>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }, [activeListing]);

  const pins = useMemo(
    () => matched.filter((l) => l.coords).map((l) => ({ id: l.id, coords: l.coords!, rent: l.rent })),
    [matched],
  );


  const variants = reduce ? undefined : OB_STEP_VARIANTS;
  const itemVariants = reduce ? undefined : OB_SECTION_VARIANTS;

  return (
    <motion.div
      className="space-y-8"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants}>
        <h1 className="font-display ob-h1" style={OB_H1}>
          You'd have gotten <span className="text-brand-logo">{matched.length}</span> match{matched.length === 1 ? "" : "es"} in your area this past week.
        </h1>
        <p style={OB_SUB}>
          {budget
            ? `Within $${budget[0].toLocaleString()}–$${budget[1].toLocaleString()}/mo. `
            : "Here's what they looked like. "}
          We'll send these straight to your inbox.
        </p>
      </motion.header>

      {matched.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-card bg-surface-elevated border border-border text-center space-y-2"
        >
          <p className="text-sm text-charcoal-700">
            No sample matches in {cityConfig?.displayName ?? "your area"} for this budget.
          </p>
          <p className="text-xs text-charcoal-500">
            Real listings hit your inbox the moment they appear — even when our sample pool is thin.
          </p>
        </motion.div>
      ) : (
        <>
          {cityConfig && pins.length > 0 && (
            <motion.div variants={itemVariants} className="relative">
              <SampleListingsMap
                city={cityConfig}
                listings={pins}
                activeId={activeId}
                onSelect={(id) => setActiveId(id)}
                card={card}
              />
            </motion.div>
          )}

          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-charcoal-500 font-mono uppercase tracking-[0.16em] mt-6"
          >
            Sample preview · Real alerts after signup
          </motion.p>
        </>
      )}

      {cityConfig?.buildingDataSources && cityConfig.buildingDataSources.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="rounded-card border border-border bg-surface-elevated p-4 flex gap-3"
        >
          <ShieldCheck className="h-4 w-4 text-sage-700 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
              How we vet {cityConfig.displayName} listings
            </div>
            <p className="text-sm text-charcoal-700">
              Every match is cross-checked against {cityConfig.buildingDataSources.join(", ")} records before it reaches your inbox.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="w-full pt-2">
        <OriginButton
          type="button"
          variant="main"
          size="big"
          className="w-full"
          onClick={() => navigate({ to: "/onboarding/pricing" })}
        >
          See my plan options <ArrowRight style={{ width: 16, height: 16 }} />
        </OriginButton>
      </motion.div>
    </motion.div>
  );
}
