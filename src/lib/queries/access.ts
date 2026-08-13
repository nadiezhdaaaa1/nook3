import { queryOptions } from "@tanstack/react-query";
import { getAccessState, type AccessState } from "@/lib/profile.functions";

export const accessQueryKey = ["access-state"] as const;

/**
 * Access state used by the `_authenticated` gate. Short staleTime so a plan
 * change (or a `past_due` expiry) is picked up on the next navigation without
 * re-fetching on every route transition.
 */
export const accessQueryOptions = () =>
  queryOptions({
    queryKey: accessQueryKey,
    queryFn: () => getAccessState() as Promise<AccessState>,
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
