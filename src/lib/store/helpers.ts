import { getCity, type CityId } from "@/data/cities";
import type { Search } from "./types";

export function generateId(prefix = "s"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function generateReferralCode(): string {
  return "RB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * Auto-name a new search based on city + existing names.
 * First in NYC → "NYC Search". Second → "NYC Search 2".
 */
export function getDefaultSearchName(cityId: CityId, existing: Search[]): string {
  const city = getCity(cityId);
  const base = `${city?.displayName ?? "New"} Search`;
  const taken = new Set(existing.map((s) => s.name.toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  for (let i = 2; i < 100; i++) {
    const candidate = `${base} ${i}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
  return `${base} ${Date.now()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
