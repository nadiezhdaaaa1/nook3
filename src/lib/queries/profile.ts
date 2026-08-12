import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  getProfile,
  updateProfile,
  scheduleAccountDeletion,
  cancelAccountDeletion,
  setSubscriptionCanceled,
} from "@/lib/profile.functions";

export const profileQueryKey = ["profile"] as const;

export const profileQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKey,
    queryFn: () => getProfile(),
    staleTime: 60_000,
  });

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(updateProfile);
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => fn({ data: data as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileQueryKey });
      toast.success("Profile updated");
    },
    onError: (e) =>
      toast.error("Couldn't update profile", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}

/** Mirror server-side deletion/subscription state onto the in-memory store so
 *  UI reading the store (Privacy & data row, delete button) updates instantly. */
export function syncDeletionStateToStore(user: {
  deletionRequestedAt?: string | null;
  deletionScheduledAt?: string | null;
  subscriptionCanceledAt?: string | null;
  subscriptionPeriodEnd?: string | null;
} | null | undefined) {
  if (!user) return;
  const store = useAppStore.getState();
  if (!store.user) return;
  store.updateProfile({
    deletionRequestedAt: user.deletionRequestedAt ?? null,
    deletionScheduledAt: user.deletionScheduledAt ?? null,
    subscriptionCanceledAt: user.subscriptionCanceledAt ?? null,
    subscriptionPeriodEnd: user.subscriptionPeriodEnd ?? null,
  } as any);
}

export function useScheduleAccountDeletionMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(scheduleAccountDeletion);
  return useMutation({
    mutationFn: (data: { reason?: string; feedback?: string; cancelSubscription?: boolean }) =>
      fn({ data }),
    onSuccess: (user) => {
      syncDeletionStateToStore(user as any);
      qc.invalidateQueries({ queryKey: profileQueryKey });
    },
    onError: (e) =>
      toast.error("Couldn't schedule deletion", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}

export function useCancelAccountDeletionMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(cancelAccountDeletion);
  return useMutation({
    mutationFn: () => fn(),
    onSuccess: (user) => {
      syncDeletionStateToStore(user as any);
      qc.invalidateQueries({ queryKey: profileQueryKey });
      toast.success("Account restored", {
        description: user?.subscriptionCanceledAt
          ? "Your account is active again — nothing was deleted. Auto-renewal is still off; renew anytime in Plan options."
          : "Your account is active again — nothing was deleted.",
      });
    },
    onError: (e) =>
      toast.error("Couldn't restore your account", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}

export function useSetSubscriptionCanceledMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(setSubscriptionCanceled);
  return useMutation({
    mutationFn: (canceled: boolean) => fn({ data: { canceled } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
    onError: (e) =>
      toast.error("Couldn't update your subscription", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}
