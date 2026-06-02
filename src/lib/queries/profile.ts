import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/lib/profile.functions";

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
