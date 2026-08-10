import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { SampleListingsMap } from "@/components/onboarding/SampleListingsMap";
import { PreviewListingCard } from "@/components/onboarding/PreviewListingCard";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";
import { OriginButton } from "@/components/ui/origin-button";
import {
  OB_SUB,
  OB_STEP_VARIANTS,
  OB_SECTION_VARIANTS,
} from "@/components/onboarding/stepStyles";

export const Route = createFileRoute("/onboarding/preview")({
  component: SamplePreview,
});

const PREVIEW_H1: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 28,
  lineHeight: "38.4px",
  letterSpacing: "-0.96px",
  color: "#241c12",
};

function SamplePreview() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { city, budget, neighborhoods } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openWrenId, setOpenWrenId] = useState<string | null>(null);

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

  const pins = useMemo(
    () =>
      matched
        .filter((l) => l.coords)
        .map((l) => ({ id: l.id, coords: l.coords!, rent: l.rent })),
    [matched],
  );

  const popupCard = activeListing ? (
    <PreviewListingCard
      listing={activeListing}
      popup
      selected
      onClose={() => setActiveId(null)}
      openId={openWrenId}
      setOpenId={setOpenWrenId}
    />
  ) : null;

  const variants = reduce ? undefined : OB_STEP_VARIANTS;
  const itemVariants = reduce ? undefined : OB_SECTION_VARIANTS;

  return (
    <div className="flex h-full min-h-[calc(100vh-96px)] flex-col md:flex-row" style={{ background: "#faf6ee" }}>
      {/* Map panel */}
      <aside
        aria-label="Map of sample matches"
        className="order-2 h-[320px] w-full shrink-0 p-6 md:order-2 md:h-full md:w-1/2 md:pl-0"
      >
        {cityConfig && (
          <SampleListingsMap
            city={cityConfig}
            listings={pins}
            activeId={activeId}
            hoveredId={hoveredId}
            onSelect={(id) => setActiveId(id)}
            card={popupCard}
            className="relative h-full w-full overflow-hidden rounded-[20px] border border-black/20 bg-[#f5f2ea]"
          />

        )}
      </aside>

      {/* Left column */}
      <motion.section
        aria-label="Sample matches"
        variants={variants}
        initial="hidden"
        animate="visible"
        className="order-3 w-full px-5 pb-8 pt-6 md:order-1 md:h-full md:w-1/2 md:overflow-y-auto md:px-10 md:py-6"
      >
        <div className="mx-auto flex max-w-[760px] flex-col">
          <motion.header variants={itemVariants}>
            <h1 className="font-display" style={PREVIEW_H1}>
              You'd have gotten{" "}
              <span className="text-brand-logo">{matched.length}</span> match
              {matched.length === 1 ? "" : "es"} in your area this past week.
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
              style={{ marginTop: 24 }}
              className="rounded-[16px] border border-black/[0.08] bg-white p-6 text-center"
            >
              <p className="text-sm text-charcoal-700">
                No sample matches in {cityConfig?.displayName ?? "your area"} for this budget.
              </p>
              <p className="mt-2 text-xs text-charcoal-500">
                Real listings hit your inbox the moment they appear — even when our sample pool is thin.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-3 min-[1200px]:grid-cols-2"
                style={{ marginTop: 24 }}
              >
                {matched.map((listing) => (
                  <PreviewListingCard
                    key={listing.id}
                    listing={listing}
                    selected={listing.id === activeId}
                    onSelect={() => setActiveId(listing.id)}
                    onHover={setHoveredId}
                    openId={openWrenId}
                    setOpenId={setOpenWrenId}
                  />

                ))}
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-xs uppercase tracking-[0.16em] text-charcoal-500"
                style={{ marginTop: 24 }}
              >
                Sample preview · Real alerts after signup
              </motion.p>
            </>
          )}

          {cityConfig?.buildingDataSources && cityConfig.buildingDataSources.length > 0 && (
            <motion.div
              variants={itemVariants}
              style={{ marginTop: 24 }}
              className="flex gap-3 rounded-[16px] border border-black/[0.08] bg-white p-4"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-charcoal-500">
                  How we vet {cityConfig.displayName} listings
                </div>
                <p className="text-sm text-charcoal-700">
                  Every match is cross-checked against {cityConfig.buildingDataSources.join(", ")} records before it reaches your inbox.
                </p>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="w-full" style={{ marginTop: 24 }}>
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
        </div>
      </motion.section>
    </div>
  );
}
