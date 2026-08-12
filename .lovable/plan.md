Home-screen empty state when there are no saved searches

Goal
- When the user has no saved searches (or no active search), the home screen should stop showing listings and instead show a message in the listings column prompting them to create a search. The map panel remains visible for context, but no listing pins are rendered.

Current state
- `src/routes/_authenticated.home.tsx` uses `useActiveSearch()`. If `search` is `null`, it still falls back to city `nyc` and renders the full catalog of listings, because the filter scope is empty when no search exists.
- The `Filters` button is already disabled when `!search`.
- `src/routes/_authenticated.saved.tsx` already has a similar empty-state card style with a white rounded card, a headline, subtext, and a Main Origin Button.

Changes
1. In `HomeScreen` (`src/routes/_authenticated.home.tsx`), add a hydration guard so the empty state does not flash before the store rehydrates.
2. When `search` is `null` after hydration, render the empty-state card inside the listings column (the right-hand side on mobile, the left-hand side on desktop) and pass `pins=[]` / `activeListing={null}` to `SampleListingsMap` so the map shows the city but no listing pins.
3. Empty-state copy:
   - Headline: "No searches yet"
   - Body: "Create a search to start seeing matches on your home screen."
   - CTA button: "Create a search" (Main Origin Button, medium size).
4. On click, navigate to `/search/new/$step` with `step: "1"`.

Visual details
- White card with `rounded-[16px]`, `border border-black/10`, centered text, `px-6 py-12`.
- Headline: `text-[22px] font-semibold text-[#241c12] font-['Google_Sans_Flex',sans-serif]`.
- Body: `text-[15px] leading-[22px] text-charcoal-600`, max width `420px`.
- CTA: `mt-6` centered.

Verification
- Type-check the project after the change.
- Confirm in the dev preview that deleting the last search clears the listing pins and shows the empty-state card in the listings column.
