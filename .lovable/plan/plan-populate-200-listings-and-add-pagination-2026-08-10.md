# Plan: Populate 200 listings and add pagination

Goal: Add ~200 fake listings to the database so the authenticated home screen list is long enough to justify pagination, then implement real pagination UI.

## What we will build

1. Seed 200 fake listing rows into `public.saved_alerts` attached to the current preview user's active search (the user/search that already has one alert row).
2. Refactor the alert list query to support server-side pagination (`limit` / `offset` + total count).
3. Add pagination UI to the home screen (page number buttons, page size 20, so 10 pages for 200 listings).
4. Keep the map showing all matching pins; only the card list paginates.

## Technical approach

- Database: insert 200 rows into `saved_alerts` with realistic `listing` JSON, varying addresses, neighborhoods, prices, beds, baths, and images.
- Server function `listAlerts`: add `limit` and `offset` input parameters, return `{ alerts, total }` from `createServerFn` (or a new shape). Use `count` query for total.
- TanStack Query: update `alertsQueryOptions` to include page params and query key.
- Home screen (`_authenticated.home.tsx`): add local pagination state (or URL search params), render page controls below the card list, wire in page size 20.
- Map: continues to receive all matching pins from the server-side query (or from a separate lightweight pin endpoint if performance becomes an issue).

## Verification

- Database row count for the target search should be ~201 (1 existing + 200 new).
- Home screen should show 20 cards and a pagination bar.
- Clicking page 2 loads the next 20 cards.
- Map pins remain visible for all listings.

## Open decision

Should the page number live in the URL (`?page=2`) or local state? Local state is faster to implement and doesn't require URL validation. For a preview/test setup, local state is recommended unless you want shareable URLs.
