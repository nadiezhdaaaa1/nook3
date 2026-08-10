import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  listAlerts,
  listAlertsPage,
  updateAlertStatus,
  snoozeAlert,
  deleteAlert,
  type AlertRow,
  type AlertStatusDb,
  type PaginatedAlertsResult,
} from "@/lib/alerts.functions";

export const alertsQueryKey = ["alerts"] as const;

export const alertsQueryOptions = () =>
  queryOptions({
    queryKey: alertsQueryKey,
    queryFn: () => listAlerts(),
    staleTime: 30_000,
  });

export const paginatedAlertsQueryKey = (page: number, pageSize: number) =>
  ["alerts", "page", page, pageSize] as const;

export const paginatedAlertsQueryOptions = (page: number, pageSize: number) =>
  queryOptions({
    queryKey: paginatedAlertsQueryKey(page, pageSize),
    queryFn: () =>
      listAlertsPage({ data: { limit: pageSize, offset: (page - 1) * pageSize } }),
    staleTime: 30_000,
  });

export function useAlertsQuery() {
  return useQuery(alertsQueryOptions());
}

export function usePaginatedAlertsQuery(page: number, pageSize: number) {
  return useQuery(paginatedAlertsQueryOptions(page, pageSize));
}

export function useUpdateAlertStatusMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(updateAlertStatus);
  return useMutation({
    mutationFn: (vars: { id: string; status: AlertStatusDb }) =>
      fn({ data: vars }),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: alertsQueryKey });
      const prev = qc.getQueryData<AlertRow[]>(alertsQueryKey);
      qc.setQueryData<AlertRow[]>(alertsQueryKey, (cur) =>
        (cur ?? []).map((a) => (a.id === vars.id ? { ...a, status: vars.status } : a)),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(alertsQueryKey, ctx.prev);
      toast.error("Couldn't update alert", {
        description: e instanceof Error ? e.message : "Try again",
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: alertsQueryKey }),
  });
}

export function useSnoozeAlertMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(snoozeAlert);
  return useMutation({
    mutationFn: (vars: { id: string; snoozedUntil: string | null }) =>
      fn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: alertsQueryKey });
      toast.success("Alert snoozed");
    },
    onError: (e) =>
      toast.error("Couldn't snooze alert", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}

export function useDeleteAlertMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(deleteAlert);
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertsQueryKey }),
    onError: (e) =>
      toast.error("Couldn't delete alert", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}
