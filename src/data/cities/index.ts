import type { CityConfig, CityId } from "./types";
import { nyc } from "./nyc";
import { la } from "./la";
import { sfBay } from "./sf-bay";
import { chicago } from "./chicago";
import { dc } from "./dc";
import { boston } from "./boston";
import { seattle } from "./seattle";
import { miami } from "./miami";
import { austin } from "./austin";
import { philadelphia } from "./philadelphia";

export const CITIES: Record<CityId, CityConfig> = {
  nyc, la, "sf-bay": sfBay, chicago, dc, boston, seattle, miami, austin, philadelphia,
};

export const CITY_LIST: CityConfig[] = [
  nyc, la, sfBay, chicago, dc, boston, seattle, miami, austin, philadelphia,
];

export function getCity(id: CityId | null | undefined): CityConfig | null {
  if (!id) return null;
  return CITIES[id] ?? null;
}

export type { CityConfig, CityId } from "./types";
