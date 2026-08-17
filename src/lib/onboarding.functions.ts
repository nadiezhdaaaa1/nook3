import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const triStateSchema = z.enum(["nice", "required"]);

const searchPayloadSchema = z.object({
  name: z.string().trim().min(1).max(50),
  cityId: z.string().min(1).max(40),
  budget: z.tuple([z.number().int().min(0), z.number().int().min(0)]).nullable().optional(),
  moveIn: z
    .object({ mode: z.enum(["specific", "flexible"]), date: z.string().optional() })
    .optional(),
  bedrooms: z.array(z.string()).max(20).optional(),
  bathrooms: z.string().max(20).optional(),
  rentProtection: z.enum(["all", "likely", "verified"]).optional(),
  includeBrokerFee: z.boolean().optional(),
  neighborhoods: z.array(z.string()).max(100).optional(),
  amenities: z.record(z.string(), triStateSchema).optional(),
  transit: z
    .object({ hasPreference: z.boolean(), lines: z.record(z.string(), triStateSchema) })
    .optional(),
  commute: z.object({ maxMinutes: z.number().int().min(5).max(120).nullable() }).optional(),
  frequency: z.enum(["minimal", "balanced", "maximum", "weekly"]).optional(),
});

const commitSchema = z.object({
  search: searchPayloadSchema.nullable().optional(),
});

/**
 * Finish onboarding in ONE server round-trip: write the first search and set
 * `completed_at` together inside a single SQL routine, so a partial write can
 * never leave an "onboarded" account with no search. The routine is a no-op for
 * the search when the account already owns one.
 */
export const commitOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => commitSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const s = data.search;
    const searchJson = s
      ? {
          name: s.name,
          city_id: s.cityId,
          status: "active",
          budget_min: s.budget?.[0] ?? null,
          budget_max: s.budget?.[1] ?? null,
          move_in: s.moveIn ?? { mode: "flexible" },
          bedrooms: s.bedrooms ?? [],
          bathrooms: s.bathrooms ?? "1ba",
          rent_protection: s.rentProtection ?? "all",
          include_broker_fee: s.includeBrokerFee ?? true,
          neighborhoods: s.neighborhoods ?? [],
          amenities: s.amenities ?? {},
          transit: s.transit ?? { hasPreference: false, lines: {} },
          commute: s.commute ?? { maxMinutes: null },
          frequency: s.frequency ?? "balanced",
        }
      : null;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("commit_onboarding", {
      _user_id: context.userId,
      _search: searchJson,
    } as never);
    if (error) throw new Error(error.message);

    const out = (result ?? {}) as { searchId?: string | null; completedAt?: string | null };
    return {
      searchId: out.searchId ?? null,
      completedAt: out.completedAt ?? null,
    };
  });

/* -------------------------------------------------------------------------
   Freshness counts for the reactivation variant. Uses the same match logic
   the digest uses; falls back from 24h to a 7-day window and finally to no
   number at all — never a zero next to a pay button.
   ------------------------------------------------------------------------- */

export interface SearchFreshness {
  searchId: string;
  name: string;
  cityId: string;
  count: number | null;
  window: "24h" | "7d" | null;
}

export const getSearchFreshness = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SearchFreshness[]> => {
    const { dbRowToSearch } = await import("@/lib/searches.shared");
    const { countMatchesForSearch } = await import("@/lib/matching.shared");

    const { data: rows, error } = await context.supabase
      .from("searches")
      .select("*")
      .neq("status", "archived")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const searches = (rows ?? []).map(dbRowToSearch);
    if (searches.length === 0) return [];

    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabasePublic = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input as RequestInfo, { ...init, headers: h });
        },
      },
    });

    const cities = [...new Set(searches.map((s) => s.cityId))];
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const byCity = new Map<string, { day: any[]; week: any[] }>();
    for (const cityId of cities) {
      const { data: listings } = await supabasePublic
        .from("listings")
        .select(
          "id, address, rent, beds, baths, neighborhood, tag, image, created_at",
        )
        .eq("city_id", cityId)
        .eq("status", "active")
        .gte("created_at", since7d)
        .limit(1000);
      const week = (listings ?? []).map((r: any) => ({
        id: r.id,
        address: r.address,
        rent: r.rent,
        beds: r.beds,
        baths: Number(r.baths),
        neighborhood: r.neighborhood,
        tag: r.tag ?? undefined,
        image: r.image,
        createdAt: r.created_at as string,
      }));
      byCity.set(cityId, {
        week,
        day: week.filter((l) => l.createdAt >= since24h),
      });
    }

    return searches.map((s) => {
      const pool = byCity.get(s.cityId) ?? { day: [], week: [] };
      const day = countMatchesForSearch(pool.day as never, s as never);
      if (day > 0) return { searchId: s.id, name: s.name, cityId: s.cityId, count: day, window: "24h" as const };
      const week = countMatchesForSearch(pool.week as never, s as never);
      if (week > 0) return { searchId: s.id, name: s.name, cityId: s.cityId, count: week, window: "7d" as const };
      return { searchId: s.id, name: s.name, cityId: s.cityId, count: null, window: null };
    });
  });
