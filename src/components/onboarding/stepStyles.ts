import type React from "react";

/** Shared typographic tokens so every onboarding step matches Step 1. */
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
