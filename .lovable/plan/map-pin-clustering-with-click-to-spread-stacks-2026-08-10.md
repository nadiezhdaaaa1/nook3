# Map pin clustering with click-to-spread stacks

Overlapping price pins on the map get merged into a single counter pin. Clicking it spreads the group into individual pins placed close together so each one is clickable; clicking the map, another pin, or another stack collapses it back.

## Behavior

- Pins whose screen positions overlap (within ~44px of each other) are grouped into one cluster pin.
- Cluster pin uses the exact same pill style as a price pin — white, 1px black/20 border, same shadow — just slightly larger and showing the count (e.g. `4`) instead of a price.
- Click a cluster pin: it expands. The member pins fan out in a tight ring around the cluster's anchor point (small radius, ~34-42px), each showing its own price and fully clickable. A faint connector/anchor dot marks the original spot.
- Collapse triggers: clicking the map background, clicking any pin outside this stack, expanding another cluster, or panning/zooming (recluster).
- Clicking an expanded member pin selects that listing exactly like today (card overlay opens, list highlight syncs) and keeps the stack open.
- Hover from the list still highlights the matching pin; if that listing sits inside a collapsed cluster, the cluster pin itself gets the active/highlight treatment and is raised to the front.
- Zooming in naturally splits clusters since grouping is recomputed in screen space on every idle/zoom event.
- Reduced-motion respected: expand/collapse uses a short transform transition, skipped when the user prefers reduced motion.
- Applies to both the authenticated home map and the onboarding preview map (same component, no behavioral fork).

## Technical notes

All in `src/components/onboarding/SampleListingsMap.tsx`:

- Add a clustering pass that runs on map `idle`/`zoom_changed` and whenever `listings` changes: project each listing to pixel space via the overlay projection, greedily group by distance threshold, and produce `clusters: { id, anchor LatLng, members: ListingPin[] }`.
- Generalize the existing `PinOverlay` to render either a price label or a count, and accept a pixel offset applied after the base translate so expanded members can be positioned around the anchor without changing their LatLng.
- Keep a `expandedClusterId` ref/state; a cluster with >1 member renders one counter pin when collapsed, and N offset member pins when expanded.
- Reuse the existing map `click` listener to clear both selection and `expandedClusterId`.
- Preserve the current active/hover styling, `bringToFront`, `panTo`, bounds fitting, and card overlay anchoring logic; single-listing clusters behave exactly as they do now.
- `activeId` resolution: if the active listing is inside a collapsed cluster, the card overlay stays anchored to the listing's own coordinates as today.
