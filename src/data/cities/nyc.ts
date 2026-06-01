import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

const MAN = [
  "Upper West Side", "Upper East Side", "Stuyvesant Town/PCV", "East Village", "West Village",
  "Lower East Side", "Chelsea", "Midtown", "Financial District", "Roosevelt Island",
  "Hamilton Heights", "West Harlem", "Central Harlem", "East Harlem", "Morningside Heights",
  "Manhattan Valley", "Inwood", "Washington Heights", "Yorkville", "Carnegie Hill",
  "Midtown East", "Midtown West", "Central Park South", "Lincoln Square", "Lenox Hill",
  "Sutton Place", "Turtle Bay", "Kips Bay", "Flatiron", "NoMad",
  "Midtown South", "West Chelsea", "Hudson Yards", "Hudson Square", "SoHo",
  "Nolita", "Little Italy", "Tribeca", "Chinatown", "Civic Center",
  "Two Bridges", "Fulton/Seaport", "Greenwich Village", "Hell's Kitchen", "NoHo",
  "Murray Hill", "Battery Park City", "Gramercy Park", "Hudson Heights", "Manhattanville",
  "South Harlem", "Marble Hill",
];

const BK = [
  "Williamsburg", "East Williamsburg", "Greenpoint", "Vinegar Hill", "Brooklyn Heights",
  "DUMBO", "Downtown Brooklyn", "Fort Greene", "Clinton Hill", "Boerum Hill",
  "Cobble Hill", "Carroll Gardens", "Columbia St Waterfront District", "Red Hook", "Park Slope",
  "Gowanus", "Prospect Heights", "Windsor Terrace", "Prospect Lefferts Gardens", "Greenwood",
  "Prospect Park South", "Bedford-Stuyvesant", "Stuyvesant Heights", "Bushwick", "Crown Heights",
  "Ditmas Park", "Flatbush", "Kensington", "Borough Park", "Mapleton",
  "Ocean Hill", "Weeksville", "Wingate", "Brownsville", "East New York",
  "Cypress Hills", "East Flatbush", "Canarsie", "Sunset Park", "Bay Ridge",
  "Dyker Heights", "Bensonhurst", "Bath Beach", "Gravesend", "Midwood",
  "Brighton Beach", "Sheepshead Bay", "Manhattan Beach", "Coney Island", "Seagate",
  "Bergen Beach", "Flatlands", "Marine Park", "Gerritsen Beach", "Mill Basin",
];

const QN = [
  "Astoria", "Ditmars-Steinway", "Long Island City", "Hunters Point", "Sunnyside",
  "Woodside", "Jackson Heights", "East Elmhurst", "North Corona", "Corona",
  "Elmhurst", "Maspeth", "Middle Village", "Glendale", "Ridgewood",
  "Rego Park", "Forest Hills", "Flushing", "College Point", "Whitestone",
  "Fresh Meadows", "Kew Gardens Hills", "Kew Gardens", "Woodhaven", "Richmond Hill",
  "Ozone Park", "South Ozone Park", "Howard Beach", "Bayside", "Jamaica",
  "Jamaica Hills", "Hollis", "Queens Village", "Rosedale", "Laurelton",
  "St. Albans", "South Jamaica",
];

const BX = [
  "Riverdale", "Concourse", "Mott Haven", "Fordham", "Pelham Bay",
  "Kingsbridge", "Morris Park", "Pelham Parkway",
];

const SI = ["St. George", "Stapleton", "Tompkinsville", "New Brighton", "West Brighton", "Port Richmond", "Great Kills", "Tottenville"];

const NJ = ["Jersey City", "Hoboken", "Newport", "Historic Downtown", "Journal Square"];

const s = (...arr: string[][]) => arr.flat();

export const nyc: CityConfig = {
  id: "nyc",
  name: "nyc",
  displayName: "New York City",
  state: "NY",
  iconEmoji: "🗽",
  budget: { min: 1500, max: 15000, default: 4000, median1BR: 4200, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent Stabilization",
    tooltip:
      "NYC has ~1M rent-stabilized apartments protected by law from large rent increases.",
    tooltipShort:
      "NYC has ~1M rent-stabilized apartments protected by law from large rent increases.",
    matchBaseline: 12000,
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: true,
  brokerFeeContext:
    "Broker fees in NYC typically equal 12–15% of annual rent ($3,600–$8,000 on a $4k/mo unit).",
  neighborhoodGroups: {
    Manhattan: MAN,
    Brooklyn: BK,
    Queens: QN,
    Bronx: BX,
    "Staten Island": SI,
    "New Jersey": NJ,
  },
  transit: {
    type: "subway",
    label: "Preferred subway lines",
    lines: [
      { id: "1", label: "1", color: "#EE352E", servesNeighborhoods: s(["Upper West Side","Chelsea","Tribeca","Financial District","Central Harlem","Washington Heights","Inwood"]) },
      { id: "2", label: "2", color: "#EE352E", servesNeighborhoods: s(["Upper West Side","Chelsea","Tribeca","Central Harlem","Crown Heights","Flatbush","Park Slope"]) },
      { id: "3", label: "3", color: "#EE352E", servesNeighborhoods: s(["Upper West Side","Chelsea","Central Harlem","Crown Heights"]) },
      { id: "4", label: "4", color: "#00933C", servesNeighborhoods: s(["Upper East Side","Midtown","Financial District","Concourse","Fordham"]) },
      { id: "5", label: "5", color: "#00933C", servesNeighborhoods: s(["Upper East Side","Midtown","Financial District","Flatbush","Crown Heights"]) },
      { id: "6", label: "6", color: "#00933C", servesNeighborhoods: s(["Upper East Side","Yorkville","Murray Hill","East Harlem","Gramercy Park","Mott Haven","Pelham Bay"]) },
      { id: "7", label: "7", color: "#B933AD", servesNeighborhoods: s(["Long Island City","Sunnyside","Woodside","Jackson Heights","Flushing","Midtown"]) },
      { id: "A", label: "A", color: "#2850AD", servesNeighborhoods: s(["Washington Heights","Inwood","Central Harlem","Chelsea","Hell's Kitchen","Financial District","Greenwich Village"]) },
      { id: "C", label: "C", color: "#2850AD", servesNeighborhoods: s(["Washington Heights","Central Harlem","Chelsea","Hell's Kitchen","Clinton Hill","Bedford-Stuyvesant"]) },
      { id: "E", label: "E", color: "#2850AD", servesNeighborhoods: s(["Midtown","Hell's Kitchen","Long Island City","Forest Hills","Jackson Heights"]) },
      { id: "B", label: "B", color: "#FF6319", servesNeighborhoods: s(["Upper West Side","Midtown","Greenwich Village","Central Harlem","Park Slope","Prospect Heights","Flatbush"]) },
      { id: "D", label: "D", color: "#FF6319", servesNeighborhoods: s(["Upper West Side","Midtown","Greenwich Village","Bay Ridge","Sunset Park","Concourse","Fordham"]) },
      { id: "F", label: "F", color: "#FF6319", servesNeighborhoods: s(["Forest Hills","Long Island City","Midtown","Lower East Side","East Village","Park Slope","Carroll Gardens","Ditmas Park"]) },
      { id: "M", label: "M", color: "#FF6319", servesNeighborhoods: s(["Forest Hills","Ridgewood","Bushwick","Williamsburg","Lower East Side","Midtown"]) },
      { id: "G", label: "G", color: "#6CBE45", servesNeighborhoods: s(["Long Island City","Greenpoint","Williamsburg","Fort Greene","Clinton Hill","Park Slope","Carroll Gardens"]) },
      { id: "J", label: "J", color: "#996633", servesNeighborhoods: s(["Lower East Side","Williamsburg","Bushwick","Bedford-Stuyvesant","Financial District"]) },
      { id: "Z", label: "Z", color: "#996633", servesNeighborhoods: s(["Lower East Side","Williamsburg","Financial District"]) },
      { id: "L", label: "L", color: "#A7A9AC", servesNeighborhoods: s(["Chelsea","West Village","East Village","Williamsburg","Bushwick","Greenpoint","Bedford-Stuyvesant"]) },
      { id: "N", label: "N", color: "#FCCC0A", servesNeighborhoods: s(["Astoria","Long Island City","Midtown","Greenwich Village","Financial District","Bay Ridge","Sunset Park"]) },
      { id: "Q", label: "Q", color: "#FCCC0A", servesNeighborhoods: s(["Astoria","Upper East Side","Yorkville","Midtown","Greenwich Village","Financial District","DUMBO","Flatbush"]) },
      { id: "R", label: "R", color: "#FCCC0A", servesNeighborhoods: s(["Astoria","Long Island City","Midtown","Greenwich Village","Financial District","DUMBO","Bay Ridge","Sunset Park"]) },
      { id: "W", label: "W", color: "#FCCC0A", servesNeighborhoods: s(["Astoria","Long Island City","Midtown","Financial District"]) },
      { id: "S", label: "S", color: "#808183", servesNeighborhoods: s(["Midtown","Times Square"].filter(Boolean) as string[]) },
    ],
  },
  buildingDataAvailable: true,
  buildingDataLabel: "311 + DOB violations",
  buildingDataSources: ["DOB", "HPD", "DOHMH", "311"],
  pricingAnchor: "Average NYC broker fee: $4,500.",
  listingVelocityHours: 6,
  applicationFee: 50,
};
