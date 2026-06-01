import type { CityConfig } from "./types";

export const seattle: CityConfig = {
  id: "seattle",
  name: "seattle",
  displayName: "Seattle",
  state: "WA",
  iconEmoji: "🌲",
  budget: { min: 1200, max: 6500, default: 2500, median1BR: 2300, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  brokerFeeContext: "Broker fees rare in Seattle.",
  neighborhoodGroups: {
    Central: ["Downtown", "Capitol Hill", "Belltown", "First Hill", "South Lake Union", "Queen Anne"],
    North: ["Ballard", "Fremont", "Wallingford", "U-District", "Green Lake", "Greenwood", "Phinney Ridge"],
    South: ["Beacon Hill", "Columbia City", "Georgetown", "West Seattle"],
    Eastside: ["Bellevue", "Kirkland", "Redmond"],
  },
  transit: {
    type: "light-rail",
    label: "Preferred Link Light Rail",
    lines: [
      { id: "1-line", label: "1 Line", color: "#00925C", servesNeighborhoods: ["U-District", "Capitol Hill", "Downtown", "Beacon Hill", "Columbia City"] },
      { id: "sounder-n", label: "Sounder N", color: "#003E7E", servesNeighborhoods: ["Downtown"] },
      { id: "sounder-s", label: "Sounder S", color: "#003E7E", servesNeighborhoods: ["Downtown"] },
    ],
  },
  buildingDataAvailable: false,
  buildingDataLabel: "Seattle DCI",
  buildingDataSources: ["SDCI"],
  pricingAnchor: "Seattle renters refresh listings 200+ times in a typical search. Nook does it for you.",
  listingVelocityHours: 11,
  applicationFee: 40,
};
