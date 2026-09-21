import { queryOptions, useQuery } from "@tanstack/react-query";

import { listActiveListingUrls } from "@/lib/listings.functions";

export const activeListingUrlsQueryKey = (urls: string[]) =>
  ["listing-availability", [...urls].sort().join("|")] as const;

export const activeListingUrlsQueryOptions = (urls: string[]) =>
  queryOptions({
    queryKey: activeListingUrlsQueryKey(urls),
    queryFn: async () => listActiveListingUrls({ data: { urls } }),
    enabled: urls.length > 0,
    staleTime: 5 * 60_000,
    retry: false,
  });

/**
 * Resolves which of the given source URLs are still active in the catalog.
 * Returns `undefined` until resolved, so callers can avoid flagging anything
 * as archived prematurely.
 */
export function useActiveListingUrls(urls: string[]): Set<string> | undefined {
  const q = useQuery(activeListingUrlsQueryOptions(urls));
  if (urls.length === 0) return undefined;
  return q.data ? new Set(q.data) : undefined;
}
