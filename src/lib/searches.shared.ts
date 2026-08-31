import { z } from "zod";

const triStateSchema = z.enum(["nice", "required"]);

export const searchInputSchema = z.object({
  name: z.string().trim().min(1).max(50),
  cityId: z.string().min(1).max(40),
  alertsEnabled: z.boolean().optional(),
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
  frequency: z.enum(["minimal", "balanced", "maximum", "weekly"]).optional(),
});

export const updateInputSchema = z.object({
  id: z.string().uuid(),
  patch: searchInputSchema.partial(),
});

export const searchIdSchema = z.object({ id: z.string().uuid() });

export function toDbRow(input: z.infer<typeof searchInputSchema>) {
  return {
    name: input.name,
    city_id: input.cityId,
    status: (input.alertsEnabled === false ? "paused" : "active") as "active" | "paused",
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
    frequency: input.frequency ?? "maximum",
  };
}

export function toUpdatePatch(p: Partial<z.infer<typeof searchInputSchema>>) {
  const patch: Record<string, unknown> = {};
  if (p.name !== undefined) patch.name = p.name;
  if (p.cityId !== undefined) patch.city_id = p.cityId;
  if (p.alertsEnabled !== undefined) {
    patch.status = (p.alertsEnabled ? "active" : "paused") as "active" | "paused";
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
  if (p.frequency !== undefined) patch.frequency = p.frequency;
  return patch;
}

export function dbRowToSearch(row: any) {
  return {
    id: row.id as string,
    name: row.name as string,
    cityId: row.city_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    alertsEnabled: row.status !== "paused",
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
    frequency: row.frequency ?? "maximum",
    totalAlertsReceived: 0,
    alertsLast7Days: 0,
    alertsToday: 0,
  };
}
