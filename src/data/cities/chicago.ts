import type { CityConfig } from "./types";

export const chicago: CityConfig = {
  id: "chicago",
  name: "chicago",
  displayName: "Chicago",
  state: "IL",
  budget: { min: 900, max: 6000, default: 2200, median1BR: 1900, step: 100 },
  rentProtection: { enabled: false },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    "North Side": ["Lincoln Park", "Lakeview", "Wicker Park", "Bucktown", "Logan Square", "Uptown", "Ravenswood"],
    "West Side": ["West Loop", "Pilsen", "Ukrainian Village", "Humboldt Park"],
    "South Side": ["Hyde Park", "Bridgeport", "Bronzeville"],
    Downtown: ["The Loop", "River North", "Streeterville", "Gold Coast"],
  },
  transit: {
    type: "subway",
    label: "Preferred CTA lines",
    lines: [
      { id: "red", label: "Red", color: "#C60C30", servesNeighborhoods: ["Lakeview", "Uptown", "The Loop", "Streeterville"] },
      { id: "blue", label: "Blue", color: "#00A1DE", servesNeighborhoods: ["Wicker Park", "Logan Square", "The Loop"] },
      { id: "brown", label: "Brown", color: "#62361B", servesNeighborhoods: ["Lincoln Park", "Lakeview", "Ravenswood", "The Loop"] },
      { id: "green", label: "Green", color: "#009B3A", servesNeighborhoods: ["The Loop", "Bronzeville"] },
      { id: "orange", label: "Orange", color: "#F9461C", servesNeighborhoods: ["The Loop"] },
      { id: "pink", label: "Pink", color: "#E27EA6", servesNeighborhoods: ["Pilsen", "The Loop"] },
      { id: "purple", label: "Purple", color: "#522398", servesNeighborhoods: ["The Loop"] },
      { id: "yellow", label: "Yellow", color: "#F9E300", servesNeighborhoods: [] },
    ],
  },
  buildingDataAvailable: false,
};
