# Fix: deleting the last search + empty state for "My searches"

## What's wrong now

Confirmed cause: the local app store's `deleteSearch` intentionally re-creates a search when you delete your last one. If nothing non-archived remains, it builds a fresh default search (New York) and makes it active — so the search never appears to be deleted, even though the backend row is removed.

There is also no empty state: the "My searches" tab always renders a card grid, and the Filters button on Home stays enabled even with no saved search.

## Changes

1. Allow a truly empty search list
   - Remove the auto-bootstrap branch from `deleteSearch` so deleting the last search leaves zero searches and clears the active search.
   - Home falls back to no active search instead of an invented one.

2. Empty state for the "My searches" tab
   - When there are no searches at all (live or archived): show a single centered white card on the page background with:
     - Heading: "No saved searches yet"
     - Subtext explaining that a search is what powers alerts and the Home feed
     - Main Origin Button "Create a search" → `/search/new/1`
   - Hide the card grid and the empty-slot placeholders in that state.

3. Home with no search
   - Disable the Filters button (and its count badge) when there is no active search; keep the tooltip explaining a search is needed.
   - Keep the existing "create your first search" path reachable from Home's empty content area.

## Technical notes

- `src/lib/store/appStore.ts` — drop the re-bootstrap block in `deleteSearch`; set `activeSearchId: null` when nothing remains.
- `src/routes/_authenticated.saved.tsx` — early-return empty state inside `SearchesTab`.
- `src/routes/_authenticated.home.tsx` — `disabled` on the Filters `OriginButton` when `!search`.
- No schema or server-function changes; the delete server function already works correctly.
