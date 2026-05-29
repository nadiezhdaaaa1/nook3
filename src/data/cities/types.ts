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
    tooltip?: string;
    options?: RentProtectionOption[];
  };
  brokerFeeDefault: boolean;
  neighborhoodGroups: Record<string, string[]>;
  transit: {
    type: "subway" | "metro" | "light-rail" | "mixed" | "limited";
    label: string;
    lines: TransitLine[];
  };
  buildingDataAvailable: boolean;
  buildingDataLabel?: string;
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
