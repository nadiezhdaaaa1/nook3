import type React from "react";
import { Variants } from "framer-motion";

export const OB_EASE = [0.22, 1, 0.36, 1] as const;

export const OB_STEP_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const OB_SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: OB_EASE },
  },
};
export const OB_H1: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 32,
  lineHeight: 1.2,
  letterSpacing: "-0.96px",
  color: "#241c12",
};

export const OB_SUB: React.CSSProperties = {
  marginTop: 8,
  fontSize: 16,
  lineHeight: "24px",
  color: "#5a5a55",
};

export const OB_H2: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 18,
  lineHeight: "28px",
  letterSpacing: "-0.27px",
  color: "#241c12",
};

/** Chip geometry shared with the Step 1 "Move-in date" options. */
export const OB_CHIP_CLASS = "h-[54px] px-6 text-[16px]";
