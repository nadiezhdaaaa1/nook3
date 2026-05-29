import type { CityConfig } from "./types";

export const philadelphia: CityConfig = {
  id: "philadelphia",
  name: "philadelphia",
  displayName: "Philadelphia",
  state: "PA",
  budget: { min: 900, max: 5000, default: 1900, median1BR: 1650, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    "Center City": ["Rittenhouse", "Washington Square West", "Old City", "Logan Square"],
    "South Philly": ["Bella Vista", "Passyunk Square", "Point Breeze", "Graduate Hospital"],
    "North Philly": ["Fishtown", "Northern Liberties", "Kensington", "Brewerytown"],
    "West Philly": ["University City", "Powelton Village"],
  },
  transit: {
    type: "subway",
    label: "Preferred SEPTA lines",
    lines: [
      { id: "mfl", label: "MFL", color: "#0078AE", servesNeighborhoods: ["Old City", "Fishtown", "Kensington", "University City"] },
      { id: "bsl", label: "BSL", color: "#FF6F00", servesNeighborhoods: ["Logan Square", "Rittenhouse", "Point Breeze"] },
      { id: "trolley", label: "Trolley", color: "#00A651", servesNeighborhoods: ["University City"] },
    ],
  },
  buildingDataAvailable: false,
};
