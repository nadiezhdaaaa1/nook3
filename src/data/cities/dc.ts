import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

export const dc: CityConfig = {
  id: "dc",
  name: "dc",
  displayName: "Washington D.C.",
  state: "DC",
  iconEmoji: "🏛️",
  budget: { min: 1300, max: 7500, default: 2800, median1BR: 2500, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent Stabilization",
    tooltip:
      "DC's Rental Housing Act protects ~80k apartments from large rent increases. Inclusionary Zoning (IZ) lottery offers affordable units in market-rate buildings.",
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: false,
  brokerFeeContext: "Broker fees uncommon in DC.",
  neighborhoodGroups: {
    Northwest: ["Dupont Circle", "Logan Circle", "Adams Morgan", "Mt Pleasant", "Cleveland Park", "Tenleytown", "Friendship Heights", "Georgetown", "Foggy Bottom", "Penn Quarter", "Columbia Heights", "Woodley Park"],
    Northeast: ["H Street", "NoMa", "Brookland", "Eckington", "Trinidad"],
    Southwest: ["Navy Yard", "Southwest Waterfront", "The Wharf"],
    Southeast: ["Capitol Hill", "Anacostia", "Hill East"],
    "Maryland Suburbs": ["Silver Spring", "Bethesda", "Takoma Park"],
    "Virginia Suburbs": ["Arlington", "Alexandria", "Crystal City"],
  },
  transit: {
    type: "metro",
    label: "Preferred Metro lines",
    lines: [
      { id: "red", label: "Red", color: "#E51937", servesNeighborhoods: ["Dupont Circle", "Cleveland Park", "Woodley Park", "NoMa", "Brookland", "Bethesda", "Silver Spring"] },
      { id: "orange", label: "Orange", color: "#F7941E", servesNeighborhoods: ["Foggy Bottom", "Capitol Hill", "Arlington"] },
      { id: "blue", label: "Blue", color: "#0072CE", servesNeighborhoods: ["Foggy Bottom", "Capitol Hill", "Crystal City", "Alexandria"] },
      { id: "silver", label: "Silver", color: "#A0A0A0", servesNeighborhoods: ["Foggy Bottom", "Arlington"] },
      { id: "green", label: "Green", color: "#00B140", servesNeighborhoods: ["Columbia Heights", "Navy Yard", "The Wharf"] },
      { id: "yellow", label: "Yellow", color: "#FFD520", servesNeighborhoods: ["Columbia Heights", "The Wharf", "Crystal City"] },
    ],
  },
  buildingDataAvailable: true,
  buildingDataLabel: "DC housing inspections",
  buildingDataSources: ["DC DCRA", "DC Open Data"],
  pricingAnchor: "DC's IZ lottery requires monitoring 20+ sources. Nook tracks all of them.",
  listingVelocityHours: 9,
  applicationFee: 40,
};
