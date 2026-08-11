# Fix: home screen shows only a couple of matches

## What's actually wrong

The 5,000 listings are in the database and correct (500 per city, verified). The home screen just isn't using them.

The feed has an either/or switch: if you have **zero** saved/new alert rows, it shows the city catalog; the moment you have **even one** alert row, it switches to showing *only* those alert rows. Your account has 2 non-dismissed alerts, so the home feed shows 2 listings and the whole 500-listing city catalog is ignored — including the match count and pagination, which come from the alerts table in that mode.

A second, smaller issue: the seeded listings only cover 11 neighborhoods per city, so a search that selects neighborhoods outside that set silently narrows the pool (a saved search with a $1,000–$2,000 budget also matches almost nothing, since NYC listings start at ~$1,895).

## The fix

1. **Remove the either/or switch.** The home feed always builds from the city catalog, with the user's alert rows merged in (deduped by address + price) so saved/contacted listings still appear and keep their state.
2. **Apply the saved search criteria to the catalog properly** — budget range, bedroom types and minimum bathrooms — instead of the current budget-only pass with a silent "if nothing matched, ignore neighborhoods" fallback. Replace that fallback with an explicit empty-state message telling the user which criterion is too narrow ("No listings in your selected neighborhoods yet — widen the search").
3. **Pagination and the match count come from the merged, filtered list** in all cases, not from the alerts table total.
4. **Broaden seeded neighborhood coverage**: re-seed so each city's listings spread across all neighborhoods offered in that city's onboarding picker (and, for NYC, extend the low end of the rent range so lower budgets aren't empty). Same deterministic generation, just wider spread.

## Technical notes

- `src/routes/_authenticated.home.tsx`: delete `isSample`, build one `listings` memo = catalog (filtered by search scope) merged with `allAlertListings` keyed on `address|rent`; always paginate `visibleListings` client-side; `totalMatches = visibleListings.length`. Drop the now-unused `usePaginatedAlertsQuery` usage.
- Search-scope filtering (budget / beds / min baths / neighborhoods) reuses `applyFilters` + `deriveFilterScope` from `src/lib/app/filters.ts` rather than the ad-hoc inline filtering, so scope and user filters behave identically.
- Re-seed migration for `public.listings`: distribute across each city's neighborhood list from `src/data/cities/*`, widen rent bands, keep `slug` stable and `status = 'active'`.
- No schema, RLS, or grant changes needed.
