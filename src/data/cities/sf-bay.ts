import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

export const sfBay: CityConfig = {
  id: "sf-bay",
  name: "sf-bay",
  displayName: "San Francisco Bay",
  state: "CA",
  budget: { min: 1500, max: 12000, default: 3800, median1BR: 3400, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent-Controlled",
    tooltip: "SF Rent Control covers multi-unit buildings built before 6/13/79.",
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    "San Francisco": ["Mission", "SoMa", "Hayes Valley", "Castro", "Nob Hill", "Russian Hill", "Marina", "Pacific Heights", "Sunset", "Richmond"],
    "East Bay": ["Oakland Downtown", "Rockridge", "Berkeley", "Emeryville", "Alameda"],
    Peninsula: ["South San Francisco", "San Mateo", "Burlingame", "Redwood City"],
    "South Bay": ["San Jose Downtown", "Mountain View", "Palo Alto", "Sunnyvale"],
  },
  transit: {
    type: "mixed",
    label: "Preferred BART / Muni",
    lines: [
      { id: "bart-yellow", label: "BART Y", color: "#FFC72C", servesNeighborhoods: ["SoMa", "Mission", "Oakland Downtown", "Berkeley"] },
      { id: "bart-blue", label: "BART B", color: "#0099D8", servesNeighborhoods: ["SoMa", "Oakland Downtown"] },
      { id: "bart-orange", label: "BART O", color: "#FF6319", servesNeighborhoods: ["Berkeley", "Oakland Downtown"] },
      { id: "bart-green", label: "BART G", color: "#00A95C", servesNeighborhoods: ["SoMa", "Oakland Downtown"] },
      { id: "bart-red", label: "BART R", color: "#E12325", servesNeighborhoods: ["SoMa", "Mission", "Oakland Downtown"] },
      { id: "muni-n", label: "Muni N", color: "#0079C2", servesNeighborhoods: ["Sunset", "SoMa", "Hayes Valley"] },
      { id: "muni-t", label: "Muni T", color: "#D5006A", servesNeighborhoods: ["SoMa", "Castro"] },
    ],
  },
  buildingDataAvailable: false,
};
