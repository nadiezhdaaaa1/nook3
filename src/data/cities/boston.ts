import type { CityConfig } from "./types";

export const boston: CityConfig = {
  id: "boston",
  name: "boston",
  displayName: "Boston",
  state: "MA",
  budget: { min: 1400, max: 8000, default: 3000, median1BR: 2900, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: true,
  neighborhoodGroups: {
    Downtown: ["Back Bay", "Beacon Hill", "South End", "North End", "Downtown Crossing", "Seaport"],
    "Inner Boston": ["Fenway", "Allston", "Brighton", "Mission Hill", "Jamaica Plain"],
    "Cross-River": ["Cambridge", "Somerville", "Brookline"],
  },
  transit: {
    type: "subway",
    label: "Preferred T lines",
    lines: [
      { id: "red", label: "Red", color: "#DA291C", servesNeighborhoods: ["Cambridge", "Somerville", "Downtown Crossing", "South End"] },
      { id: "orange", label: "Orange", color: "#ED8B00", servesNeighborhoods: ["Jamaica Plain", "Downtown Crossing", "Back Bay"] },
      { id: "blue", label: "Blue", color: "#003DA5", servesNeighborhoods: ["Downtown Crossing", "North End"] },
      { id: "green-b", label: "Green B", color: "#00843D", servesNeighborhoods: ["Allston", "Brighton", "Back Bay", "Fenway"] },
      { id: "green-c", label: "Green C", color: "#00843D", servesNeighborhoods: ["Brookline", "Back Bay"] },
      { id: "green-d", label: "Green D", color: "#00843D", servesNeighborhoods: ["Brookline", "Fenway", "Back Bay"] },
      { id: "green-e", label: "Green E", color: "#00843D", servesNeighborhoods: ["Mission Hill", "Back Bay"] },
    ],
  },
  buildingDataAvailable: false,
};
