import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listSearches,
  createSearch,
  updateSearch,
  deleteSearch,
  duplicateSearch,
} from "@/lib/searches.functions";
import type { Search } from "@/lib/store";

export const searchesQueryKey = ["searches"] as const;

export const searchesQueryOptions = () =>
  queryOptions({
    queryKey: searchesQueryKey,
    queryFn: () => listSearches() as Promise<Search[]>,
    staleTime: 30_000,
  });

export function useCreateSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(createSearch);
  return useMutation({
    mutationFn: (data: Parameters<typeof createSearch>[0]["data"]) => fn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: searchesQueryKey }),
  });
}

export function useUpdateSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(updateSearch);
  return useMutation({
    mutationFn: (data: { id: string; patch: Record<string, unknown> }) =>
      fn({ data: data as any }),
    onSuccess: () => qc.invalidateQueries({ queryKey: searchesQueryKey }),
  });
}

export function useDeleteSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(deleteSearch);
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: searchesQueryKey }),
  });
}

export function useDuplicateSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(duplicateSearch);
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: searchesQueryKey }),
  });
}
