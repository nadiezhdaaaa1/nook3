import { queryOptions } from "@tanstack/react-query";
import { getAccessState, type AccessState } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";

export const accessQueryKey = ["access-state"] as const;

/**
 * Access state used by the `_authenticated` gate. Short staleTime so a plan
 * change (or a `past_due` expiry) is picked up on the next navigation without
 * re-fetching on every route transition.
 */
export const accessQueryOptions = () =>
  queryOptions({
    queryKey: accessQueryKey,
    queryFn: async () => {
      // getAccessState requires a bearer token. A locally cached session can
      // already be gone (signed out, revoked, or a deleted user whose refresh
      // failed) while a component still thinks it has one — calling anyway
      // throws "Unauthorized: No authorization header provided" and blanks the
      // screen. Fail with a recognizable unauthorized error instead, which the
      // `_authenticated` gate turns into a /login redirect.
      const { data } = await supabase.auth.getSession();
      if (!data.session?.access_token) {
        throw new Error("Unauthorized: no active session");
      }
      return (await getAccessState()) as AccessState;
    },
    // The gate turns an unauthorized result into a /login redirect itself.
    staleTime: 30_000,
    retry: false,
  });

/** Clamp the persisted onboarding step to a route that exists. */
export function clampOnboardingStep(step: unknown): 1 | 2 | 3 | 4 {
  const n = typeof step === "number" ? Math.floor(step) : 1;
  if (n <= 1) return 1;
  if (n >= 4) return 4;
  return n as 2 | 3;
}
