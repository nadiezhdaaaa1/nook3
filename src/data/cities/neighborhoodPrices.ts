/**
 * Approximate median 1BR rent per neighborhood (USD/month).
 * Used to rank neighborhoods against the user's budget range.
 * Numbers are rough public-domain estimates — good enough for sorting.
 */
import type { CityId } from "./types";

type PriceMap = Record<string, number>;

const NYC: PriceMap = {
  // Manhattan
  "Upper West Side": 4200,
  "Upper East Side": 3900,
  "Midtown": 4400,
  "Hell's Kitchen": 4100,
  "Chelsea": 4600,
  "Greenwich Village": 5200,
  "East Village": 4300,
  "West Village": 5500,
  "SoHo": 5800,
  "Tribeca": 6500,
  "Financial District": 4500,
  "Lower East Side": 4200,
  "Harlem": 2600,
  "East Harlem": 2400,
  "Washington Heights": 2300,
  "Inwood": 2100,
  "Murray Hill": 4000,
  "Gramercy": 4500,
  "Flatiron": 5000,
  "Yorkville": 3500,
  // Brooklyn
  "Williamsburg": 4200,
  "Greenpoint": 3800,
  "Bushwick": 3000,
  "Bedford-Stuyvesant": 2900,
  "Crown Heights": 2700,
  "Park Slope": 3600,
  "Prospect Heights": 3400,
  "Fort Greene": 3500,
  "Clinton Hill": 3100,
  "DUMBO": 5200,
  "Brooklyn Heights": 4500,
  "Cobble Hill": 4000,
  "Carroll Gardens": 3900,
  "Red Hook": 3000,
  "Sunset Park": 2500,
  "Bay Ridge": 2200,
  "Flatbush": 2300,
  "Ditmas Park": 2400,
  // Queens
  "Long Island City": 3800,
  "Astoria": 2800,
  "Sunnyside": 2400,
  "Woodside": 2200,
  "Jackson Heights": 2100,
  "Forest Hills": 2500,
  "Ridgewood": 2500,
  "Flushing": 2200,
  "Rego Park": 2200,
  // Bronx
  "Mott Haven": 2200,
  "Concourse": 1900,
  "Riverdale": 2100,
  "Fordham": 1800,
  "Pelham Bay": 1700,
  // Staten Island
  "St. George": 1800,
  "Stapleton": 1700,
  "Tompkinsville": 1700,
};

const LA: PriceMap = {
  "Santa Monica": 3600, "Venice": 3400, "Mar Vista": 2800, "Culver City": 2900,
  "Brentwood": 3500, "West LA": 2700, "Westwood": 2600, "Downtown LA": 2400,
  "Arts District": 3000, "Little Tokyo": 2300, "Chinatown": 2100, "Echo Park": 2400,
  "Silver Lake": 2600, "Los Feliz": 2500, "Highland Park": 2200, "Eagle Rock": 2100,
  "Mount Washington": 2100, "Sherman Oaks": 2400, "Studio City": 2600, "North Hollywood": 2200,
  "Burbank": 2300, "Glendale": 2200, "El Segundo": 2700, "Hermosa Beach": 3200,
  "Manhattan Beach": 3500, "Redondo Beach": 2700, "Hollywood": 2400, "West Hollywood": 2900,
  "Mid-City": 2100, "Koreatown": 2000,
};

const SF: PriceMap = {
  "Mission": 3400, "SoMa": 3500, "Hayes Valley": 3600, "Castro": 3400,
  "Nob Hill": 3300, "Russian Hill": 3700, "Marina": 3800, "Pacific Heights": 3900,
  "Sunset": 2700, "Richmond": 2700, "Oakland Downtown": 2400, "Rockridge": 2700,
  "Berkeley": 2500, "Emeryville": 2600, "Alameda": 2500, "South San Francisco": 2700,
  "San Mateo": 2900, "Burlingame": 3000, "Redwood City": 2900, "San Jose Downtown": 2600,
  "Mountain View": 3200, "Palo Alto": 3400, "Sunnyvale": 3000,
};

const CHI: PriceMap = {
  "Loop": 2400, "West Loop": 2700, "River North": 2600, "Streeterville": 2500,
  "Lincoln Park": 2200, "Lakeview": 2000, "Wicker Park": 2000, "Logan Square": 1900,
  "Bucktown": 2000, "Pilsen": 1700, "Hyde Park": 1500,
};

export const NEIGHBORHOOD_PRICES: Partial<Record<CityId, PriceMap>> = {
  nyc: NYC, la: LA, "sf-bay": SF, chicago: CHI,
};

export function getNeighborhoodPrice(city: CityId, name: string): number | null {
  return NEIGHBORHOOD_PRICES[city]?.[name] ?? null;
}

/**
 * Score a neighborhood vs. a budget range. Returns:
 *  - score: higher = better fit (0..1+ for in-range, negative for out-of-range)
 *  - fit: "in" | "below" | "above" | "unknown"
 */
export function scoreNeighborhood(
  price: number | null,
  range: [number, number] | null,
): { score: number; fit: "in" | "below" | "above" | "unknown" } {
  if (price === null) return { score: -Infinity, fit: "unknown" };
  if (!range) return { score: 0, fit: "unknown" };
  const [lo, hi] = range;
  if (price >= lo && price <= hi) {
    // Closer to the midpoint = higher score, but reward upper half slightly
    // (people usually pick neighborhoods near their max).
    const mid = (lo + hi) / 2;
    const span = Math.max(1, (hi - lo) / 2);
    const dist = Math.abs(price - mid) / span; // 0 at mid, 1 at edges
    return { score: 1 - dist * 0.5, fit: "in" };
  }
  if (price < lo) {
    const gap = (lo - price) / Math.max(1, lo);
    return { score: -gap, fit: "below" };
  }
  const gap = (price - hi) / Math.max(1, hi);
  return { score: -1 - gap, fit: "above" };
}
