export type CityId =
  | "nyc"
  | "la"
  | "sf-bay"
  | "chicago"
  | "dc"
  | "boston"
  | "seattle"
  | "miami"
  | "austin"
  | "philadelphia";

export interface TransitLine {
  id: string;
  label: string;
  color: string;
  servesNeighborhoods: string[];
}

export interface RentProtectionOption {
  id: "all" | "likely" | "verified";
  title: string;
  description: string;
}

export interface CityConfig {
  id: CityId;
  name: string;
  displayName: string;
  state: string;
  iconEmoji?: string;
  /** Inline SVG string, 24x24, single-color (uses currentColor). Optional — fallback to lucide Building icon. */
  iconSvg?: string;
  budget: {
    min: number;
    max: number;
    default: number;
    median1BR: number;
    step: number;
  };
  rentProtection: {
    enabled: boolean;
    label?: string;
    /** Long-form tooltip copy (legacy). */
    tooltip?: string;
    /** Short educational intro shown above the cards (Block 3). */
    tooltipShort?: string;
    /** Baseline weekly match count for "Show all" — scaled by neighborhood breadth. */
    matchBaseline?: number;
    options?: RentProtectionOption[];
  };
  brokerFeeDefault: boolean;
  /** Helper copy shown beside the broker-fee toggle on Step 2. */
  brokerFeeContext?: string;
  neighborhoodGroups: Record<string, string[]>;
  transit: {
    type: "subway" | "metro" | "light-rail" | "mixed" | "limited";
    label: string;
    lines: TransitLine[];
  };
  buildingDataAvailable: boolean;
  buildingDataLabel?: string;
  buildingDataSources?: string[];
  /** Anchor copy on the pricing screen. */
  pricingAnchor?: string;
  /** Median hours between new listings — used for time-to-first-alert. */
  listingVelocityHours?: number;
  /** Typical per-application fee, in dollars (null when not applicable). */
  applicationFee?: number | null;
}

export const RENT_PROTECTION_OPTIONS: RentProtectionOption[] = [
  {
    id: "all",
    title: "Show all apartments",
    description: "Include non-protected units matching other criteria.",
  },
  {
    id: "likely",
    title: "Include likely protected",
    description: "Show verified and likely protected units based on building history.",
  },
  {
    id: "verified",
    title: "Verified protected only",
    description: "Only show units explicitly marked as protected.",
  },
];
