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
const LOADERS: Record<CityId, () => Promise<unknown>> = {
  nyc: () => import("./nyc.json"),
  la: () => import("./la.json"),
  "sf-bay": () => import("./sf-bay.json"),
  chicago: () => import("./chicago.json"),
  dc: () => import("./dc.json"),
  boston: () => import("./boston.json"),
  seattle: () => import("./seattle.json"),
  miami: () => import("./miami.json"),
  austin: () => import("./austin.json"),
  philadelphia: () =>
    import("./philadelphia.json"),
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
    const mod = (await loader()) as { default?: BoundaryCollection };
    const data = (mod.default ?? mod) as BoundaryCollection;
    cache.set(id, data);
    return data;
  } catch (err) {
    console.error("failed to load boundaries", id, err);
    return null;
  }
}
