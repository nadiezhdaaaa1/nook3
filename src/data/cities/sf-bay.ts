import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

export const sfBay: CityConfig = {
  id: "sf-bay",
  name: "sf-bay",
  displayName: "San Francisco Bay",
  state: "CA",
  iconEmoji: "🌉",
  budget: { min: 1500, max: 12000, default: 3800, median1BR: 3400, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent Control (SF only)",
    tooltip:
      "SF Rent Control covers multi-unit buildings built before June 13, 1979. Oakland has separate rent control covering buildings built before 1983.",
    tooltipShort:
      "SF Rent Control covers multi-unit buildings built before June 13, 1979. Oakland covers pre-1983.",
    matchBaseline: 4200,
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: false,
  brokerFeeContext: "Broker fees rare in the Bay Area — but some buildings charge $200–500 admin fees.",
  neighborhoodGroups: {
    "San Francisco": ["Mission", "Castro", "Noe Valley", "Hayes Valley", "SoMa", "North Beach", "Marina", "Pacific Heights", "Sunset", "Richmond", "Nob Hill", "Russian Hill", "Lower Haight", "Cole Valley", "Bernal Heights", "Potrero Hill", "Dogpatch"],
    "East Bay": ["Oakland Downtown", "Rockridge", "Berkeley", "Emeryville", "Alameda", "Walnut Creek", "Lake Merritt", "Temescal", "Piedmont"],
    Peninsula: ["Daly City", "San Mateo", "Burlingame", "Palo Alto", "Mountain View", "Redwood City", "South San Francisco", "Menlo Park"],
    "South Bay": ["San Jose Downtown", "Sunnyvale", "Santa Clara", "Cupertino", "Mountain View", "Campbell"],
  },
  transit: {
    type: "mixed",
    label: "Preferred BART / Muni",
    lines: [
      { id: "bart-yellow", label: "BART Y", color: "#FFD200", servesNeighborhoods: ["SoMa", "Mission", "Oakland Downtown", "Berkeley"] },
      { id: "bart-blue", label: "BART B", color: "#0099CC", servesNeighborhoods: ["SoMa", "Oakland Downtown", "Daly City"] },
      { id: "bart-red", label: "BART R", color: "#FF4136", servesNeighborhoods: ["SoMa", "Mission", "Oakland Downtown", "Richmond"] },
      { id: "bart-green", label: "BART G", color: "#01853A", servesNeighborhoods: ["SoMa", "Oakland Downtown"] },
      { id: "bart-orange", label: "BART O", color: "#FF8C00", servesNeighborhoods: ["Berkeley", "Oakland Downtown"] },
      { id: "muni-n", label: "Muni N", color: "#0079C2", servesNeighborhoods: ["Sunset", "SoMa", "Hayes Valley", "Cole Valley"] },
      { id: "muni-k", label: "Muni K", color: "#436F8E", servesNeighborhoods: ["SoMa"] },
      { id: "muni-l", label: "Muni L", color: "#92278F", servesNeighborhoods: ["Sunset", "SoMa"] },
      { id: "muni-m", label: "Muni M", color: "#008752", servesNeighborhoods: ["SoMa"] },
      { id: "caltrain", label: "Caltrain", color: "#E31837", servesNeighborhoods: ["SoMa", "Palo Alto", "Mountain View", "San Mateo", "San Jose Downtown"] },
    ],
  },
  buildingDataAvailable: false,
  buildingDataLabel: "SF Building Inspection",
  buildingDataSources: ["SFBI"],
  pricingAnchor: "Median SF 1BR: $3,400. Application fees alone for a typical search: $300+.",
  listingVelocityHours: 12,
  applicationFee: 40,
};
