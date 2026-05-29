import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

export const dc: CityConfig = {
  id: "dc",
  name: "dc",
  displayName: "Washington D.C.",
  state: "DC",
  budget: { min: 1300, max: 7500, default: 2800, median1BR: 2500, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent Stabilization",
    tooltip: "DC's Rental Housing Act protects ~80k apartments from large rent increases.",
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: false,
  neighborhoodGroups: {
    Northwest: ["Dupont Circle", "Logan Circle", "Adams Morgan", "Columbia Heights", "Georgetown", "Foggy Bottom", "Cleveland Park", "Woodley Park"],
    Northeast: ["H Street", "Brookland", "NoMa"],
    Southwest: ["The Wharf", "Navy Yard"],
    Southeast: ["Capitol Hill", "Anacostia"],
  },
  transit: {
    type: "metro",
    label: "Preferred Metro lines",
    lines: [
      { id: "red", label: "Red", color: "#BF0D3E", servesNeighborhoods: ["Dupont Circle", "Cleveland Park", "Woodley Park", "NoMa", "Brookland"] },
      { id: "orange", label: "Orange", color: "#ED8B00", servesNeighborhoods: ["Foggy Bottom", "Capitol Hill"] },
      { id: "blue", label: "Blue", color: "#009CDE", servesNeighborhoods: ["Foggy Bottom", "Capitol Hill"] },
      { id: "silver", label: "Silver", color: "#A1A3A1", servesNeighborhoods: ["Foggy Bottom"] },
      { id: "green", label: "Green", color: "#00B140", servesNeighborhoods: ["Columbia Heights", "Navy Yard", "The Wharf"] },
      { id: "yellow", label: "Yellow", color: "#FFD100", servesNeighborhoods: ["Columbia Heights", "The Wharf"] },
    ],
  },
  buildingDataAvailable: false,
};
