import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
    mutationFn: (data: Parameters<typeof updateProfile>[0]["data"]) => fn({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileQueryKey }),
  });
}
