import { create } from "zustand";
import type { CityId } from "@/data/cities";

interface LandingState {
  city: CityId;
  budget: number;
  beds: "studio" | "1br" | "2br" | "3br";
  setCity: (c: CityId) => void;
  setBudget: (n: number) => void;
  setBeds: (b: LandingState["beds"]) => void;
}

// Lightweight non-persisted store shared between Header switcher,
// Hero demo form and city-aware copy on the landing.
export const useLandingStore = create<LandingState>((set) => ({
  city: "nyc",
  budget: 3500,
  beds: "1br",
  setCity: (city) => set({ city }),
  setBudget: (budget) => set({ budget }),
  setBeds: (beds) => set({ beds }),
}));
