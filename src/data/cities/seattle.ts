import type { CityConfig } from "./types";

export const seattle: CityConfig = {
  id: "seattle",
  name: "seattle",
  displayName: "Seattle",
  state: "WA",
  budget: { min: 1200, max: 6500, default: 2500, median1BR: 2300, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    Central: ["Capitol Hill", "First Hill", "Downtown", "Belltown", "South Lake Union"],
    North: ["Ballard", "Fremont", "Wallingford", "University District", "Green Lake"],
    South: ["Beacon Hill", "Columbia City", "Georgetown"],
    East: ["Madison Park", "Madrona"],
  },
  transit: {
    type: "light-rail",
    label: "Preferred Link Light Rail",
    lines: [
      { id: "1-line", label: "1 Line", color: "#00A4E4", servesNeighborhoods: ["University District", "Capitol Hill", "Downtown", "Beacon Hill", "Columbia City"] },
      { id: "2-line", label: "2 Line", color: "#76BD22", servesNeighborhoods: ["Downtown"] },
      { id: "sounder", label: "Sounder", color: "#2E5A8A", servesNeighborhoods: ["Downtown"] },
    ],
  },
  buildingDataAvailable: false,
};
