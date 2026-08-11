import { useAppStore } from "./appStore";
import { SEARCH_LIMITS, type Plan, type Search } from "./types";

/**
 * Plan downgrade handling ("disabled" searches).
 *
 * When a user drops to a plan that allows fewer searches than they already
 * have, we never destroy data. Instead the searches that no longer fit the
 * plan become *disabled*: still visible in every list and on their own page,
 * but they don't run, can't be resumed, and can only be deleted (or unlocked
 * by upgrading again).
 *
 * Which ones? The newest `limit` searches keep their slot; every older
 * non-archived search beyond the limit is disabled. Because the state is
 * derived (not stored), deleting or archiving a live search automatically
 * promotes the next disabled search back into the freed slot.
 */
export function getDisabledSearchIds(searches: Search[], plan: Plan): Set<string> {
  const limit = SEARCH_LIMITS[plan];
  if (!Number.isFinite(limit)) return new Set();
  const eligible = searches
    .filter((s) => s.status !== "archived")
    // newest first — older overflow gets disabled
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
  return new Set(eligible.slice(limit).map((s) => s.id));
}

export function isSearchDisabled(searches: Search[], plan: Plan, id: string): boolean {
  return getDisabledSearchIds(searches, plan).has(id);
}

/** Reactive set of disabled search ids for the signed-in user's plan. */
export function useDisabledSearchIds(): Set<string> {
  const searches = useAppStore((s) => s.searches);
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  return getDisabledSearchIds(searches, plan);
}

export function useIsSearchDisabled(id: string | null | undefined): boolean {
  const disabled = useDisabledSearchIds();
  return !!id && disabled.has(id);
}

export const DISABLED_SEARCH_REASON =
  "This search is over your plan limit. Upgrade your plan to run it again, or delete it.";
