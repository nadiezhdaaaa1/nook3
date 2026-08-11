# Fix: searches silently switch to New York

## What's happening

The backend structure is fine — each saved search stores its own city (`searches.city_id`), and I confirmed in the database that the row named "Philadelphia Search" really does hold `city_id = nyc` plus NYC neighborhoods (Williamsburg, SoHo…). So the row itself was overwritten; the dropdown is displaying it honestly.

The overwrite comes from how the app edits searches. There are two layers:

- the saved searches list (source of truth, synced to the backend)
- a single "live editor" buffer left over from onboarding, which holds one search's answers at a time

Whenever the app copies the live buffer back into the active search, it writes the buffer's city with a hardcoded fallback to New York when the buffer is empty. The buffer is not refilled when searches load from the backend, and the "add a search" wizard clears it. So in common flows — reload the app, open the search switcher, cancel out of the new-search wizard, switch searches — an empty or stale buffer gets copied onto the active search, replacing its city with New York (and its budget/areas with the stale ones). The debounced auto-save then pushes that to the backend, permanently. The name stays as the user typed it, which is why it reads "Philadelphia Search · NYC".

This also explains the earlier report that the second search showed PHL details: switching searches snapshots the outgoing search from a buffer that belonged to a different search.

## The fix

1. **Never infer a search's city from the live buffer.** Remove `cityId` from the buffer→search copy entirely. A search's city is set once at creation and only changed through the explicit city-change action.
2. **Track which search the buffer belongs to.** The buffer records the id of the search it was hydrated from. Copying the buffer into a search is skipped unless the ids match, so an empty or foreign buffer can never clobber a saved search.
3. **Hydrate the buffer when searches load.** When the app loads searches from the backend and picks the active one, load that search into the buffer (and tag it) so the first edit doesn't write stale values.
4. **Isolate the new-search wizard.** While the wizard is open the buffer is tagged as a draft, so no auto-save touches the existing active search; on save the draft becomes a new search, on cancel the previous active search is re-hydrated.
5. **Repair the damaged rows.** Update the searches whose stored city no longer matches the data the user actually chose. The clean signal is the neighborhoods: rows whose saved areas don't belong to their stored city are inconsistent. Since the areas were saved as NYC areas too, the honest repair is to let the user re-pick the city for that search once (a one-time inline prompt on a search whose name/city look inconsistent), rather than guessing — I'll confirm with you which of your two existing searches should be Philadelphia and fix those rows directly.

## Technical notes

- `src/lib/store/bridge.ts`: drop `cityId` from `syncOnboardingToActiveSearch`; add an `editingSearchId` guard set by `hydrateOnboardingFromSearch` / cleared by the wizard; make `switchActiveSearch` snapshot only when the guard matches the outgoing id.
- `src/lib/onboarding/store.ts`: add `editingSearchId: string | null` (persisted) plus setter.
- `src/lib/queries/useDbSync.ts`: after the one-time hydration block sets `activeSearchId`, hydrate the buffer from that row and set the guard.
- `src/routes/_authenticated.search.new.tsx` + `new.$step.tsx`: mark the buffer as `"draft"` on mount, restore the previous active search's buffer on unmount/cancel.
- `src/lib/store/appStore.ts`: `changeSearchCity` keeps the name in sync when the name is still the auto-generated default for the old city.
- No schema change needed; the repair is a data update on `searches`.
