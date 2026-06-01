/**
 * Bridge between the legacy `useOnboardingStore` (live state of the *current*
 * search + user contact info) and the new multi-search `useAppStore`
 * (collection of Search snapshots + User-level data).
 *
 * Strategy
 * --------
 * Existing 20+ consumers of `useOnboardingStore` keep working as the "live
 * editor" of whatever search is currently active. The appStore.searches[]
 * array stores snapshots that get hydrated/written on switch.
 *
 * Use these helpers from M2+ components (SearchSwitcher, NewSearchModal etc.).
 */
import { useAppStore, selectActiveSearch } from "./appStore";
import { useOnboardingStore } from "@/lib/onboarding/store";
import type { Search } from "./types";

/** Reactive hook: returns the currently active Search snapshot, or null. */
export function useActiveSearch(): Search | null {
  return useAppStore(selectActiveSearch);
}

/** Reactive hook: returns true once persisted state has finished hydrating. */
export function useAppHydrated(): boolean {
  return useAppStore((s) => s.hydrated);
}

/**
 * Copy current `useOnboardingStore` filter fields into the active Search
 * snapshot. Call this on debounced auto-save and before switching searches.
 */
export function syncOnboardingToActiveSearch(): void {
  const app = useAppStore.getState();
  if (!app.activeSearchId) return;
  const o = useOnboardingStore.getState();
  app.snapshotActiveSearch({
    cityId: (o.city ?? "nyc") as Search["cityId"],
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
    alertChannel: o.alertChannel,
    frequency: o.frequency,
  });
}

/**
 * Load a Search snapshot into `useOnboardingStore` so existing UI shows it.
 */
function hydrateOnboardingFromSearch(s: Search): void {
  useOnboardingStore.getState().patch({
    city: s.cityId,
    budget: s.budget,
    moveIn: s.moveIn,
    bedrooms: s.bedrooms,
    bathrooms: s.bathrooms,
    rentProtection: s.rentProtection,
    includeBrokerFee: s.includeBrokerFee,
    neighborhoods: s.neighborhoods,
    amenities: s.amenities,
    transit: s.transit,
    commute: s.commute,
    alertChannel: s.alertChannel,
    frequency: s.frequency,
  });
}

/**
 * Switch the active search: snapshot current live state into the outgoing
 * search, then hydrate the incoming search into `useOnboardingStore`.
 */
export function switchActiveSearch(nextId: string): void {
  const app = useAppStore.getState();
  if (nextId === app.activeSearchId) return;
  const next = app.searches.find((s) => s.id === nextId);
  if (!next) return;

  // 1. Snapshot the outgoing search.
  if (app.activeSearchId) syncOnboardingToActiveSearch();

  // 2. Update activeSearchId.
  app.setActiveSearch(nextId);

  // 3. Hydrate the incoming search into the legacy onboarding store.
  hydrateOnboardingFromSearch(next);
}

/**
 * After creating a new Search via `useAppStore.getState().createSearch(...)`,
 * call this to load the brand-new search into the legacy onboarding store so
 * the existing edit screens display it.
 */
export function hydrateActiveSearchIntoOnboarding(): void {
  const s = selectActiveSearch(useAppStore.getState());
  if (s) hydrateOnboardingFromSearch(s);
}

/**
 * Push account-level fields from the legacy onboarding store up to the new
 * user record (contacts, plan, move-out). Search-scoped fields stay in
 * snapshotActiveSearch — this is for cross-search account data only.
 */
export function syncOnboardingToUser(): void {
  const app = useAppStore.getState();
  const o = useOnboardingStore.getState();
  app.updateProfile({
    email: o.email,
    phone: o.phone,
    plan: o.selectedPlan ?? app.user?.plan ?? "free",
    billingCycle: o.billingCycle,
    trialActive: o.trialActive,
    completedAt: o.completedAt ?? app.user?.completedAt ?? null,
  });
  if (o.moveOut) app.setMoveOut(o.moveOut);
}

