import type { CityConfig } from "./types";

export const austin: CityConfig = {
  id: "austin",
  name: "austin",
  displayName: "Austin",
  state: "TX",
  iconEmoji: "🎸",
  budget: { min: 1000, max: 5500, default: 2200, median1BR: 1800, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  brokerFeeContext: "Broker fees uncommon in Austin.",
  neighborhoodGroups: {
    Central: ["Downtown", "East Austin", "Hyde Park", "Hancock", "Bouldin Creek"],
    East: ["Mueller", "Govalle", "Holly"],
    South: ["South Lamar", "South Congress", "Travis Heights", "Zilker"],
    North: ["North Loop", "Crestview", "Allandale"],
    West: ["Tarrytown", "Clarksville", "West Lake Hills"],
    Suburbs: ["Round Rock", "Cedar Park", "Pflugerville"],
  },
  transit: {
    type: "limited",
    label: "Transit & commute",
    lines: [
      { id: "red", label: "Red Line", color: "#BF0D3E", servesNeighborhoods: ["Downtown", "Crestview"] },
    ],
  },
  buildingDataAvailable: false,
  buildingDataLabel: "Austin Code",
  buildingDataSources: ["Austin Code"],
  pricingAnchor: "Austin rents jumped 30% in 24 months. Real-time alerts mean better deals.",
  listingVelocityHours: 10,
  applicationFee: 50,
};
