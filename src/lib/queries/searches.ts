import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
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

const errMsg = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

export function useCreateSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(createSearch);
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => fn({ data: data as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: searchesQueryKey });
      toast.success("Search created");
    },
    onError: (e) => toast.error("Couldn't create search", { description: errMsg(e, "Try again") }),
  });
}

export function useUpdateSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(updateSearch);
  return useMutation({
    mutationFn: (data: { id: string; patch: Record<string, unknown> }) =>
      fn({ data: data as any }),
    onSuccess: () => qc.invalidateQueries({ queryKey: searchesQueryKey }),
    // Silent on success (auto-save). Only surface failures.
    onError: (e) => toast.error("Couldn't save changes", { description: errMsg(e, "Will retry on next change") }),
  });
}

export function useDeleteSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(deleteSearch);
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: searchesQueryKey });
      toast.success("Search deleted");
    },
    onError: (e) => toast.error("Couldn't delete search", { description: errMsg(e, "Try again") }),
  });
}

export function useDuplicateSearchMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(duplicateSearch);
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: searchesQueryKey });
      toast.success("Search duplicated");
    },
    onError: (e) => toast.error("Couldn't duplicate search", { description: errMsg(e, "Try again") }),
  });
}
