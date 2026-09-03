import type { QueryClient } from "@tanstack/react-query";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getDefaultSearchName } from "@/lib/store";
import { accessQueryKey } from "@/lib/queries/access";
type CommitFn = (opts: { data: unknown }) => Promise<{
  searchId: string | null;
  completedAt: string | null;
}>;

/**
 * The single onboarding write: search insert + `completed_at`, committed
 * together server-side. `handoffCompleted` guards against re-inserting the
 * first search when the user passes through a plan decision again.
 */
export async function commitOnboardingFromStore(commit: CommitFn, qc: QueryClient) {
  const o = useOnboardingStore.getState();
  const payload =
    o.city && !o.handoffCompleted
      ? {
          name: getDefaultSearchName(o.city, []),
          cityId: o.city,
          budget: o.budget,
          moveIn: o.moveIn,
          bedrooms: o.bedrooms,
          bathrooms: o.bathrooms,
          rentProtection: o.rentProtection,
          includeBrokerFee: o.includeBrokerFee,
          neighborhoods: o.neighborhoods,
          amenities: o.amenities,
          transit: o.transit,
          commute: o.commute,
          frequency: o.frequency,
        }
      : null;

  const res = await commit({ data: { search: payload } as never });
  if (res?.searchId) {
    useOnboardingStore.getState().setHandoffCompleted(true);
    useOnboardingStore.getState().setEditingSearch(res.searchId);
  }
  if (res?.completedAt) {
    useOnboardingStore.getState().set("completedAt", res.completedAt);
  }
  await qc.invalidateQueries({ queryKey: accessQueryKey });
}
