import * as React from "react";
import { OriginButton } from "@/components/ui/origin-button";
import { OB_CHIP_CLASS } from "@/components/onboarding/stepStyles";
import { cn } from "@/lib/utils";

interface ObChipProps
  extends Omit<React.ComponentProps<typeof OriginButton>, "variant"> {
  selected?: boolean;
  /** Visual style used when selected. */
  selectedVariant?: "dark" | "secondary";
  fullWidth?: boolean;
  size?: "big" | "medium";
}


/**
 * Option chip matching the Step 1 "Move-in date" options:
 * tertiary Origin button when idle, dark when selected.
 */
export function ObChip({
  selected = false,
  selectedVariant = "dark",
  fullWidth = false,
  size = "big",
  className,
  children,
  ...props
}: ObChipProps) {
  return (
    <OriginButton
      type="button"
      variant={selected ? selectedVariant : "tertiary"}
      size={size}
      aria-pressed={selected}
      className={cn(OB_CHIP_CLASS, fullWidth && "w-full justify-start text-left", className)}
      {...props}
    >
      {children}
    </OriginButton>
  );
}

