import type { CityId } from "@/data/cities";

export interface SampleListing {
  id: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  neighborhood: string;
  belowMedianPct?: number;
  tag?: string; // "Likely RS", "Verified RS", etc.
  buildingNote?: string;
  image: string;
  coords?: [number, number]; // [lat, lng]
}

// Stable apartment/interior photos from Unsplash
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

const PHOTOS = [
  IMG("photo-1502672260266-1c1ef2d93688"),
  IMG("photo-1522708323590-d24dbb6b0267"),
  IMG("photo-1493809842364-78817add7ffb"),
  IMG("photo-1560448204-e02f11c3d0e2"),
  IMG("photo-1484154218962-a197022b5858"),
  IMG("photo-1502005229762-cf1b2da7c5d6"),
  IMG("photo-1505691938895-1758d7feb511"),
  IMG("photo-1554995207-c18c203602cb"),
  IMG("photo-1540518614846-7eded433c457"),
  IMG("photo-1486304873000-235643847519"),
  IMG("photo-1567767292278-a4f21aa2d36e"),
  IMG("photo-1598928506311-c55ded91a20c"),
];

export const SAMPLE_LISTINGS: Record<CityId, SampleListing[]> = {
  nyc: [
    { id: "nyc-1", address: "4520 Broadway, #5C",       rent: 1895, beds: 0, baths: 1, neighborhood: "Inwood",          belowMedianPct: 10, image: PHOTOS[0], coords: [40.867,-73.921] },
    { id: "nyc-2", address: "1241 Myrtle Ave, #2",      rent: 2100, beds: 1, baths: 1, neighborhood: "Bushwick",        belowMedianPct: 14, tag: "Likely RS", image: PHOTOS[1], coords: [40.694,-73.921] },
    { id: "nyc-3", address: "318 E 116th St, #4A",      rent: 2295, beds: 1, baths: 1, neighborhood: "East Harlem",     belowMedianPct: 9,  image: PHOTOS[2], coords: [40.795,-73.94] },
    { id: "nyc-4", address: "44-12 47th Ave, #3R",      rent: 2390, beds: 1, baths: 1, neighborhood: "Sunnyside",       belowMedianPct: 13, image: PHOTOS[3], coords: [40.744,-73.92] },
    { id: "nyc-5", address: "611 Franklin Ave, #2F",    rent: 2450, beds: 1, baths: 1, neighborhood: "Crown Heights",   belowMedianPct: 11, tag: "Verified RS", buildingNote: "Clean DOB record · 0 open 311", image: PHOTOS[4], coords: [40.668,-73.944] },
    { id: "nyc-6", address: "31-09 Steinway St, #4B",   rent: 2650, beds: 1, baths: 1, neighborhood: "Astoria",         belowMedianPct: 7,  image: PHOTOS[5], coords: [40.772,-73.93] },
    { id: "nyc-7", address: "880 Lafayette Ave, #3R",   rent: 2895, beds: 2, baths: 1, neighborhood: "Bedford-Stuyvesant", belowMedianPct: 12, tag: "Likely RS", image: PHOTOS[6], coords: [40.687,-73.941] },
    { id: "nyc-8", address: "315 Eastern Pkwy, #4F",    rent: 3200, beds: 2, baths: 1, neighborhood: "Crown Heights",   belowMedianPct: 12, tag: "Verified RS", buildingNote: "2 prior 311 complaints · resolved", image: PHOTOS[7], coords: [40.668,-73.944] },
    { id: "nyc-9", address: "55 Bedford Ave, #PH",      rent: 3450, beds: 1, baths: 1, neighborhood: "Williamsburg",    belowMedianPct: 8,  image: PHOTOS[8], coords: [40.708,-73.957] },
    { id: "nyc-10", address: "5-22 51st Ave, #11D",     rent: 3795, beds: 1, baths: 1, neighborhood: "Long Island City", belowMedianPct: 6, image: PHOTOS[9], coords: [40.748,-73.948] },
    { id: "nyc-11", address: "200 W 20th St, #615",     rent: 4695, beds: 1, baths: 1, neighborhood: "Chelsea",         belowMedianPct: 19, tag: "Likely RS", buildingNote: "Clean DOB record · 0 open 311", image: PHOTOS[10], coords: [40.747,-74.0] },
    { id: "nyc-12", address: "232 W 81st St, #4A",      rent: 5200, beds: 2, baths: 1, neighborhood: "Upper West Side", belowMedianPct: 14, image: PHOTOS[11], coords: [40.787,-73.975] },
  ],
  la: [
    { id: "la-1", address: "1247 N Vine St, #208", rent: 2495, beds: 1, baths: 1, neighborhood: "Hollywood",  belowMedianPct: 14, image: PHOTOS[0], coords: [34.092,-118.328] },
    { id: "la-2", address: "2300 Sunset Blvd, #5", rent: 1950, beds: 0, baths: 1, neighborhood: "Echo Park",  belowMedianPct: 18, image: PHOTOS[1], coords: [34.078,-118.26] },
    { id: "la-3", address: "918 N Western Ave, #3", rent: 1850, beds: 1, baths: 1, neighborhood: "Koreatown", belowMedianPct: 9, image: PHOTOS[2], coords: [34.062,-118.301] },
  ],
  "sf-bay": [
    { id: "sf-1", address: "1450 Valencia St, #3", rent: 3450, beds: 1, baths: 1, neighborhood: "Mission", belowMedianPct: 11, tag: "Rent controlled", image: PHOTOS[3], coords: [37.76,-122.418] },
    { id: "sf-2", address: "725 14th St, #2A",     rent: 2950, beds: 0, baths: 1, neighborhood: "Castro",  belowMedianPct: 8,  image: PHOTOS[4], coords: [37.762,-122.435] },
  ],
  chicago: [
    { id: "chi-1", address: "1820 N Damen Ave, #2R", rent: 1850, beds: 2, baths: 1, neighborhood: "Wicker Park", belowMedianPct: 16, image: PHOTOS[5], coords: [41.908,-87.677] },
    { id: "chi-2", address: "2440 N Lincoln Ave, #4", rent: 1650, beds: 1, baths: 1, neighborhood: "Lincoln Park", belowMedianPct: 11, image: PHOTOS[6] },
  ],
  dc: [
    { id: "dc-1", address: "1419 14th St NW, #401", rent: 2390, beds: 1, baths: 1, neighborhood: "Logan Circle", belowMedianPct: 10, image: PHOTOS[7] },
  ],
  boston: [
    { id: "bos-1", address: "62 Brighton Ave, #3", rent: 2750, beds: 2, baths: 1, neighborhood: "Allston", belowMedianPct: 13, image: PHOTOS[8] },
  ],
  seattle: [
    { id: "sea-1", address: "1421 E Pine St, #205", rent: 2150, beds: 1, baths: 1, neighborhood: "Capitol Hill", belowMedianPct: 9, image: PHOTOS[9] },
  ],
  miami: [
    { id: "mia-1", address: "725 NE 1st Ave, #18", rent: 2495, beds: 1, baths: 1, neighborhood: "Downtown", belowMedianPct: 15, image: PHOTOS[10] },
  ],
  austin: [
    { id: "aus-1", address: "1200 E 6th St, #B", rent: 1795, beds: 1, baths: 1, neighborhood: "East Austin", belowMedianPct: 12, image: PHOTOS[11] },
  ],
  philadelphia: [
    { id: "phi-1", address: "1822 Pine St, #2F", rent: 1495, beds: 1, baths: 1, neighborhood: "Rittenhouse", belowMedianPct: 17, image: PHOTOS[0] },
  ],
};
