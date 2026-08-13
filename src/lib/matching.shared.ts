/**
 * Shared match logic — the single definition of "this listing matches this
 * saved search". Used by the digest/freshness counts so a number shown next to
 * a pay button survives the first digest.
 */
import type { Search } from "@/lib/store/types";
import type { SampleListing } from "@/data/sampleListings";
import { applyFilters, deriveFilterScope, defaultFilters } from "@/lib/app/filters";

/** Listings that satisfy the saved search itself (no extra UI narrowing). */
export function matchesForSearch(
  listings: SampleListing[],
  search: Search,
): SampleListing[] {
  const scope = deriveFilterScope(search);
  const base = defaultFilters(scope);
  return applyFilters(
    listings,
    {
      ...base,
      bedrooms: search.bedrooms ?? [],
      bathrooms: search.bathrooms ?? null,
      neighborhoods: search.neighborhoods ?? [],
      amenities: scope.requiredAmenities,
      transit: scope.requiredTransit,
      noFeeOnly: search.includeBrokerFee === false,
    },
    scope,
  );
}

export function countMatchesForSearch(listings: SampleListing[], search: Search): number {
  return matchesForSearch(listings, search).length;
}
