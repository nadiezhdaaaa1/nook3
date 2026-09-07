import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { dbRowToUser } from "@/lib/profile.functions";

/**
 * DEV-ONLY account state writer.
 *
 * `plan`, `billing_cycle`, `subscription_status`, `past_due_since`,
 * `has_ever_subscribed` and `dev_no_credentials` are protected by the
 * `prevent_billing_field_self_update` trigger, so they can only be written by
 * the service role through a SECURITY DEFINER routine — here
 * `dev_set_account_state()`.
 *
 * This endpoint must never be reachable in production: it would let any
 * authenticated user grant themselves a paid plan. The guard below refuses to
 * run outside development.
 */
const devStateSchema = z.object({
  plan: z.enum(["intro", "pro"]).optional(),
  billingCycle: z.enum(["monthly", "annual"]).optional(),
  status: z
    .enum(["none", "trialing", "active", "past_due", "canceled"])
    .optional(),
  /** Days ago that `past_due` started. 0 = today, 7 = grace period expired. */
  pastDueDayOffset: z.number().int().min(0).max(7).optional(),
  clearPastDue: z.boolean().optional(),
  onboarded: z.boolean().optional(),
  hasEverSubscribed: z.boolean().optional(),
  /** Simulates an account with no password and no linked social identity. */
  noCredentials: z.boolean().optional(),
});

export type DevAccountStateInput = z.infer<typeof devStateSchema>;

function assertNotProduction() {
  const env = process.env["NODE_ENV"] ?? "development";
  if (env === "production") {
    throw new Error("devSetAccountState is disabled in production builds");
  }
}

export const devSetAccountState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => devStateSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    assertNotProduction();

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const pastDueSince =
      data.pastDueDayOffset === undefined
        ? null
        : new Date(
            Date.now() - data.pastDueDayOffset * 24 * 60 * 60 * 1000,
          ).toISOString();

    const { data: rows, error } = await supabaseAdmin.rpc(
      "dev_set_account_state",
      {
        _user_id: context.userId,
        _plan: data.plan ?? null,
        _billing_cycle: data.billingCycle ?? null,
        _status: data.status ?? null,
        _past_due_since: pastDueSince,
        _clear_past_due: data.clearPastDue ?? false,
        _onboarded: data.onboarded ?? null,
        _has_ever_subscribed: data.hasEverSubscribed ?? null,
        _no_credentials: data.noCredentials ?? null,
      } as never,
    );
    if (error) throw new Error(error.message);
    const updated = Array.isArray(rows) ? rows[0] : rows;
    if (!updated) throw new Error("Profile not found");
    return dbRowToUser(updated);
  });

/* ------------------------------ dev digest ------------------------------ */

const BED_TOKEN_BEDS: Record<string, number> = {
  studio: 0,
  "1br": 1,
  "2br": 2,
  "3br": 3,
  "4br+": 4,
};

const BATH_TOKEN_MIN: Record<string, number> = {
  "1ba": 1,
  "1.5ba": 1.5,
  "2ba": 2,
  "2.5ba": 2.5,
};

const digestSchema = z.object({
  searchId: z.string().uuid(),
  count: z.number().int().min(1).max(50).optional(),
});

type CandidateRow = {
  slug: string;
  address: string;
  rent: number;
  beds: number;
  baths: number | null;
  neighborhood: string;
  tag: string | null;
  image: string | null;
  url: string | null;
  lat: number | null;
  lng: number | null;
  property_type: string | null;
  sqft: number | null;
  unit: string | null;
  addr_city: string | null;
  state: string | null;
  zip: string | null;
  listed_at: string | null;
  provider: string | null;
  description: string | null;
};

/** Stable pseudo-random rank so the mix varies per search but is repeatable. */
async function hashRank(seed: string): Promise<number> {
  const bytes = new TextEncoder().encode(seed);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const view = new DataView(digest);
  return view.getUint32(0);
}

function stripNulls<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

/**
 * DEV-ONLY digest simulator: inserts fresh `new` alerts for one of the caller's
 * own active searches, mirroring what the real digest job would deliver.
 */
export const devRunDigest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => digestSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    assertNotProduction();

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: search, error: searchError } = await supabaseAdmin
      .from("searches")
      .select(
        "id, user_id, city_id, status, budget_min, budget_max, bedrooms, bathrooms, neighborhoods",
      )
      .eq("id", data.searchId)
      .maybeSingle();
    if (searchError) throw new Error(searchError.message);
    if (!search || search.user_id !== context.userId) {
      throw new Error("Search not found");
    }
    if (search.status !== "active") {
      throw new Error("Search is not active");
    }

    const bedTokens = Array.isArray(search.bedrooms)
      ? (search.bedrooms as unknown[]).filter((t): t is string => typeof t === "string")
      : [];
    const bathMin = BATH_TOKEN_MIN[String(search.bathrooms)] ?? 1;
    const hoods = new Set(
      (Array.isArray(search.neighborhoods) ? search.neighborhoods : [])
        .filter((n): n is string => typeof n === "string")
        .map((n) => n.toLowerCase()),
    );

    let query = supabaseAdmin
      .from("listings")
      .select(
        "slug, address, rent, beds, baths, neighborhood, tag, image, url, lat, lng, property_type, sqft, unit, addr_city, state, zip, listed_at, provider, description",
      )
      .eq("city_id", search.city_id)
      .eq("status", "active");
    if (search.budget_min != null) query = query.gte("rent", search.budget_min);
    if (search.budget_max != null) query = query.lte("rent", search.budget_max);

    const { data: rawRows, error: listingsError } = await query.limit(3000);
    if (listingsError) throw new Error(listingsError.message);

    const candidates = ((rawRows ?? []) as unknown as CandidateRow[]).filter((l) => {
      const bedsOk =
        bedTokens.length === 0 ||
        bedTokens.some((t) => {
          const want = BED_TOKEN_BEDS[t];
          if (want === undefined) return false;
          return t === "4br+" ? l.beds >= 4 : l.beds === want;
        });
      if (!bedsOk) return false;
      if (l.baths != null && Number(l.baths) < bathMin) return false;
      return true;
    });

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("saved_alerts")
      .select("listing")
      .eq("user_id", context.userId)
      .eq("search_id", search.id);
    if (existingError) throw new Error(existingError.message);
    const taken = new Set(
      (existing ?? [])
        .map((r) => (r.listing as { title?: string } | null)?.title)
        .filter((t): t is string => typeof t === "string"),
    );

    const fresh = candidates.filter((l) => !taken.has(l.address));
    const ranked = await Promise.all(
      fresh.map(async (l) => ({
        l,
        preferred: hoods.size > 0 && hoods.has(l.neighborhood.toLowerCase()) ? 0 : 1,
        rank: await hashRank(`${l.slug}:${search.id}`),
      })),
    );
    ranked.sort((a, b) => a.preferred - b.preferred || a.rank - b.rank);

    const want = data.count ?? 30;
    const chosen = ranked.slice(0, want).map((r) => r.l);
    const skipped = candidates.length - fresh.length;

    if (chosen.length === 0) return { inserted: 0, skipped };

    const base = Date.now();
    const rows = chosen.map((l, i) => ({
      user_id: context.userId,
      search_id: search.id,
      status: "new" as const,
      created_at: new Date(base - (chosen.length - 1 - i) * 60_000).toISOString(),
      listing: stripNulls({
        title: l.address,
        neighborhood: l.neighborhood,
        beds: l.beds,
        baths: l.baths == null ? null : Number(l.baths),
        price: l.rent,
        receivedAt: new Date().toISOString(),
        source: l.provider ?? "nook",
        tags: l.tag ? [l.tag] : [],
        imageHue: 30,
        imageUrl: l.image,
        lat: l.lat,
        lng: l.lng,
        propertyType: l.property_type,
        sqft: l.sqft,
        unit: l.unit,
        city: l.addr_city,
        state: l.state,
        zip: l.zip,
        listedAt: l.listed_at ? new Date(l.listed_at).toISOString() : null,
        provider: l.provider,
        sourceUrl: l.url,
        description: l.description,
      }) as never,
    }));

    const { error: insertError } = await supabaseAdmin.from("saved_alerts").insert(rows);
    if (insertError) throw new Error(insertError.message);

    return { inserted: rows.length, skipped };
  });
