import type { Search } from "@/lib/store/types";
import type { SampleListing } from "@/data/sampleListings";
import { findAmenity } from "@/data/amenities";
import { getCity } from "@/data/cities";

export const BED_OPTIONS = [
  { id: "studio", label: "Studio", beds: 0 },
  { id: "1br", label: "1 bed", beds: 1 },
  { id: "2br", label: "2 bed", beds: 2 },
  { id: "3br", label: "3 bed", beds: 3 },
  { id: "4br+", label: "4+ bed", beds: 4 },
] as const;

export const BATH_OPTIONS = [
  { id: "1ba", label: "1", baths: 1 },
  { id: "1.5ba", label: "1.5", baths: 1.5 },
  { id: "2ba", label: "2", baths: 2 },
  { id: "2.5ba", label: "2.5+", baths: 2.5 },
] as const;

export function bedLabel(id: string): string {
  return BED_OPTIONS.find((b) => b.id === id)?.label ?? id;
}

export function bathLabel(id: string): string {
  return BATH_OPTIONS.find((b) => b.id === id)?.label ?? id;
}

function bathValue(id: string): number {
  return BATH_OPTIONS.find((b) => b.id === id)?.baths ?? 1;
}

/** What the saved search allows — filters may only narrow inside this. */
export interface FilterScope {
  budget: [number, number] | null;
  budgetStep: number;
  bedrooms: string[];
  bathrooms: string[];
  /** Minimum bathrooms saved on the search. */
  bathroomsMin: string;
  neighborhoods: string[];
  /** Amenities the search marked "required" — always applied, not togglable. */
  requiredAmenities: string[];
  /** Amenities the search marked "nice to have" — can be promoted to a filter. */
  optionalAmenities: string[];
  requiredTransit: string[];
  optionalTransit: string[];
  transitLabels: Record<string, string>;
  /** True when the search allows broker-fee listings (so "no fee only" is offered). */
  canNarrowBrokerFee: boolean;
  hasScope: boolean;
}

export interface MatchFilters {
  budget: [number, number] | null;
  bedrooms: string[];
  bathrooms: string | null;
  neighborhoods: string[];
  amenities: string[];
  transit: string[];
  noFeeOnly: boolean;
}

export function deriveFilterScope(search: Search | null): FilterScope {
  if (!search) {
    return {
      budget: null,
      budgetStep: 50,
      bedrooms: [],
      bathrooms: [],
      bathroomsMin: "1ba",
      neighborhoods: [],
      requiredAmenities: [],
      optionalAmenities: [],
      requiredTransit: [],
      optionalTransit: [],
      transitLabels: {},
      canNarrowBrokerFee: false,
      hasScope: false,
    };
  }

  const city = getCity(search.cityId);
  const minIdx = Math.max(
    0,
    BATH_OPTIONS.findIndex((b) => b.id === search.bathrooms),
  );

  const amenityEntries = Object.entries(search.amenities ?? {});
  const transitEntries = Object.entries(search.transit?.lines ?? {});
  const transitLabels: Record<string, string> = {};
  for (const line of city?.transit.lines ?? []) transitLabels[line.id] = line.label;

  const bedrooms = [...(search.bedrooms ?? [])].sort(
    (a, b) =>
      BED_OPTIONS.findIndex((o) => o.id === a) - BED_OPTIONS.findIndex((o) => o.id === b),
  );

  return {
    budget: search.budget,
    budgetStep: city?.budget.step ?? 50,
    bedrooms,
    bathrooms: BATH_OPTIONS.slice(minIdx).map((b) => b.id),
    bathroomsMin: search.bathrooms,
    neighborhoods: [...(search.neighborhoods ?? [])].sort((a, b) => a.localeCompare(b)),
    requiredAmenities: amenityEntries.filter(([, v]) => v === "required").map(([k]) => k),
    optionalAmenities: amenityEntries.filter(([, v]) => v !== "required").map(([k]) => k),
    requiredTransit: transitEntries.filter(([, v]) => v === "required").map(([k]) => k),
    optionalTransit: transitEntries.filter(([, v]) => v !== "required").map(([k]) => k),
    transitLabels,
    canNarrowBrokerFee: Boolean(search.includeBrokerFee),
    hasScope: Boolean(search.budget) || (search.neighborhoods ?? []).length > 0,
  };
}

export function defaultFilters(scope: FilterScope): MatchFilters {
  return {
    budget: scope.budget ? [scope.budget[0], scope.budget[1]] : null,
    bedrooms: [],
    bathrooms: null,
    neighborhoods: [],
    amenities: [],
    transit: [],
    noFeeOnly: false,
  };
}

/** True when the user narrowed anything beyond the saved search itself. */
export function activeFilterCount(filters: MatchFilters, scope: FilterScope): number {
  let n = 0;
  if (
    scope.budget &&
    filters.budget &&
    (filters.budget[0] > scope.budget[0] || filters.budget[1] < scope.budget[1])
  ) {
    n += 1;
  }
  if (filters.bedrooms.length > 0) n += 1;
  if (filters.bathrooms && filters.bathrooms !== scope.bathroomsMin) n += 1;
  if (filters.neighborhoods.length > 0) n += 1;
  n += filters.amenities.length;
  n += filters.transit.length;
  if (filters.noFeeOnly) n += 1;
  return n;
}

function matchesBeds(listing: SampleListing, ids: string[]): boolean {
  if (ids.length === 0) return true;
  return ids.some((id) => {
    const opt = BED_OPTIONS.find((o) => o.id === id);
    if (!opt) return false;
    return id === "4br+" ? listing.beds >= 4 : listing.beds === opt.beds;
  });
}

const NO_FEE_TAGS = ["no fee", "no-fee", "nofee"];

function listingTags(listing: SampleListing): string[] {
  return (listing.tag ? [listing.tag] : []).map((t) => t.toLowerCase());
}

/** Amenity/transit matching is tag-based — listings only carry a light tag set. */
function matchesTagged(listing: SampleListing, ids: string[], labelFor: (id: string) => string): boolean {
  if (ids.length === 0) return true;
  const tags = listingTags(listing);
  return ids.every((id) => {
    const label = labelFor(id).toLowerCase();
    return tags.some((t) => t.includes(label) || label.includes(t));
  });
}

export function applyFilters(
  listings: SampleListing[],
  filters: MatchFilters,
  scope: FilterScope,
): SampleListing[] {
  return listings.filter((l) => {
    if (filters.budget && (l.rent < filters.budget[0] || l.rent > filters.budget[1])) return false;
    if (!matchesBeds(l, filters.bedrooms)) return false;
    if (filters.bathrooms && l.baths < bathValue(filters.bathrooms)) return false;
    if (filters.neighborhoods.length > 0 && !filters.neighborhoods.includes(l.neighborhood)) {
      return false;
    }
    if (filters.noFeeOnly) {
      const tags = listingTags(l);
      if (!tags.some((t) => NO_FEE_TAGS.some((n) => t.includes(n)))) return false;
    }
    if (!matchesTagged(l, filters.amenities, (id) => findAmenity(id)?.label ?? id)) return false;
    if (!matchesTagged(l, filters.transit, (id) => scope.transitLabels[id] ?? id)) return false;
    return true;
  });
}
