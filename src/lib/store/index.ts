// Public surface of the multi-search store.
export { useAppStore, selectActiveSearch, selectQuota, canCreateSearch } from "./appStore";
export type { AppStore } from "./appStore";
export {
  useActiveSearch,
  useAppHydrated,
  switchActiveSearch,
  syncOnboardingToActiveSearch,
  syncOnboardingToUser,
  hydrateActiveSearchIntoOnboarding,
  hydrateOnboardingFromSearch,
  beginSearchDraft,
  restoreActiveSearchBuffer,
} from "./bridge";
export { ensureMigratedFromLegacy } from "./migrate";
export { generateId, generateReferralCode, getDefaultSearchName, nowIso } from "./helpers";
export {
  getDisabledSearchIds,
  isSearchDisabled,
  DISABLED_SEARCH_REASON,
} from "./lock";
export { useDisabledSearchIds, useIsSearchDisabled } from "./lockHooks";
export {
  SEARCH_LIMITS,
} from "./types";
export type {
  Search,
  SearchQuota,
  User,
  MoveOutInfo,
  Plan,
  Frequency,
  BillingCycle,
} from "./types";
