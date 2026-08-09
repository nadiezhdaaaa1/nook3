# Neighborhood boundaries on the onboarding map

Today the map only knows one center point per neighborhood, so it can only draw dots. To show real outlines and fill a neighborhood when it's picked, we need actual boundary shapes for each city.

## What you'll get

- Each neighborhood is drawn as its true outline on the map instead of just a dot.
- Hovering an outline highlights it and shows the neighborhood name.
- Clicking anywhere inside an outline selects/deselects it (same as clicking a dot today).
- Selected neighborhoods fill with the city's accent tint, with a darker border and a visible label.
- Neighborhoods we can't find boundary data for keep the existing dot behavior, so nothing disappears.
- Selecting from the list on the left highlights the shape on the map, and vice versa.

## Coverage

Boundary data will be sourced for all 9 cities: NYC, SF Bay, LA, Chicago, Boston, Seattle, Miami, Austin, Philadelphia, DC. Quality varies by city — where a city's open dataset uses different names than our list, names get mapped to ours; anything left unmatched falls back to a dot.

## Technical notes

- Add `src/data/cities/boundaries/<cityId>.json` — simplified GeoJSON FeatureCollections (Polygon/MultiPolygon), each feature carrying a `name` matching the keys in `CITY_MAP[city].neighborhoods`.
  - Sources: city/region open-data portals (e.g. NYC NTA/neighborhood tabulation areas, SF Analysis Neighborhoods, Chicago community areas, Boston/Seattle/Philadelphia/DC/Austin/Miami-Dade neighborhood layers), with Zillow/OpenStreetMap-derived sets as fallback for cities lacking an official layer.
  - Coordinates rounded to ~5 decimals and geometry simplified so each city file stays roughly under 300–500 KB.
- Add `src/data/cities/boundaries/index.ts` with a lazy loader (`await import()` per city id) so only the active city's file is fetched, plus a name-normalization/alias map to reconcile dataset names with ours.
- In `src/components/onboarding/NeighborhoodMap.tsx`:
  - Load the active city's GeoJSON after the map is ready, into a `google.maps.Data` layer (`addGeoJson`), keyed by normalized name.
  - `setStyle` driven by selection state: default 1px `rgba(0,0,0,0.35)` stroke with ~8% fill; selected uses the city tint from `src/data/cities/cards.ts` (`CITY_TINT`) at ~35% fill with a `#241C12` 2px stroke; hover raises fill opacity and `zIndex`.
  - `addListener('click')` on the data layer calls the existing `onToggle(name)`; `mouseover`/`mouseout` handle hover styling.
  - Restyle on `selected` change via `data.overrideStyle` / `revertStyle` rather than re-adding features, so panning stays smooth.
  - Keep markers only for neighborhoods with no matching polygon; hide the dot when a polygon exists to avoid double targets.
  - Reuse the existing per-neighborhood label rendering for selected polygons (label at the stored centroid).
- Cleanup on city change: remove all data-layer features and markers before loading the next city.
- Reduced-motion and keyboard: list-side selection remains the accessible path; map shapes are a pointer enhancement only.
