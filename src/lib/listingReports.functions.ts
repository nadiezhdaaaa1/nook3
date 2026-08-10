import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const REPORT_REASONS = [
  "spam",
  "fraud",
  "duplicate",
  "wrong_price",
  "unavailable",
  "offensive",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const reportListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        listingRef: z.string().min(1).max(200),
        reason: z.enum(REPORT_REASONS),
        details: z.string().trim().max(1000).default(""),
        searchId: z.string().uuid().nullable().default(null),
        alertId: z.string().uuid().nullable().default(null),
        listing: z
          .object({
            title: z.string().max(200),
            neighborhood: z.string().max(120),
            price: z.number().int().min(0).max(1_000_000),
            beds: z.number().min(0).max(20),
            baths: z.number().min(0).max(20),
          })
          .partial()
          .default({}),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("listing_reports").insert({
      user_id: context.userId,
      search_id: data.searchId,
      alert_id: data.alertId,
      listing_ref: data.listingRef,
      listing: data.listing as never,
      reason: data.reason,
      details: data.details,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
