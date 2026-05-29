import type { CityId } from "@/data/cities";

export interface SampleListing {
  address: string;
  rent: number;
  beds: number;
  baths: number;
  neighborhood: string;
  belowMedianPct?: number;
  tag?: string; // "Likely RS", "Verified RS", etc.
  buildingNote?: string; // building-data line, if city supports it
}

export const SAMPLE_LISTINGS: Record<CityId, SampleListing[]> = {
  nyc: [
    { address: "200 W 20th St, #615", rent: 4695, beds: 1, baths: 1, neighborhood: "Chelsea", belowMedianPct: 19, tag: "Likely RS", buildingNote: "Clean DOB record · 0 open 311" },
    { address: "315 Eastern Pkwy, #4F", rent: 3200, beds: 2, baths: 1, neighborhood: "Crown Heights", belowMedianPct: 12, tag: "Verified RS", buildingNote: "2 prior 311 complaints · resolved" },
  ],
  la: [
    { address: "1247 N Vine St, #208", rent: 2495, beds: 1, baths: 1, neighborhood: "Hollywood", belowMedianPct: 14 },
    { address: "2300 Sunset Blvd, #5", rent: 1950, beds: 0, baths: 1, neighborhood: "Echo Park", belowMedianPct: 18 },
  ],
  "sf-bay": [
    { address: "1450 Valencia St, #3", rent: 3450, beds: 1, baths: 1, neighborhood: "Mission", belowMedianPct: 11, tag: "Rent controlled" },
  ],
  chicago: [
    { address: "1820 N Damen Ave, #2R", rent: 1850, beds: 2, baths: 1, neighborhood: "Wicker Park", belowMedianPct: 16 },
  ],
  dc: [
    { address: "1419 14th St NW, #401", rent: 2390, beds: 1, baths: 1, neighborhood: "Logan Circle", belowMedianPct: 10 },
  ],
  boston: [
    { address: "62 Brighton Ave, #3", rent: 2750, beds: 2, baths: 1, neighborhood: "Allston", belowMedianPct: 13 },
  ],
  seattle: [
    { address: "1421 E Pine St, #205", rent: 2150, beds: 1, baths: 1, neighborhood: "Capitol Hill", belowMedianPct: 9 },
  ],
  miami: [
    { address: "725 NE 1st Ave, #18", rent: 2495, beds: 1, baths: 1, neighborhood: "Downtown", belowMedianPct: 15 },
  ],
  austin: [
    { address: "1200 E 6th St, #B", rent: 1795, beds: 1, baths: 1, neighborhood: "East Austin", belowMedianPct: 12 },
  ],
  philadelphia: [
    { address: "1822 Pine St, #2F", rent: 1495, beds: 1, baths: 1, neighborhood: "Rittenhouse", belowMedianPct: 17 },
  ],
};
