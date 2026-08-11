# Fix: saving a listing on the map re-zooms and drops the pin

## What happens today

Confirmed from the code on the matches screen:

1. Saving a market listing creates a saved row in the backend. The feed then replaces the original catalog listing with that saved row, and the row carries a **new id**.
2. The map re-fits its viewport whenever the set of listing ids changes — so the id swap makes it zoom back out to fit the whole city. The dislike and report actions already suppress this re-fit; save does not.
3. The saved row stores only title, price, beds, baths and neighborhood — **no coordinates**. Its pin is re-derived from the neighborhood centroid, so the pin jumps to the neighborhood centre, and if that neighborhood name isn't in the city's map data the listing has no coordinates at all and is dropped from the map entirely. That is the "listing is disappearing".

## What to build

**1. No re-zoom on save**
Suppress the next viewport fit in the save handler, the same way dislike and report already do.

**2. Keep the pin exactly where it was**
Store the listing's real coordinates on the saved row and read them back, so a saved listing keeps its original position instead of collapsing to a neighborhood centroid.

**3. Never lose a pin**
When merging saved rows into the feed, carry over the coordinates (and image) from the matching catalog listing if the saved row has none, so a saved listing can never fall out of the map or the list.

**4. Keep the card selected**
After saving, the id of the card changes. Re-point the currently selected/expanded listing at the new id so the open card stays open and highlighted instead of collapsing.

## Technical notes

- `src/routes/_authenticated.home.tsx`: add `mapRef.current?.skipNextFit()` in `handleToggleSave`; in `alertToListing`, prefer stored coords, then a catalog match by `address|rent`, then the neighborhood centroid; add coords to `toSnapshot`; remap `activeId` when a saved row supersedes a catalog id.
- `src/lib/alerts.functions.ts`: extend the listing snapshot schema with optional `lat`/`lng` (optional so existing rows keep validating).
- No database migration needed — the snapshot is stored as JSON.
- Older saved rows without coords keep working through the catalog-match fallback.
