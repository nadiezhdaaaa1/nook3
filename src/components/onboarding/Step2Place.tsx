import { motion, useReducedMotion } from "framer-motion";
import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { useStepFlow, StepRedirect } from "@/components/onboarding/stepFlow";
import { OB_H1, OB_SUB, OB_H2, OB_STEP_VARIANTS, OB_SECTION_VARIANTS } from "@/components/onboarding/stepStyles";
import { PillGroup } from "@/components/onboarding/PillGroup";
import { RentProtectionPicker } from "@/components/onboarding/RentProtectionPicker";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getCity } from "@/data/cities";

const reduceMotion = (reduce: boolean | null) =>
  reduce
    ? ({ hidden: { opacity: 1 }, visible: { opacity: 1 } } as const)
    : null;

const BEDS = [
  { id: "studio", label: "Studio" },
  { id: "1br", label: "1 bed" },
  { id: "2br", label: "2 bed" },
  { id: "3br", label: "3 bed" },
  { id: "4br+", label: "4+ bed" },
];

const BATHS = [
  { id: "1ba", label: "1" },
  { id: "1.5ba", label: "1.5" },
  { id: "2ba", label: "2" },
  { id: "2.5ba", label: "2.5+" },
];

export function Step2Place() {
  const { goStep } = useStepFlow();
  const reduce = useReducedMotion();
  const stepVariants = reduceMotion(reduce) ?? OB_STEP_VARIANTS;
  const sectionVariants = reduceMotion(reduce) ?? OB_SECTION_VARIANTS;
  const {
    city, bedrooms, bathrooms, rentProtection, includeBrokerFee, neighborhoods,
    set, toggleBedroom,
  } = useOnboardingStore();
  const cityConfig = getCity(city);

  if (!cityConfig) {
    return <StepRedirect step={1} />;
  }

  const canContinue = bedrooms.length > 0;

  return (
    <motion.div className="space-y-12" variants={stepVariants} initial="hidden" animate="visible">
      <motion.header variants={sectionVariants}>
        <h1 className="font-display ob-h1" style={OB_H1}>
          What kind of place?
        </h1>
        <p style={OB_SUB}>Pick beds, baths, and your protection preferences.</p>
      </motion.header>

      <motion.section className="space-y-4" variants={sectionVariants}>
        <h2 className="font-display" style={OB_H2}>
          1. Bedrooms <span style={{ color: "#5a5a55", fontWeight: 400 }}>· pick any</span>
        </h2>
        <PillGroup
          options={BEDS}
          value={bedrooms}
          multi
          onChange={toggleBedroom}
          size="lg"
        />
      </motion.section>

      <motion.section className="space-y-4" variants={sectionVariants}>
        <h2 className="font-display" style={OB_H2}>
          2. Minimum bathrooms
        </h2>
        <PillGroup
          options={BATHS}
          value={bathrooms}
          onChange={(id) => set("bathrooms", id)}
          size="lg"
        />
      </motion.section>

      {cityConfig.rentProtection.enabled && (
        <motion.section className="space-y-4" variants={sectionVariants}>
          <RentProtectionPicker
            city={cityConfig}
            value={rentProtection}
            onChange={(v) => set("rentProtection", v)}
            neighborhoodCount={neighborhoods.length}
          />
        </motion.section>
      )}

      {cityConfig.brokerFeeDefault && (
        <motion.section variants={sectionVariants}>
          <label
            className="flex items-center cursor-pointer"
            style={{
              background: "#EAE0CD",
              border: "1px solid #B5AB98",
              borderRadius: 16,
              padding: "16px 20px",
              gap: 16,
            }}
          >
            <input
              type="checkbox"
              checked={includeBrokerFee}
              onChange={(e) => set("includeBrokerFee", e.target.checked)}
              className="ob-check ob-check--muted"
            />
            <div>
              <div style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#2b2521" }}>
                Include apartments with a broker fee
              </div>
              <div style={{ fontSize: 14, lineHeight: "24px", color: "#4a4a46" }}>
                {cityConfig.brokerFeeContext ??
                  `Broker fees in ${cityConfig.displayName} typically equal 12–15% of annual rent ($3,600–$8,000 on a $4k/mo unit).`}
              </div>
            </div>
          </label>
        </motion.section>
      )}

      <motion.div variants={sectionVariants} style={{ fontSize: 13, color: "#4A4A46", fontFamily: '"Google Sans Flex", sans-serif' }}>
        {cityConfig.buildingDataAvailable && cityConfig.buildingDataLabel
          ? `Nook checks ${cityConfig.buildingDataLabel} for every ${cityConfig.displayName} listing.`
          : "Nook checks 100+ sources for every listing."}
      </motion.div>

      <motion.div variants={sectionVariants}>
        <OnboardingFooter
          canContinue={canContinue}
          onBack={() => goStep(1)}
          onNext={() => {
            set("lastStep", 3);
            goStep(3);
          }}
        />
      </motion.div>
    </motion.div>
  );
}
