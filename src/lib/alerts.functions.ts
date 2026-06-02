import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ALERT_STATUSES = ["new", "saved", "contacted", "dismissed"] as const;
export type AlertStatusDb = (typeof ALERT_STATUSES)[number];

const listingSchema = z
  .object({
    title: z.string().max(200),
    neighborhood: z.string().max(120),
    beds: z.number().int().min(0).max(20),
    baths: z.number().min(0).max(20),
    price: z.number().int().min(0).max(1_000_000),
    receivedAt: z.string().max(40),
    source: z.string().max(60),
    tags: z.array(z.string().max(40)).max(20),
    imageHue: z.number().int().min(0).max(360),
  })
  .passthrough();

export type AlertRow = {
  id: string;
  searchId: string | null;
  status: AlertStatusDb;
  snoozedUntil: string | null;
  createdAt: string;
  listing: z.infer<typeof listingSchema>;
};

function rowToAlert(row: any): AlertRow {
  return {
    id: row.id,
    searchId: row.search_id ?? null,
    status: row.status,
    snoozedUntil: row.snoozed_until ?? null,
    createdAt: row.created_at,
    listing: row.listing,
  };
}

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("saved_alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToAlert);
  });

export const updateAlertStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(ALERT_STATUSES),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase
      .from("saved_alerts")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToAlert(updated);
  });

export const snoozeAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        // null clears the snooze; otherwise ISO timestamp in the future
        snoozedUntil: z.string().datetime().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase
      .from("saved_alerts")
      .update({ snoozed_until: data.snoozedUntil })
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToAlert(updated);
  });

export const deleteAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_alerts")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        searchId: z.string().uuid().nullable().optional(),
        listing: listingSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: inserted, error } = await context.supabase
      .from("saved_alerts")
      .insert({
        user_id: context.userId,
        search_id: data.searchId ?? null,
        listing: data.listing,
        status: "new",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToAlert(inserted);
  });
