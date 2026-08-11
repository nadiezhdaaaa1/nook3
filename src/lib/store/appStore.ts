import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCity } from "@/data/cities";
import type { CityId } from "@/data/cities";
import type {
  Search,
  SearchQuota,
  SearchStatus,
  User,
  MoveOutInfo,
  Plan,
  BillingCycle,
} from "./types";
import { SEARCH_LIMITS } from "./types";
import { isSearchDisabled, getDisabledSearchIds, DISABLED_SEARCH_REASON } from "./lock";
import { generateId, generateReferralCode, getDefaultSearchName, nowIso } from "./helpers";

interface AppState {
  user: User | null;
  searches: Search[];
  activeSearchId: string | null;
  /** Set true after first hydration so consumers can avoid SSR flicker. */
  hydrated: boolean;
}

interface AppActions {
  // Hydration
  markHydrated: () => void;

  // User-level
  setUser: (u: User) => void;
  updateProfile: (patch: Partial<User>) => void;
  setMoveOut: (info: MoveOutInfo | undefined) => void;
  setPlan: (plan: Plan, opts?: { billingCycle?: BillingCycle; trial?: boolean }) => void;

  // Searches
  createSearch: (
    initial: Partial<Search> & { cityId: CityId },
  ) => { ok: true; search: Search } | { ok: false; error: string };
  updateSearch: (searchId: string, patch: Partial<Search>) => void;
  renameSearch: (searchId: string, name: string) => void;
  changeSearchCity: (searchId: string, cityId: CityId) => void;
  pauseSearch: (searchId: string) => void;
  resumeSearch: (searchId: string) => { ok: true } | { ok: false; error: string };
  duplicateSearch: (searchId: string) => { ok: true; search: Search } | { ok: false; error: string };
  /** Swap a locally-created search for its persisted backend row (id becomes a real uuid). */
  adoptServerSearch: (localId: string, row: Search) => void;
  deleteSearch: (searchId: string) => void;
  archiveSearch: (searchId: string) => void;
  restoreSearch: (searchId: string) => { ok: true } | { ok: false; error: string };
  setActiveSearch: (searchId: string) => void;

  // Snapshotting (used by useOnboardingStore facade — call before switching searches
  // or before reading a fresh view of the active search)
  snapshotActiveSearch: (patch: Partial<Search>) => void;

  // Bootstrap (called once on app init / after migration)
  bootstrapIfEmpty: (seed?: Partial<Search> & { cityId: CityId }) => void;

  reset: () => void;
}

export type AppStore = AppState & AppActions;

const DEFAULT_USER = (): User => ({
  id: generateId("u"),
  email: "",
  emailVerified: false,
  phone: "",
  phoneVerified: false,
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/New_York",
  plan: "free",
  billingCycle: "monthly",
  trialActive: false,
  referralCode: generateReferralCode(),
  isAffiliate: false,
  completedAt: null,
});

const EMPTY_SEARCH_DEFAULTS = (cityId: CityId): Omit<Search, "id" | "name" | "cityId" | "createdAt" | "updatedAt"> => ({
  status: "active",
  budget: null,
  moveIn: { mode: "flexible" },
  bedrooms: [],
  bathrooms: "1ba",
  rentProtection: "all",
  includeBrokerFee: true,
  neighborhoods: [],
  amenities: {},
  transit: { hasPreference: false, lines: {} },
  commute: { maxMinutes: null },
  alertChannel: "email",
  frequency: "balanced",
  totalAlertsReceived: 0,
  alertsLast7Days: 0,
  alertsToday: 0,
});

const initialState: AppState = {
  user: null,
  searches: [],
  activeSearchId: null,
  hydrated: false,
};

function buildSearch(seed: Partial<Search> & { cityId: CityId }, existing: Search[]): Search {
  const defaults = EMPTY_SEARCH_DEFAULTS(seed.cityId);
  return {
    ...defaults,
    ...seed,
    id: seed.id ?? generateId(),
    name: seed.name && seed.name.trim() ? seed.name.trim() : getDefaultSearchName(seed.cityId, existing),
    cityId: seed.cityId,
    createdAt: seed.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      markHydrated: () => set({ hydrated: true }),

      setUser: (u) => set({ user: u }),
      updateProfile: (patch) => {
        const cur = get().user ?? DEFAULT_USER();
        set({ user: { ...cur, ...patch } });
      },
      setMoveOut: (info) => {
        const cur = get().user ?? DEFAULT_USER();
        set({ user: { ...cur, moveOut: info } });
      },
      setPlan: (plan, opts) => {
        const cur = get().user ?? DEFAULT_USER();
        // Downgrades: searches beyond the new limit become "disabled" (derived,
        // see ./lock). Stop them from running server-side too, otherwise the
        // backend quota guard rejects any later edit to them.
        const overflow = getDisabledSearchIds(get().searches, plan);
        set({
          user: {
            ...cur,
            plan,
            billingCycle: opts?.billingCycle ?? cur.billingCycle,
            trialActive: opts?.trial ?? cur.trialActive,
            trialStartedAt: opts?.trial ? nowIso() : cur.trialStartedAt,
          },
          searches: get().searches.map((s) =>
            overflow.has(s.id) && s.status === "active"
              ? { ...s, status: "paused" as SearchStatus, updatedAt: nowIso() }
              : s,
          ),
        });
      },

      createSearch: (initial) => {
        const { searches, user } = get();
        const plan = user?.plan ?? "free";
        const limit = SEARCH_LIMITS[plan];
        const activeCount = searches.filter((s) => s.status !== "archived").length;
        if (activeCount >= limit) {
          return { ok: false, error: `Plan limit reached (${activeCount} of ${limit === Infinity ? "∞" : limit})` };
        }
        const s = buildSearch(initial, searches);
        set({ searches: [...searches, s], activeSearchId: s.id });
        return { ok: true, search: s };
      },

      updateSearch: (id, patch) => {
        set({
          searches: get().searches.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: nowIso() } : s)),
        });
      },

      renameSearch: (id, name) => {
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 50) return;
        get().updateSearch(id, { name: trimmed });
      },

      changeSearchCity: (id, cityId) => {
        const search = get().searches.find((s) => s.id === id);
        if (!search) return;
        const defaults = EMPTY_SEARCH_DEFAULTS(cityId);
        const cityConfig = getCity(cityId);
        const budget = (() => {
          if (!search.budget || !cityConfig) return defaults.budget;
          const [min, max] = search.budget;
          const { budget: cb } = cityConfig;
          if (min < cb.min || max > cb.max) return [cb.min, cb.default] as [number, number];
          return search.budget;
        })();
        // Keep an auto-generated name in step with the city (never touch a
        // name the user typed themselves).
        const autoName = getDefaultSearchName(search.cityId, get().searches.filter((s) => s.id !== id));
        const wasAutoNamed =
          search.name === autoName ||
          search.name.startsWith(`${getCity(search.cityId)?.displayName ?? ""} Search`);
        get().updateSearch(id, {
          cityId,
          ...(wasAutoNamed
            ? { name: getDefaultSearchName(cityId, get().searches.filter((s) => s.id !== id)) }
            : {}),
          // Reset city-dependent fields to avoid mismatched neighborhoods / transit lines.
          neighborhoods: defaults.neighborhoods,
          transit: defaults.transit,
          commute: defaults.commute,
          budget,
        });

      },

      pauseSearch: (id) => get().updateSearch(id, { status: "paused" }),
      resumeSearch: (id) => {
        const { searches, user } = get();
        const src = searches.find((s) => s.id === id);
        if (!src) return { ok: false, error: "Search not found" };
        const plan = user?.plan ?? "free";
        if (isSearchDisabled(searches, plan, id)) {
          return { ok: false, error: DISABLED_SEARCH_REASON };
        }
        if (src.status === "active") return { ok: true };
        const limit = SEARCH_LIMITS[plan];
        const activeCount = searches.filter((s) => s.status === "active").length;
        if (activeCount >= limit) {
          return {
            ok: false,
            error: `Your plan allows ${limit} live ${limit === 1 ? "search" : "searches"}. Pause another one first.`,
          };
        }
        get().updateSearch(id, { status: "active" });
        return { ok: true };
      },
      archiveSearch: (id) => {
        const { searches, activeSearchId } = get();
        const next = searches.map((s) =>
          s.id === id ? { ...s, status: "archived" as SearchStatus, archivedAt: nowIso(), updatedAt: nowIso() } : s,
        );
        const stillActive = activeSearchId === id
          ? (next.find((s) => s.status !== "archived")?.id ?? null)
          : activeSearchId;
        // If nothing left non-archived, bootstrap a fresh one
        if (!stillActive) {
          const fresh = buildSearch({ cityId: "nyc" }, next);
          set({ searches: [...next, fresh], activeSearchId: fresh.id });
          return;
        }
        set({ searches: next, activeSearchId: stillActive });
      },

      restoreSearch: (id) => {
        const { searches, user } = get();
        const src = searches.find((s) => s.id === id);
        if (!src) return { ok: false, error: "Search not found" };
        const plan = user?.plan ?? "free";
        const limit = SEARCH_LIMITS[plan];
        const activeCount = searches.filter((s) => s.status !== "archived").length;
        if (activeCount >= limit) return { ok: false, error: "Plan limit reached" };
        get().updateSearch(id, { status: "active", archivedAt: undefined });
        return { ok: true };
      },

      duplicateSearch: (id) => {
        const { searches, user } = get();
        const src = searches.find((s) => s.id === id);
        if (!src) return { ok: false, error: "Search not found" };
        const plan = user?.plan ?? "free";
        const limit = SEARCH_LIMITS[plan];
        const activeCount = searches.filter((s) => s.status !== "archived").length;
        if (activeCount >= limit) {
          return { ok: false, error: "Plan limit reached" };
        }
        const copy = buildSearch(
          { ...src, id: undefined as unknown as string, name: `${src.name} copy`, status: "active" },
          searches,
        );
        set({ searches: [...searches, copy], activeSearchId: copy.id });
        return { ok: true, search: copy };
      },

      adoptServerSearch: (localId, row) => {
        const { searches, activeSearchId } = get();
        const local = searches.find((s) => s.id === localId);
        if (!local && searches.some((s) => s.id === row.id)) return;
        const merged: Search = { ...(local ?? ({} as Search)), ...row };
        const withoutDupe = searches.filter((s) => s.id !== row.id);
        const next = local
          ? withoutDupe.map((s) => (s.id === localId ? merged : s))
          : [...withoutDupe, merged];
        set({
          searches: next,
          activeSearchId:
            activeSearchId === localId || activeSearchId === null ? row.id : activeSearchId,
        });
      },



      deleteSearch: (id) => {
        const remaining = get().searches.filter((s) => s.id !== id);
        // If we just deleted the last non-archived search, auto-bootstrap a
        // fresh default so the app never sits in an empty state.
        if (remaining.filter((s) => s.status !== "archived").length === 0) {
          const fresh = buildSearch({ cityId: "nyc" }, remaining);
          set({ searches: [...remaining, fresh], activeSearchId: fresh.id });
          return;
        }
        const nextActive =
          get().activeSearchId === id
            ? (remaining.find((s) => s.status !== "archived")?.id ?? null)
            : get().activeSearchId;
        set({ searches: remaining, activeSearchId: nextActive });
      },

      setActiveSearch: (id) => {
        if (!get().searches.find((s) => s.id === id)) return;
        set({ activeSearchId: id });
      },

      snapshotActiveSearch: (patch) => {
        const { activeSearchId, searches } = get();
        if (!activeSearchId) return;
        set({
          searches: searches.map((s) =>
            s.id === activeSearchId ? { ...s, ...patch, updatedAt: nowIso() } : s,
          ),
        });
      },

      bootstrapIfEmpty: (seed) => {
        const { searches, user } = get();
        if (searches.length > 0) return;
        if (!user) set({ user: DEFAULT_USER() });
        const cityId: CityId = (seed?.cityId ?? "nyc") as CityId;
        const s = buildSearch({ ...(seed ?? {}), cityId }, []);
        set({ searches: [s], activeSearchId: s.id });
      },

      reset: () => set({ ...initialState, hydrated: true }),
    }),
    {
      name: "nook.app.v1",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? (undefined as unknown as Storage) : localStorage,
      ),
      skipHydration: typeof window === "undefined",
      onRehydrateStorage: () => (state) => {
        // Mark hydrated; legacy migration handled by ensureMigratedFromLegacy().
        state?.markHydrated();
      },
    },
  ),
);

/* ----------------------------- Selectors ----------------------------- */

export function selectActiveSearch(s: AppStore): Search | null {
  if (!s.activeSearchId) return null;
  return s.searches.find((x) => x.id === s.activeSearchId) ?? null;
}

export function selectQuota(s: AppStore): SearchQuota {
  const plan = s.user?.plan ?? "free";
  const max = SEARCH_LIMITS[plan];
  const used = s.searches.filter((x) => x.status !== "archived").length;
  const maxLabel = max === Number.POSITIVE_INFINITY ? "Unlimited" : String(max);
  return {
    used,
    max,
    remaining: max === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, max - used),
    label: `${used} of ${maxLabel} used`,
  };
}

export function canCreateSearch(s: AppStore): boolean {
  const q = selectQuota(s);
  return q.remaining > 0;
}
