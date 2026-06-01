import type { CityConfig } from "./types";

export const boston: CityConfig = {
  id: "boston",
  name: "boston",
  displayName: "Boston",
  state: "MA",
  iconEmoji: "⚓",
  budget: { min: 1400, max: 8000, default: 3000, median1BR: 2900, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: true,
  brokerFeeContext: "Boston broker fees typically equal one month's rent (~$2,900 on a $2,900/mo unit).",
  neighborhoodGroups: {
    Downtown: ["Back Bay", "Beacon Hill", "South End", "North End", "Downtown Crossing", "Seaport", "Charlestown"],
    "Inner Boston": ["Fenway", "Allston", "Brighton", "Mission Hill", "Jamaica Plain", "Dorchester", "Roxbury", "South Boston"],
    Cambridge: ["Harvard Sq", "Central Sq", "Kendall Sq", "Porter Sq"],
    Somerville: ["Davis Sq", "Union Sq"],
    Brookline: ["Coolidge Corner", "Brookline Village", "Washington Square"],
  },
  transit: {
    type: "subway",
    label: "Preferred MBTA T lines",
    lines: [
      { id: "red", label: "Red", color: "#DA291C", servesNeighborhoods: ["Harvard Sq", "Central Sq", "Kendall Sq", "Porter Sq", "Davis Sq", "Downtown Crossing", "South End", "Dorchester"] },
      { id: "orange", label: "Orange", color: "#ED8B00", servesNeighborhoods: ["Jamaica Plain", "Downtown Crossing", "Back Bay", "North End"] },
      { id: "blue", label: "Blue", color: "#003DA5", servesNeighborhoods: ["Downtown Crossing", "North End"] },
      { id: "green", label: "Green", color: "#00843D", servesNeighborhoods: ["Allston", "Brighton", "Back Bay", "Fenway", "Brookline Village", "Coolidge Corner"] },
      { id: "silver", label: "Silver", color: "#7C878E", servesNeighborhoods: ["Seaport", "South Boston", "Downtown Crossing"] },
    ],
  },
  buildingDataAvailable: false,
  buildingDataLabel: "Boston ISD",
  buildingDataSources: ["BISD"],
  pricingAnchor: "Boston brokers charge ~1 month rent. Nook costs 0.5% of that.",
  listingVelocityHours: 7,
  applicationFee: 30,
};
