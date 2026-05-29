import type { CityConfig } from "./types";

export const austin: CityConfig = {
  id: "austin",
  name: "austin",
  displayName: "Austin",
  state: "TX",
  budget: { min: 1000, max: 5500, default: 2200, median1BR: 1800, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    Central: ["Downtown", "East Austin", "South Congress", "Bouldin Creek", "Zilker"],
    North: ["Hyde Park", "North Loop", "Crestview", "Allandale"],
    South: ["South Lamar", "Travis Heights"],
    West: ["Clarksville", "Tarrytown"],
  },
  transit: {
    type: "limited",
    label: "Preferred MetroRail",
    lines: [
      { id: "red", label: "Red Line", color: "#BF0D3E", servesNeighborhoods: ["Downtown", "Crestview"] },
    ],
  },
  buildingDataAvailable: false,
};
