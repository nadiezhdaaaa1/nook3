import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import type { SampleListing } from "@/data/sampleListings";

const inputSchema = z.object({
  cityId: z.string().min(1),
  limit: z.number().int().min(1).max(6000).optional(),
});

/**
 * Public catalog read: active listings for a city.
 * Uses the publishable key (anon) client — listings are public data.
 */
export const listCityListings = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<SampleListing[]> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input as RequestInfo, { ...init, headers: h });
        },
      },
    });

    // PostgREST caps a single response (default 1000 rows), so page through
    // explicit ranges until we have the whole city catalog.
    const target = data.limit ?? 6000;
    const PAGE = 1000;
    const rows: Record<string, unknown>[] = [];

    for (let from = 0; from < target; from += PAGE) {
      const to = Math.min(from + PAGE, target) - 1;
      const { data: chunk, error } = await supabase
        .from("listings")
        .select(
          "slug, address, rent, beds, baths, neighborhood, below_median_pct, tag, building_note, image, url, lat, lng, amenities",
        )
        .eq("city_id", data.cityId)
        .eq("status", "active")
        .order("rent", { ascending: true })
        .order("slug", { ascending: true })
        .range(from, to);

      if (error) {
        console.error("[listCityListings]", error.message);
        break;
      }
      if (!chunk || chunk.length === 0) break;
      rows.push(...(chunk as unknown as Record<string, unknown>[]));
      if (chunk.length < to - from + 1) break;
    }


    return (rows ?? []).map((r) => ({
      id: r.slug,
      address: r.address,
      rent: r.rent,
      beds: r.beds,
      baths: Number(r.baths),
      neighborhood: r.neighborhood,
      belowMedianPct: r.below_median_pct ?? undefined,
      tag: r.tag ?? undefined,
      buildingNote: r.building_note ?? undefined,
      image: r.image,
      url: r.url ?? undefined,
      coords:
        r.lat != null && r.lng != null ? ([r.lat, r.lng] as [number, number]) : undefined,
      amenities: Array.isArray(r.amenities) ? (r.amenities as string[]) : undefined,
    }));
  });
