export type AlertStatus = "new" | "saved" | "contacted" | "dismissed";
export type AlertSource = "StreetEasy" | "Zillow" | "Craigslist" | "Private landlord" | "Apartments.com" | "RentHop";

export interface SavedAlert {
  id: string;
  /** Owning search id — optional in legacy mock data; required for new alerts. */
  searchId?: string;
  title: string;
  neighborhood: string;
  beds: number;
  baths: number;
  price: number;
  receivedAt: string; // ISO
  source: AlertSource;
  status: AlertStatus;
  tags: string[]; // e.g. ["rent-stabilized", "no-fee", "dog-friendly", "laundry"]
  imageHue: number; // 0-360 for placeholder swatch (fallback)
  imageUrl?: string; // real photo preview
}

/** Stable pool of apartment interior photos (Unsplash). */
const APARTMENT_PHOTOS = [
  "photo-1502672260266-1c1ef2d93688",
  "photo-1493809842364-78817add7ffb",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1554995207-c18c203602cb",
  "photo-1522708323590-d24dbb6b0267",
  "photo-1484154218962-a197022b5858",
  "photo-1505691938895-1758d7feb511",
  "photo-1567767292278-a4f21aa2d36e",
  "photo-1513694203232-719a280e022f",
  "photo-1556909114-f6e7ad7d3136",
  "photo-1502005229762-cf1b2da7c5d6",
  "photo-1583847268964-b28dc8f51f92",
];

export function apartmentPhotoUrl(seed: string, w = 240): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const id = APARTMENT_PHOTOS[Math.abs(h) % APARTMENT_PHOTOS.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
}

const NEIGHBORHOODS = [
  "Williamsburg", "Bushwick", "Astoria", "LES", "Crown Heights",
  "Park Slope", "Greenpoint", "Bed-Stuy", "Long Island City", "Harlem",
  "East Village", "Ridgewood", "Sunset Park", "Fort Greene", "Inwood",
];
const SOURCES: AlertSource[] = ["StreetEasy", "Zillow", "Craigslist", "Private landlord", "Apartments.com", "RentHop"];
const TAGS_POOL = ["rent-stabilized", "no-fee", "dog-friendly", "laundry", "dishwasher", "elevator", "private outdoor"];

function pseudo(seed: number) {
  // deterministic 0..1
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const SAVED_ALERTS: SavedAlert[] = Array.from({ length: 25 }, (_, i) => {
  const r = (n: number) => pseudo(i * 7 + n);
  const beds = [0, 1, 1, 1, 2, 2, 3][Math.floor(r(1) * 7)];
  const price = 1800 + Math.floor(r(2) * 35) * 100;
  const daysAgo = Math.floor(r(3) * 28);
  const date = new Date(Date.now() - daysAgo * 86400000 - Math.floor(r(4) * 86400000));
  const status: AlertStatus =
    i < 3 ? "new" : r(5) < 0.35 ? "saved" : r(6) < 0.5 ? "dismissed" : r(7) < 0.5 ? "contacted" : "new";
  const nb = NEIGHBORHOODS[i % NEIGHBORHOODS.length];
  const source = SOURCES[Math.floor(r(8) * SOURCES.length)];
  const tagCount = 1 + Math.floor(r(9) * 3);
  const tags = Array.from(new Set(Array.from({ length: tagCount }, (_, k) => TAGS_POOL[Math.floor(pseudo(i * 13 + k) * TAGS_POOL.length)])));
  return {
    id: `alert-${i + 1}`,
    title: `${beds === 0 ? "Studio" : `${beds}BR`} on ${["Bedford", "Marcy", "Grand", "Wythe", "Lorimer", "Driggs", "DeKalb"][i % 7]} Ave`,
    neighborhood: nb,
    beds,
    baths: beds === 0 ? 1 : Math.min(beds, 1 + (r(10) > 0.7 ? 1 : 0)),
    price,
    receivedAt: date.toISOString(),
    source,
    status,
    tags,
    imageHue: Math.floor(r(11) * 360),
  };
});
