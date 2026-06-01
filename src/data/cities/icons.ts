import type { CityId } from "./types";

export const CITY_EMOJI: Record<CityId, string> = {
  nyc: "🗽",
  la: "🌴",
  "sf-bay": "🌉",
  chicago: "🏙️",
  dc: "🏛️",
  boston: "⚓",
  seattle: "🌲",
  miami: "🏖️",
  austin: "🎸",
  philadelphia: "🔔",
};

export const CITY_ACTIVE_LISTINGS: Record<CityId, number> = {
  nyc: 12453,
  la: 9821,
  "sf-bay": 6240,
  chicago: 5180,
  dc: 3920,
  boston: 3410,
  seattle: 3120,
  miami: 4280,
  austin: 2960,
  philadelphia: 2640,
};
