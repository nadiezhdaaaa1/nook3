import { z } from "zod";

export const ALERT_STATUSES = ["new", "saved", "contacted", "dismissed"] as const;
export type AlertStatusDb = (typeof ALERT_STATUSES)[number];

export const listingSchema = z.object({
  title: z.string().max(200),
  neighborhood: z.string().max(120),
  beds: z.number().int().min(0).max(20),
  // Old snapshots always carry baths; new ones may omit it when unknown.
  baths: z.number().min(0).max(20).nullable().optional(),
  price: z.number().int().min(0).max(1_000_000),
  receivedAt: z.string().max(40),
  source: z.string().max(60),
  tags: z.array(z.string().max(40)).max(20),
  imageHue: z.number().int().min(0).max(360),
  imageUrl: z.string().url().max(500).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  // Added in NPI-656; all optional so pre-existing snapshots keep parsing.
  propertyType: z.enum(["apartment", "condo", "house", "townhouse"]).optional(),
  sqft: z.number().int().min(0).max(100_000).nullable().optional(),
  unit: z.string().max(40).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(40).optional(),
  zip: z.string().max(20).optional(),
  listedAt: z.string().max(40).optional(),
  provider: z.string().max(80).optional(),
  description: z.string().max(4000).optional(),
  sourceUrl: z.string().url().max(1000).optional(),
});


export type AlertListing = z.infer<typeof listingSchema>;

export type AlertRow = {
  id: string;
  searchId: string | null;
  status: AlertStatusDb;
  snoozedUntil: string | null;
  createdAt: string;
  dismissReason: string | null;
  listing: AlertListing;
};

export type PaginatedAlertsResult = {
  alerts: AlertRow[];
  total: number;
};

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
});

export function rowToAlert(row: any): AlertRow {
  return {
    id: row.id,
    searchId: row.search_id ?? null,
    status: row.status,
    snoozedUntil: row.snoozed_until ?? null,
    createdAt: row.created_at,
    dismissReason: row.dismiss_reason ?? null,
    listing: row.listing,
  };
}
