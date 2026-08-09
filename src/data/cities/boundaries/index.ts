import type { CityId } from "../types";

export interface BoundaryGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface BoundaryFeature {
  type: "Feature";
  properties: { name: string; c: [number, number] | null };
  geometry: BoundaryGeometry;
}

export interface BoundaryCollection {
  type: "FeatureCollection";
  features: BoundaryFeature[];
}

/**
 * Neighborhood outlines per city. Lazy-loaded so only the active city's
 * shapes are fetched. Sources: city open-data / Zillow-derived neighborhood
 * boundaries, US Census place boundaries (suburbs) and OpenStreetMap.
 * Geometry is simplified and rounded to ~5 decimals.
 */
const LOADERS: Record<CityId, () => Promise<{ default: BoundaryCollection }>> = {
  nyc: () => import("./nyc.json") as Promise<{ default: BoundaryCollection }>,
  la: () => import("./la.json") as Promise<{ default: BoundaryCollection }>,
  "sf-bay": () => import("./sf-bay.json") as Promise<{ default: BoundaryCollection }>,
  chicago: () => import("./chicago.json") as Promise<{ default: BoundaryCollection }>,
  dc: () => import("./dc.json") as Promise<{ default: BoundaryCollection }>,
  boston: () => import("./boston.json") as Promise<{ default: BoundaryCollection }>,
  seattle: () => import("./seattle.json") as Promise<{ default: BoundaryCollection }>,
  miami: () => import("./miami.json") as Promise<{ default: BoundaryCollection }>,
  austin: () => import("./austin.json") as Promise<{ default: BoundaryCollection }>,
  philadelphia: () =>
    import("./philadelphia.json") as Promise<{ default: BoundaryCollection }>,
};

const cache = new Map<CityId, BoundaryCollection>();

export async function loadCityBoundaries(
  id: CityId,
): Promise<BoundaryCollection | null> {
  const cached = cache.get(id);
  if (cached) return cached;
  const loader = LOADERS[id];
  if (!loader) return null;
  try {
    const mod = await loader();
    const data = mod.default ?? (mod as unknown as BoundaryCollection);
    cache.set(id, data);
    return data;
  } catch (err) {
    console.error("failed to load boundaries", id, err);
    return null;
  }
}
