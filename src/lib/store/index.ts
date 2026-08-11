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
  useDisabledSearchIds,
  useIsSearchDisabled,
  DISABLED_SEARCH_REASON,
} from "./lock";
export {
  SEARCH_LIMITS,
} from "./types";
export type {
  Search,
  SearchStatus,
  SearchQuota,
  User,
  MoveOutInfo,
  Plan,
  Frequency,
  AlertChannel,
  BillingCycle,
} from "./types";
