import { queryOptions, useQuery } from "@tanstack/react-query";

import { listCityListings } from "@/lib/listings.functions";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";

export const cityListingsQueryKey = (cityId: string | null | undefined) =>
  ["listings", "city", cityId ?? "none"] as const;

export const cityListingsQueryOptions = (cityId: string | null | undefined) =>
  queryOptions({
    queryKey: cityListingsQueryKey(cityId),
    queryFn: () => listCityListings({ data: { cityId: cityId as string } }),
    enabled: Boolean(cityId),
    staleTime: 5 * 60_000,
  });

/** Backend listings for a city, with the bundled anchors as an offline fallback. */
export function useCityListings(cityId: string | null | undefined): SampleListing[] {
  const q = useQuery(cityListingsQueryOptions(cityId));
  if (q.data && q.data.length > 0) return q.data;
  if (!cityId) return [];
  return (SAMPLE_LISTINGS as Record<string, SampleListing[]>)[cityId] ?? [];
}
