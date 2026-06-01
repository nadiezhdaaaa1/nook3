import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

export const la: CityConfig = {
  id: "la",
  name: "la",
  displayName: "Los Angeles",
  state: "CA",
  iconEmoji: "🌴",
  budget: { min: 1200, max: 10000, default: 3200, median1BR: 2800, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent-Controlled (RSO)",
    tooltip:
      "LA's Rent Stabilization Ordinance covers ~624k units in buildings built before October 1, 1978.",
    tooltipShort:
      "LA's Rent Stabilization Ordinance (RSO) covers ~624k units in buildings built before Oct 1, 1978.",
    matchBaseline: 8500,
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: false,
  brokerFeeContext: "Broker fees uncommon in LA — most listings are landlord-direct.",
  neighborhoodGroups: {
    Westside: ["Santa Monica", "Venice", "Mar Vista", "Culver City", "Brentwood", "West LA", "Westwood", "Pacific Palisades", "Playa Vista", "Playa del Rey"],
    Downtown: ["Downtown LA", "Arts District", "Little Tokyo", "Chinatown", "Echo Park", "Historic Core", "South Park"],
    Eastside: ["Silver Lake", "Los Feliz", "Highland Park", "Eagle Rock", "Mount Washington", "Atwater Village", "Boyle Heights", "Lincoln Heights"],
    "San Fernando Valley": ["Sherman Oaks", "Studio City", "North Hollywood", "Burbank", "Glendale", "Encino", "Van Nuys", "Woodland Hills", "Tarzana"],
    "South Bay": ["El Segundo", "Hermosa Beach", "Manhattan Beach", "Redondo Beach", "Long Beach", "Torrance"],
    "Hollywood/Mid-City": ["Hollywood", "West Hollywood", "Mid-City", "Koreatown", "Beverly Hills", "Hancock Park", "Larchmont", "Miracle Mile"],
  },
  transit: {
    type: "mixed",
    label: "Preferred Metro lines",
    lines: [
      { id: "A", label: "A", color: "#0072BC", servesNeighborhoods: ["Downtown LA", "Highland Park", "Long Beach"] },
      { id: "B", label: "B", color: "#ED1C24", servesNeighborhoods: ["Downtown LA", "Hollywood", "Koreatown", "North Hollywood"] },
      { id: "C", label: "C", color: "#009A4E", servesNeighborhoods: ["El Segundo", "Redondo Beach"] },
      { id: "D", label: "D", color: "#771E76", servesNeighborhoods: ["Downtown LA", "Koreatown"] },
      { id: "E", label: "E", color: "#ED8B00", servesNeighborhoods: ["Santa Monica", "Culver City", "Downtown LA"] },
      { id: "K", label: "K", color: "#E6007E", servesNeighborhoods: ["Culver City"] },
    ],
  },
  buildingDataAvailable: true,
  buildingDataLabel: "LAHD complaints",
  buildingDataSources: ["LAHD", "LADBS"],
  pricingAnchor: "Average LA renter spends $250–500 on application fees alone (5–10 apps × $50).",
  listingVelocityHours: 8,
  applicationFee: 50,
};
