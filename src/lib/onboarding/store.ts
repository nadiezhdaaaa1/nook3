import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CityId } from "@/data/cities";

export type TriState = "nice" | "required";
export type AlertChannel = "email" | "text" | "both";
export type Plan = "free" | "premium" | "max";
export type BillingCycle = "monthly" | "annual";
export type Frequency = "minimal" | "balanced" | "maximum" | "weekly";
export type RentProtection = "all" | "likely" | "verified";

export interface MoveOutInfo {
  date: string;
  name: string;
  address: string;
  unit: string;
  beds: number;
  baths: number;
  roommates: number;
  landlord?: { name: string; contact: string };
  allowContact: boolean;
}

export interface OnboardingState {
  // Step 1
  city: CityId | null;
  budget: [number, number] | null;
  moveIn: { mode: "specific" | "flexible"; date?: string };
  movingOut: boolean;

  // Step 2
  bedrooms: string[];
  bathrooms: string;
  rentProtection: RentProtection;
  includeBrokerFee: boolean;

  // Step 3
  neighborhoods: string[];

  // Step 4
  amenities: Record<string, TriState>;
  transit: {
    hasPreference: boolean;
    lines: Record<string, TriState>;
  };
  commute: { maxMinutes: number | null };


  // Step 5
  alertChannel: AlertChannel;
  email: string;
  phone: string;

  // Settings
  frequency: Frequency;

  // Plan
  selectedPlan: Plan | null;
  billingCycle: BillingCycle;
  trialActive: boolean;

  // Lifecycle
  lastStep: number;
  completedAt: string | null;

  // Move-out
  moveOut?: MoveOutInfo;
}

export interface OnboardingActions {
  set: <K extends keyof OnboardingState>(key: K, val: OnboardingState[K]) => void;
  patch: (p: Partial<OnboardingState>) => void;
  toggleBedroom: (id: string) => void;
  toggleNeighborhood: (id: string) => void;
  cycleAmenity: (id: string) => void;
  cycleTransit: (id: string) => void;
  setTransit: (id: string, state: TriState | null) => void;
  reset: () => void;
}

const initial: OnboardingState = {
  city: null,
  budget: null,
  moveIn: { mode: "flexible" },
  movingOut: false,
  bedrooms: [],
  bathrooms: "1ba",
  rentProtection: "all",
  includeBrokerFee: true,
  neighborhoods: [],
  amenities: {},
  transit: { hasPreference: false, lines: {} },
  commute: { maxMinutes: null },

  alertChannel: "email",
  email: "",
  phone: "",
  frequency: "balanced",
  selectedPlan: null,
  billingCycle: "monthly",
  trialActive: false,
  lastStep: 1,
  completedAt: null,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...initial,
      set: (key, val) => set({ [key]: val } as Partial<OnboardingState>),
      patch: (p) => set(p),
      toggleBedroom: (id) =>
        set((s) => ({
          bedrooms: s.bedrooms.includes(id)
            ? s.bedrooms.filter((b) => b !== id)
            : [...s.bedrooms, id],
        })),
      toggleNeighborhood: (id) =>
        set((s) => ({
          neighborhoods: s.neighborhoods.includes(id)
            ? s.neighborhoods.filter((n) => n !== id)
            : [...s.neighborhoods, id],
        })),
      cycleAmenity: (id) => {
        const cur = get().amenities[id];
        const next: Record<string, TriState> = { ...get().amenities };
        if (!cur) next[id] = "nice";
        else if (cur === "nice") next[id] = "required";
        else delete next[id];
        set({ amenities: next });
      },
      cycleTransit: (id) => {
        const lines = { ...get().transit.lines };
        const cur = lines[id];
        if (!cur) lines[id] = "nice";
        else if (cur === "nice") lines[id] = "required";
        else delete lines[id];
        set({ transit: { ...get().transit, lines } });
      },
      setTransit: (id, state) => {
        const lines = { ...get().transit.lines };
        if (state === null) delete lines[id];
        else lines[id] = state;
        set({ transit: { ...get().transit, lines } });
      },
      reset: () => set({ ...initial }),
    }),
    {
      name: "nook.onboarding.v1",
      version: 2,
      migrate: (persisted: unknown, version) => {
        const s = (persisted ?? {}) as Partial<OnboardingState> & { budget?: unknown };
        if (version < 2 && typeof s.budget === "number") {
          s.budget = [Math.max(0, Math.round(s.budget * 0.5)), s.budget] as [number, number];
        }
        return s as OnboardingState;
      },
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? (undefined as unknown as Storage)
          : localStorage,
      ),
      skipHydration: typeof window === "undefined",
    },
  ),
);

// referral code (stable per browser)
export function getReferralCode(): string {
  if (typeof window === "undefined") return "RB000000";
  const key = "nook.referral";
  let v = localStorage.getItem(key);
  if (!v) {
    v = "RB" + Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem(key, v);
  }
  return v;
}
