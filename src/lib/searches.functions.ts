import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const triStateSchema = z.enum(["nice", "required"]);

const searchInputSchema = z.object({
  name: z.string().trim().min(1).max(50),
  cityId: z.string().min(1).max(40),
  status: z.enum(["active", "paused", "archived"]).optional(),
  budget: z.tuple([z.number().int().min(0), z.number().int().min(0)]).nullable().optional(),
  moveIn: z
    .object({
      mode: z.enum(["specific", "flexible"]),
      date: z.string().optional(),
    })
    .optional(),
  bedrooms: z.array(z.string()).max(20).optional(),
  bathrooms: z.string().max(20).optional(),
  rentProtection: z.enum(["all", "likely", "verified"]).optional(),
  includeBrokerFee: z.boolean().optional(),
  neighborhoods: z.array(z.string()).max(100).optional(),
  amenities: z.record(z.string(), triStateSchema).optional(),
  transit: z
    .object({
      hasPreference: z.boolean(),
      lines: z.record(z.string(), triStateSchema),
    })
    .optional(),
  commute: z.object({ maxMinutes: z.number().int().min(5).max(120).nullable() }).optional(),
  alertChannel: z.literal("email").optional(),
  frequency: z.enum(["minimal", "balanced", "maximum", "weekly"]).optional(),
});

function toDbRow(input: z.infer<typeof searchInputSchema>) {
  return {
    name: input.name,
    city_id: input.cityId,
    status: input.status ?? "active",
    budget_min: input.budget?.[0] ?? null,
    budget_max: input.budget?.[1] ?? null,
    move_in: input.moveIn ?? { mode: "flexible" },
    bedrooms: input.bedrooms ?? [],
    bathrooms: input.bathrooms ?? "1ba",
    rent_protection: input.rentProtection ?? "all",
    include_broker_fee: input.includeBrokerFee ?? true,
    neighborhoods: input.neighborhoods ?? [],
    amenities: input.amenities ?? {},
    transit: input.transit ?? { hasPreference: false, lines: {} },
    commute: input.commute ?? { maxMinutes: null },
    alert_channel: input.alertChannel ?? "email",
    frequency: input.frequency ?? "balanced",
  };
}

export function dbRowToSearch(row: any) {
  return {
    id: row.id as string,
    name: row.name as string,
    cityId: row.city_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    status: row.status as "active" | "paused" | "archived",
    archivedAt: row.archived_at ?? undefined,
    budget:
      row.budget_min != null && row.budget_max != null
        ? ([row.budget_min, row.budget_max] as [number, number])
        : null,
    moveIn: row.move_in ?? { mode: "flexible" },
    bedrooms: (row.bedrooms ?? []) as string[],
    bathrooms: row.bathrooms ?? "1ba",
    rentProtection: row.rent_protection ?? "all",
    includeBrokerFee: row.include_broker_fee ?? true,
    neighborhoods: (row.neighborhoods ?? []) as string[],
    amenities: row.amenities ?? {},
    transit: row.transit ?? { hasPreference: false, lines: {} },
    commute: row.commute ?? { maxMinutes: null },
    alertChannel: row.alert_channel ?? "email",
    frequency: row.frequency ?? "balanced",
    totalAlertsReceived: 0,
    alertsLast7Days: 0,
    alertsToday: 0,
  };
}

export const listSearches = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("searches")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(dbRowToSearch);
  });

export const createSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => searchInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const row = { ...toDbRow(data), user_id: context.userId };
    const { data: inserted, error } = await context.supabase
      .from("searches")
      .insert(row)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A search with that name already exists.");
      if (error.message?.includes("Plan quota")) throw new Error(error.message);
      throw new Error(error.message);
    }
    return dbRowToSearch(inserted);
  });

const updateInputSchema = z.object({
  id: z.string().uuid(),
  patch: searchInputSchema.partial(),
});

export const updateSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {};
    const p = data.patch;
    if (p.name !== undefined) patch.name = p.name;
    if (p.cityId !== undefined) patch.city_id = p.cityId;
    if (p.status !== undefined) {
      patch.status = p.status;
      patch.archived_at = p.status === "archived" ? new Date().toISOString() : null;
    }
    if (p.budget !== undefined) {
      patch.budget_min = p.budget?.[0] ?? null;
      patch.budget_max = p.budget?.[1] ?? null;
    }
    if (p.moveIn !== undefined) patch.move_in = p.moveIn;
    if (p.bedrooms !== undefined) patch.bedrooms = p.bedrooms;
    if (p.bathrooms !== undefined) patch.bathrooms = p.bathrooms;
    if (p.rentProtection !== undefined) patch.rent_protection = p.rentProtection;
    if (p.includeBrokerFee !== undefined) patch.include_broker_fee = p.includeBrokerFee;
    if (p.neighborhoods !== undefined) patch.neighborhoods = p.neighborhoods;
    if (p.amenities !== undefined) patch.amenities = p.amenities;
    if (p.transit !== undefined) patch.transit = p.transit;
    if (p.commute !== undefined) patch.commute = p.commute;
    if (p.alertChannel !== undefined) patch.alert_channel = p.alertChannel;
    if (p.frequency !== undefined) patch.frequency = p.frequency;

    const { data: updated, error } = await context.supabase
      .from("searches")
      .update(patch as never)
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A search with that name already exists.");
      throw new Error(error.message);
    }
    return dbRowToSearch(updated);
  });

export const deleteSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("searches")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: src, error: fetchErr } = await context.supabase
      .from("searches")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .single();
    if (fetchErr || !src) throw new Error("Search not found");
    const { id, created_at, updated_at, ...rest } = src as any;
    const copyName = `${src.name} copy`.slice(0, 50);
    const { data: inserted, error } = await context.supabase
      .from("searches")
      .insert({ ...rest, name: copyName, status: "active", archived_at: null })
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A copy already exists. Rename it first.");
      if (error.message?.includes("Plan quota")) throw new Error(error.message);
      throw new Error(error.message);
    }
    return dbRowToSearch(inserted);
  });
