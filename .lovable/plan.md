# Fix: disliked listings never reach the "Disliked listings" tab

## What's happening

Disliking a listing on the home screen only hides it locally. Confirmed in the code and the data:

- `handleDislike` in `src/routes/_authenticated.home.tsx` adds the id to local `hiddenIds`, and only writes to the backend `if (alert)` — i.e. only when the listing already has a saved-alert row.
- The home list is currently fed by `SAMPLE_LISTINGS` (the sample/market pool), so those listings have no row at all. Nothing is written, and after a refresh the dislike is forgotten entirely.
- `saved_alerts` currently holds only rows with status `saved` — zero `dismissed` rows, which is why the tab is always empty.
- The `/saved` "Disliked" tab reads `rows.filter(r => r.status === "dismissed")`, so it is correct; it just has nothing to show.

The same gap applies to "Report" (`handleReport`): the report is recorded, but the listing is not marked dismissed unless a row already existed.

## The fix

1. Add a backend function that creates a dismissed snapshot row for a listing that has no row yet (mirroring the existing "save snapshot" path), taking the search id, the listing snapshot and the dislike reason.
2. In `handleDislike` / `handleReport`: if an alert row exists, keep the current status update; otherwise call the new function so the dislike is persisted with its reason.
3. Keep the same guard used by saving: if the active search isn't persisted yet (non-UUID local id), show the existing "Create a search first" toast instead of failing silently.
4. Keep the local hide so the card disappears immediately, and rely on the persisted `dismissed` status to keep it hidden after reload (home already filters out `dismissed`).
5. "Undo" on the Disliked tab already sets status back to `new`; that will now surface the listing again on home.

## Technical notes

- New server fn `dismissListingSnapshot` in `src/lib/alerts.functions.ts` (auth middleware, zod input `{ searchId: uuid, listing, dismissReason }`, inserts `status: "dismissed"`), plus a mutation hook in `src/lib/queries/alerts.ts` that invalidates the alerts queries so both home and `/saved` refresh.
- No schema change needed: `saved_alerts.status` already has the `dismissed` enum value and `dismiss_reason` exists.
