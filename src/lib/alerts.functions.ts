import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ALERT_STATUSES,
  listingSchema,
  paginationSchema,
  rowToAlert,
} from "@/lib/alerts.shared";
import type { PaginatedAlertsResult } from "@/lib/alerts.shared";


export type {
  AlertStatusDb,
  AlertListing,
  AlertRow,
  PaginatedAlertsResult,
} from "@/lib/alerts.shared";


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



export const listAlertsPage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => paginationSchema.parse(input))
  .handler(async ({ data, context }) => {
    const [{ count }, { data: rows, error }] = await Promise.all([
      context.supabase
        .from("saved_alerts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", context.userId),
      context.supabase
        .from("saved_alerts")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .range(data.offset, data.offset + data.limit - 1),
    ]);
    if (error) throw new Error(error.message);
    return {
      alerts: (rows ?? []).map(rowToAlert),
      total: count ?? 0,
    } satisfies PaginatedAlertsResult;
  });

export const updateAlertStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(ALERT_STATUSES),
        dismissReason: z.string().max(200).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase
      .from("saved_alerts")
      .update({
        status: data.status,
        ...(data.dismissReason !== undefined
          ? { dismiss_reason: data.dismissReason }
          : data.status !== "dismissed"
            ? { dismiss_reason: null }
            : {}),
      } as never)
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
        searchId: z.string().uuid(),
        listing: listingSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: inserted, error } = await context.supabase
      .from("saved_alerts")
      .insert({
        user_id: context.userId,
        search_id: data.searchId,
        listing: data.listing as never,
        status: "new",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToAlert(inserted);
  });

/**
 * Save a listing that has no alert row yet (e.g. a sample/market listing shown
 * on the home screen). Creates the row directly in the "saved" state.
 */
export const saveListingSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        searchId: z.string().uuid(),
        listing: listingSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: inserted, error } = await context.supabase
      .from("saved_alerts")
      .insert({
        user_id: context.userId,
        search_id: data.searchId,
        listing: data.listing as never,
        status: "saved",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToAlert(inserted);
  });

/**
 * Dismiss ("dislike") a listing that has no alert row yet (e.g. a sample/market
 * listing on the home screen). Creates the row directly in the "dismissed"
 * state so it shows up on the Disliked listings tab and stays hidden on home.
 */
export const dismissListingSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        searchId: z.string().uuid(),
        listing: listingSchema,
        dismissReason: z.string().max(200).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: inserted, error } = await context.supabase
      .from("saved_alerts")
      .insert({
        user_id: context.userId,
        search_id: data.searchId,
        listing: data.listing as never,
        status: "dismissed",
        dismiss_reason: data.dismissReason ?? null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToAlert(inserted);
  });
