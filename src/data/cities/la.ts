import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

export const la: CityConfig = {
  id: "la",
  name: "la",
  displayName: "Los Angeles",
  state: "CA",
  budget: { min: 1200, max: 10000, default: 3200, median1BR: 2800, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent-Controlled (RSO)",
    tooltip:
      "LA's Rent Stabilization Ordinance covers ~624k units in buildings built before 10/1/78.",
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    Westside: ["Santa Monica", "Venice", "Mar Vista", "Culver City", "Brentwood", "West LA", "Westwood"],
    Downtown: ["Downtown LA", "Arts District", "Little Tokyo", "Chinatown", "Echo Park"],
    Eastside: ["Silver Lake", "Los Feliz", "Highland Park", "Eagle Rock", "Mount Washington"],
    "San Fernando Valley": ["Sherman Oaks", "Studio City", "North Hollywood", "Burbank", "Glendale"],
    "South Bay": ["El Segundo", "Hermosa Beach", "Manhattan Beach", "Redondo Beach"],
    Hollywood: ["Hollywood", "West Hollywood", "Mid-City", "Koreatown"],
  },
  transit: {
    type: "metro",
    label: "Preferred Metro lines",
    lines: [
      { id: "A", label: "A", color: "#0072BC", servesNeighborhoods: ["Downtown LA", "Highland Park"] },
      { id: "B", label: "B", color: "#E10075", servesNeighborhoods: ["Downtown LA", "Hollywood", "Koreatown", "North Hollywood"] },
      { id: "C", label: "C", color: "#00A65A", servesNeighborhoods: ["El Segundo", "Redondo Beach"] },
      { id: "D", label: "D", color: "#A05DA5", servesNeighborhoods: ["Downtown LA", "Koreatown"] },
      { id: "E", label: "E", color: "#FFC600", servesNeighborhoods: ["Santa Monica", "Culver City", "Downtown LA"] },
      { id: "K", label: "K", color: "#E96A1F", servesNeighborhoods: ["Culver City"] },
    ],
  },
  buildingDataAvailable: true,
  buildingDataLabel: "LADBS complaints",
};
