import type { CityConfig } from "./types";
import { RENT_PROTECTION_OPTIONS } from "./types";

const MAN = [
  "Upper West Side", "Upper East Side", "Midtown", "Hell's Kitchen", "Chelsea",
  "Greenwich Village", "East Village", "West Village", "SoHo", "Tribeca",
  "Financial District", "Lower East Side", "Harlem", "East Harlem", "Washington Heights",
  "Inwood", "Murray Hill", "Gramercy", "Flatiron", "Yorkville",
];
const BK = [
  "Williamsburg", "Greenpoint", "Bushwick", "Bedford-Stuyvesant", "Crown Heights",
  "Park Slope", "Prospect Heights", "Fort Greene", "Clinton Hill", "DUMBO",
  "Brooklyn Heights", "Cobble Hill", "Carroll Gardens", "Red Hook", "Sunset Park",
  "Bay Ridge", "Flatbush", "Ditmas Park",
];
const QN = [
  "Long Island City", "Astoria", "Sunnyside", "Woodside", "Jackson Heights",
  "Forest Hills", "Ridgewood", "Flushing", "Rego Park",
];
const BX = ["Mott Haven", "Concourse", "Riverdale", "Fordham", "Pelham Bay"];
const SI = ["St. George", "Stapleton", "Tompkinsville"];

const ALL = [...MAN, ...BK, ...QN, ...BX, ...SI];

// helper: subset of neighborhoods a line serves
const s = (...arr: string[][]) => arr.flat();

export const nyc: CityConfig = {
  id: "nyc",
  name: "nyc",
  displayName: "New York City",
  state: "NY",
  budget: { min: 1500, max: 15000, default: 4000, median1BR: 4200, step: 100 },
  rentProtection: {
    enabled: true,
    label: "Rent Stabilization",
    tooltip:
      "In NYC, ~1M apartments have rent-stabilization protecting against rent hikes.",
    options: RENT_PROTECTION_OPTIONS,
  },
  brokerFeeDefault: true,
  neighborhoodGroups: {
    Manhattan: MAN,
    Brooklyn: BK,
    Queens: QN,
    Bronx: BX,
    "Staten Island": SI,
  },
  transit: {
    type: "subway",
    label: "Preferred subway lines",
    lines: [
      { id: "1", label: "1", color: "#EE352E", servesNeighborhoods: s(["Upper West Side","Chelsea","Tribeca","Financial District","Harlem","Washington Heights","Inwood"]) },
      { id: "2", label: "2", color: "#EE352E", servesNeighborhoods: s(["Upper West Side","Chelsea","Tribeca","Harlem","Crown Heights","Flatbush","Park Slope"]) },
      { id: "3", label: "3", color: "#EE352E", servesNeighborhoods: s(["Upper West Side","Chelsea","Harlem","Crown Heights"]) },
      { id: "4", label: "4", color: "#00933C", servesNeighborhoods: s(["Upper East Side","Midtown","Financial District","Concourse","Fordham"]) },
      { id: "5", label: "5", color: "#00933C", servesNeighborhoods: s(["Upper East Side","Midtown","Financial District","Flatbush","Crown Heights"]) },
      { id: "6", label: "6", color: "#00933C", servesNeighborhoods: s(["Upper East Side","Yorkville","Murray Hill","East Harlem","Gramercy","Mott Haven","Pelham Bay"]) },
      { id: "7", label: "7", color: "#B933AD", servesNeighborhoods: s(["Long Island City","Sunnyside","Woodside","Jackson Heights","Flushing","Midtown"]) },
      { id: "A", label: "A", color: "#2850AD", servesNeighborhoods: s(["Washington Heights","Inwood","Harlem","Chelsea","Hell's Kitchen","Financial District","Greenwich Village"]) },
      { id: "C", label: "C", color: "#2850AD", servesNeighborhoods: s(["Washington Heights","Harlem","Chelsea","Hell's Kitchen","Clinton Hill","Bedford-Stuyvesant"]) },
      { id: "E", label: "E", color: "#2850AD", servesNeighborhoods: s(["Midtown","Hell's Kitchen","Long Island City","Forest Hills","Jackson Heights"]) },
      { id: "B", label: "B", color: "#FF6319", servesNeighborhoods: s(["Upper West Side","Midtown","Greenwich Village","Harlem","Park Slope","Prospect Heights","Flatbush"]) },
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
    ],
  },
  buildingDataAvailable: true,
  buildingDataLabel: "311 + DOB violations",
};
