import type { QueryClient } from "@tanstack/react-query";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { getDefaultSearchName } from "@/lib/store";
import { accessQueryKey } from "@/lib/queries/access";
import { supabase } from "@/integrations/supabase/client";
type CommitFn = (opts: { data: unknown }) => Promise<{
  searchId: string | null;
  completedAt: string | null;
}>;

/**
 * The single onboarding write: search insert + `completed_at`, committed
 * together server-side. `handoffCompletedFor` guards against re-inserting the
 * first search when the SAME user passes through a plan decision again — it is
 * scoped to the account, so a different (or re-registered) user in the same
 * browser still gets their first search.
 */
export async function commitOnboardingFromStore(commit: CommitFn, qc: QueryClient) {
  const o = useOnboardingStore.getState();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id ?? null;
  const alreadyHandedOff = !!userId && o.handoffCompletedFor === userId;

  // A stale `editingSearchId` belongs to whichever account last used this
  // browser; never let the live buffer write to another account's search.
  if (!alreadyHandedOff && o.editingSearchId && o.editingSearchId !== "draft") {
    useOnboardingStore.getState().setEditingSearch(null);
  }

  const payload =
    o.city && !alreadyHandedOff
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
    if (userId) useOnboardingStore.getState().setHandoffCompletedFor(userId);
    useOnboardingStore.getState().setEditingSearch(res.searchId);
  }
  if (res?.completedAt) {
    useOnboardingStore.getState().set("completedAt", res.completedAt);
  }
  await qc.invalidateQueries({ queryKey: accessQueryKey });
}
