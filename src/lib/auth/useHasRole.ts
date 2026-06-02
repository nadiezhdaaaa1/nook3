import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "moderator" | "user";

/**
 * Reads the current user's roles from `public.user_roles` and checks
 * whether they have the requested role. Uses the SECURITY DEFINER
 * `has_role` RPC to avoid leaking other users' rows.
 */
export function useHasRole(role: AppRole) {
  return useQuery({
    queryKey: ["has_role", role],
    queryFn: async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: role,
      });
      if (error) throw error;
      return Boolean(data);
    },
    staleTime: 5 * 60_000,
  });
}
