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

/* -------------------------------------------------------------------------
   Digest entitlement. The digest engine MUST key off entitlement, never off
   search existence: a canceled account can hold three perfectly valid
   searches and nothing should send.
   ------------------------------------------------------------------------- */

export interface DigestEntitlement {
  subscriptionStatus?: string | null;
  completedAt?: string | null;
  deletionScheduledAt?: string | null;
}

export function isDigestEntitled(profile: DigestEntitlement | null | undefined): boolean {
  if (!profile) return false;
  if (profile.deletionScheduledAt) return false;
  // Setup unfinished means the trial clock hasn't started yet.
  if (!profile.completedAt) return false;
  const s = profile.subscriptionStatus ?? "none";
  return s === "active" || s === "trialing" || s === "past_due";
}
