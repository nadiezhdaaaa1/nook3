# Plan: Fix search city label mismatch

## Problem
In the header SearchSelector dropdown, the "New York City Search" item shows city code **PHL** instead of **NYC**. The selected search in the screenshot is "Philadelphia Search", but the city label for the New York item should always be derived from its own search data, not the active search.

## Diagnosis
`SearchSelector.tsx` renders the city label with `cityLabel(s.cityId)` for each search item, which is the correct per-item logic. The most likely cause is that the persisted `Search` object for "New York City Search" actually has `cityId: "philadelphia"`, so the UI faithfully shows PHL. This can happen when a user creates a new search (or duplicates an existing one) while the active search is Philadelphia, then renames the new search to "New York City Search" without changing the city field.

## Steps

1. **Inspect persisted state**
   - Read the stored `nook.app.v1` localStorage entry (or DB search rows) to confirm whether the New York-named search has `cityId: "philadelphia"`.
   - If the mismatch is confirmed, note which other fields are out of sync (neighborhoods, budget, transit preferences) to decide the safest repair.

2. **Audit the data creation flows**
   - Review `NewSearchModal.tsx` and `_authenticated.search.new.tsx` to confirm they use the city selected by the user when calling `createSearch()`.
   - Review `duplicateSearch()` in `appStore.ts` to confirm it copies the source city (expected) but also check that the rename path is clear about the city not changing.

3. **Add a repair path for the mismatched search**
   - Option A: allow editing a search's city from the saved-searches list or search editor.
   - Option B: add a one-time `zustand` migration that re-aligns `cityId` with the city name only when the mismatch is unambiguous and safe.
   - Recommended: implement Option A (city edit) so the user can fix it manually, and add a small safeguard warning when a search name clearly references a city that does not match its `cityId`.

4. **Verify the UI**
   - Open the SearchSelector dropdown and confirm the New York item now shows `NYC` and the Philadelphia item shows `PHL`.
   - Confirm switching the active search does not change the other items' city labels.

## Outcome
The dropdown shows the correct city code for each search, and the city field is editable so future mismatches can be corrected without deleting the search.
