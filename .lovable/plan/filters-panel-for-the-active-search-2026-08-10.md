# Filters panel for the active search

Add a Filters panel to the matches screen. It reuses the onboarding option controls, but every control is clamped to what the saved search already allows — filters narrow results, they never widen them beyond the search.

## Behaviour

Opens from the existing "Filters" button as a slide-over sheet (right side on desktop, bottom sheet on mobile).

Sections, each derived from the active search:

- **Rent range** — slider bounded by the search's own budget (e.g. search $2,000–$4,000 → slider min $2,000, max $4,000).
- **Bedrooms** — only the bed types saved in the search; toggle on/off. Empty selection = all of them.
- **Bathrooms** — options at or above the search's minimum only.
- **Neighborhoods** — only the neighborhoods saved in the search; deselect/reselect freely. Empty = all saved ones.
- **Amenities** — only amenities present in the search. "Required" ones from the search stay locked on with a small "from your search" note; "nice to have" ones can be toggled into a hard filter.
- **Transit lines** — same rule as amenities, limited to the lines in the search.
- **Broker fee** — shown only when the search allows fee listings; lets the user narrow to no-fee.
- **Move-in** — shown only when the search has a specific date; lets the user narrow the window.

Footer: **Reset filters** (back to the search's own scope), **Show N matches** (applies and closes).
Header: **Edit this search** button that closes the panel and navigates to the search's edit screens (`/search/{id}/budget`), where the underlying scope itself can be widened.

Empty result state inside the list: "No matches with these filters" plus a reset link.

If the active search has no budget/neighborhoods yet, the panel shows a short note pointing at "Edit this search".

Filters are per-search, kept in memory for the session, and reset when the user switches searches.

## Technical notes

- New `src/components/app/FiltersSheet.tsx` using the existing sheet/dialog primitives and `OriginButton`; reuses `RentSlider`, `PillGroup`/`ObChip`, and `TriStateToggle` from `src/components/onboarding/` where they fit.
- New `src/lib/app/filters.ts`: `MatchFilters` type, `deriveFilterScope(search)` (bounds from the `Search` snapshot in `src/lib/store/types.ts`), `defaultFilters(scope)`, and `applyFilters(listings, filters)` matching against `AlertListing` fields (price, beds, baths, neighborhood, tags).
- Filter state lives in `_authenticated.home.tsx` (`useState`, keyed off `search?.id`, reset in the existing effect that resets `page`).
- Pagination: the current server-side paging can't apply client filters. When any filter is active, the list switches to filtering `alertsQ.data` (all rows, already fetched for the map) and paginating locally with the same 20/page UI and the existing `getPaginationItems` layout. With no filters active, behaviour is unchanged.
- The map keeps showing the filtered set so pins and cards stay in sync.
- Filters button gets a count badge when filters differ from the search scope.
- No database or server-function changes.
