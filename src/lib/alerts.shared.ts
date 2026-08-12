import { z } from "zod";

export const ALERT_STATUSES = ["new", "saved", "contacted", "dismissed"] as const;
export type AlertStatusDb = (typeof ALERT_STATUSES)[number];

export const listingSchema = z.object({
  title: z.string().max(200),
  neighborhood: z.string().max(120),
  beds: z.number().int().min(0).max(20),
  baths: z.number().min(0).max(20),
  price: z.number().int().min(0).max(1_000_000),
  receivedAt: z.string().max(40),
  source: z.string().max(60),
  tags: z.array(z.string().max(40)).max(20),
  imageHue: z.number().int().min(0).max(360),
  imageUrl: z.string().url().max(500).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
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
