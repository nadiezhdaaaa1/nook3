import type { CityConfig } from "./types";

export const miami: CityConfig = {
  id: "miami",
  name: "miami",
  displayName: "Miami",
  state: "FL",
  budget: { min: 1300, max: 7000, default: 2600, median1BR: 2800, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    "Miami Core": ["Brickell", "Downtown Miami", "Edgewater", "Wynwood", "Little Havana", "Coral Way"],
    "North Miami": ["Midtown", "Design District", "Buena Vista"],
    "Beaches": ["South Beach", "Mid-Beach", "North Beach"],
    "South": ["Coconut Grove", "Coral Gables", "Key Biscayne"],
  },
  transit: {
    type: "metro",
    label: "Preferred Metrorail",
    lines: [
      { id: "orange", label: "Orange", color: "#F58220", servesNeighborhoods: ["Brickell", "Downtown Miami", "Coral Gables"] },
      { id: "green", label: "Green", color: "#00A551", servesNeighborhoods: ["Brickell", "Downtown Miami"] },
    ],
  },
  buildingDataAvailable: false,
};
