import type { CityConfig } from "./types";

export const philadelphia: CityConfig = {
  id: "philadelphia",
  name: "philadelphia",
  displayName: "Philadelphia",
  state: "PA",
  iconEmoji: "🔔",
  budget: { min: 900, max: 5000, default: 1900, median1BR: 1650, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  brokerFeeContext: "Broker fees uncommon in Philadelphia.",
  neighborhoodGroups: {
    "Center City": ["Rittenhouse", "Logan Square", "Washington Square West", "Society Hill", "Old City"],
    Fishtown: ["Fishtown", "Northern Liberties"],
    "South Philly": ["Bella Vista", "Italian Market", "Passyunk Square", "Point Breeze", "Graduate Hospital"],
    "University City": ["University City", "Powelton Village"],
    "West Philly": ["West Philly", "Spruce Hill", "Cedar Park"],
    Northwest: ["Manayunk", "Mount Airy", "Chestnut Hill", "Germantown"],
    Northeast: ["Northeast Philly", "Mayfair", "Frankford"],
  },
  transit: {
    type: "mixed",
    label: "Preferred SEPTA lines",
    lines: [
      { id: "mfl", label: "Market-Frankford", color: "#0078BE", servesNeighborhoods: ["Old City", "Fishtown", "Frankford", "University City"] },
      { id: "bsl", label: "Broad Street", color: "#FF8B00", servesNeighborhoods: ["Logan Square", "Rittenhouse", "Point Breeze"] },
      { id: "trolley", label: "Subway-Surface Trolleys", color: "#00A65C", servesNeighborhoods: ["University City", "West Philly"] },
      { id: "regional", label: "Regional Rail", color: "#6F2C91", servesNeighborhoods: ["Manayunk", "Chestnut Hill", "Mount Airy"] },
    ],
  },
  buildingDataAvailable: false,
  buildingDataLabel: "L&I violations",
  buildingDataSources: ["L&I"],
  pricingAnchor: "Philly's housing market is fast-moving despite lower prices.",
  listingVelocityHours: 12,
  applicationFee: 30,
};
