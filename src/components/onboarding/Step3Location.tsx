import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OB_H1, OB_SUB, OB_H2, OB_STEP_VARIANTS, OB_SECTION_VARIANTS } from "@/components/onboarding/stepStyles";
import { NeighborhoodPicker } from "@/components/onboarding/NeighborhoodPicker";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";

const reduceMotion = (reduce: boolean | null) =>
  reduce
    ? ({ hidden: { opacity: 1 }, visible: { opacity: 1 } } as const)
    : null;

export function Step3Location() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const stepVariants = reduceMotion(reduce) ?? OB_STEP_VARIANTS;
  const sectionVariants = reduceMotion(reduce) ?? OB_SECTION_VARIANTS;
  const { city, neighborhoods, budget, set, toggleNeighborhood } = useOnboardingStore();
  const cityConfig = getCity(city);
  const [query, setQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("map");
  const [quickPicksOpen, setQuickPicksOpen] = useState(false);

  const groups = useMemo(
    () => (cityConfig ? Object.entries(cityConfig.neighborhoodGroups) : []),
    [cityConfig],
  );

  const matchedByQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const all: { group: string; name: string }[] = [];
    for (const [g, items] of groups) {
      for (const n of items) {
        if (n.toLowerCase().includes(q)) all.push({ group: g, name: n });
      }
    }
    return all;
  }, [query, groups]);

  const allKnown = useMemo(() => {
    const s = new Set<string>();
    if (!cityConfig) return s;
    for (const items of Object.values(cityConfig.neighborhoodGroups)) {
      for (const n of items) s.add(n);
    }
    return s;
  }, [cityConfig]);
  const presets = useMemo(() => (cityConfig ? getCityPresets(cityConfig.id) : []), [cityConfig]);

  if (!cityConfig) {
    return <Navigate to="/onboarding/step/$step" params={{ step: "1" }} />;
  }

  const canContinue = neighborhoods.length > 0;
  const tooMany = neighborhoods.length >= 15;

  return (
    <motion.div className="space-y-10" variants={stepVariants} initial="hidden" animate="visible">
      <motion.header variants={sectionVariants}>
        <h1 className="font-display ob-h1" style={OB_H1}>
          Where specifically?
        </h1>
        <p style={OB_SUB}>
          Pick neighborhoods in {cityConfig.displayName}. Add as many as you want.
        </p>
      </motion.header>

      <NeighborhoodPicker cityConfig={cityConfig} />

      <motion.div variants={sectionVariants}>
        <OnboardingFooter
          canContinue={canContinue}
          onBack={() => navigate({ to: "/onboarding/step/$step", params: { step: "2" } })}
          onNext={() => {
            set("lastStep", 4);
            navigate({ to: "/onboarding/step/$step", params: { step: "4" } });
          }}
        />
      </motion.div>
    </motion.div>
  );
}
