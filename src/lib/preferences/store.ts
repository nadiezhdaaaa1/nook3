import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PerSearchOverride {
  emailOverride: string | null;
  phoneOverride: string | null;
}

export interface QuietHours {
  enabled: boolean;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface PreferencesState {
  quietHours: QuietHours;
  perSearch: Record<string, PerSearchOverride>;
}

interface PreferencesActions {
  setQuiet: <K extends keyof QuietHours>(key: K, val: QuietHours[K]) => void;
  setPerSearch: (searchId: string, patch: Partial<PerSearchOverride>) => void;
}

const initial: PreferencesState = {
  quietHours: { enabled: false, start: "22:00", end: "08:00" },
  perSearch: {},
};

export const usePreferencesStore = create<PreferencesState & PreferencesActions>()(
  persist(
    (set, get) => ({
      ...initial,
      setQuiet: (key, val) =>
        set({ quietHours: { ...get().quietHours, [key]: val } }),
      setPerSearch: (searchId, patch) => {
        const cur = get().perSearch[searchId] ?? { emailOverride: null, phoneOverride: null };
        set({ perSearch: { ...get().perSearch, [searchId]: { ...cur, ...patch } } });
      },
    }),
    {
      name: "nook.preferences.v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? (undefined as unknown as Storage) : localStorage,
      ),
      skipHydration: typeof window === "undefined",
    },
  ),
);
