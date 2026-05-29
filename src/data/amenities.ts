export interface AmenityItem {
  id: string;
  label: string;
}

export interface AmenityGroup {
  id: string;
  label: string;
  items: AmenityItem[];
}

export const AMENITY_GROUPS: AmenityGroup[] = [
  {
    id: "building",
    label: "Building",
    items: [
      { id: "elevator", label: "Elevator" },
      { id: "doorman", label: "Doorman" },
      { id: "gym", label: "Gym" },
      { id: "laundry-building", label: "Laundry in building" },
      { id: "roof-deck", label: "Roof deck" },
      { id: "package-room", label: "Package room" },
    ],
  },
  {
    id: "unit",
    label: "Unit",
    items: [
      { id: "in-unit-laundry", label: "In-unit laundry" },
      { id: "dishwasher", label: "Dishwasher" },
      { id: "central-ac", label: "Central A/C" },
      { id: "balcony", label: "Balcony / outdoor" },
      { id: "hardwood", label: "Hardwood floors" },
      { id: "natural-light", label: "Lots of natural light" },
    ],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    items: [
      { id: "pets", label: "Pets allowed" },
      { id: "furnished", label: "Furnished" },
      { id: "short-term", label: "Short-term OK" },
      { id: "no-fee", label: "No broker fee" },
    ],
  },
];

export const AMENITY_PRESETS: { id: string; label: string; ids: string[] }[] = [
  { id: "essentials", label: "Essentials", ids: ["in-unit-laundry", "dishwasher", "elevator"] },
  { id: "wfh", label: "Work from home", ids: ["natural-light", "elevator", "central-ac"] },
  { id: "with-pet", label: "With a pet", ids: ["pets", "elevator", "balcony"] },
  { id: "luxury", label: "Luxury", ids: ["doorman", "gym", "roof-deck", "central-ac"] },
];

export function findAmenity(id: string): AmenityItem | undefined {
  for (const g of AMENITY_GROUPS) {
    const f = g.items.find((i) => i.id === id);
    if (f) return f;
  }
  return undefined;
}
