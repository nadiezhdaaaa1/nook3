# Remove alerts on/off toggle — active search shown by a checkmark

Searches no longer have an on/off alerts state in the UI. Every non-archived search simply runs. The only thing shown is which search is currently selected, marked with a checkmark.

## What changes

### Header search selector (dropdown)
- Remove the colored status dot (green / peach ring) from the pill and from each row in the list.
- Keep the checkmark on the currently selected search row; it becomes the only selection indicator (kept in the brand green, aligned left of the name).
- Row subtitle drops the status word: `NYC · $2k–$5k · studio/1br · 14 areas`.
- Rows that are over the plan limit keep their existing "Disabled" treatment (dimmed + label), since that's a plan-limit concept, not an alerts concept.

### Saved page → Searches tab
- Remove the status dot and the "Alerts on / Alerts off" text from each card subtitle (keeps city, alert count, and the over-limit note).
- Add a checkmark next to the name of the currently selected search, matching the dropdown, and make tapping the card select that search so the checkmark is meaningful.

### Search detail page (`/search/:id`)
- Remove the "Turn alerts on" / "Turn alerts off" button (and the "Disabled" variant of that button) from the header actions; Rename and Delete stay.
- Remove the "Alerts are off" banner from the page.

### Other surfaces
- Filters sheet: drop the status dot and status label from its search header.
- Legacy preferences search switcher: remove its status dots and the pause/resume icon button; keep rename, duplicate, archive, delete, and the existing checkmark for the active row.
- Landing page: replace the "Alerts off whenever" feature tile with a tile that doesn't reference pausing, and rewrite the FAQ answer that tells users to turn alerts off instead of canceling.
- Store quota error message no longer mentions turning alerts off; it just says the plan allows N searches and to delete or upgrade.

## Technical notes

- Data model untouched: `status` keeps `active | paused | archived` in the store, DB, and `searches.functions.ts`. New searches already default to `active`; nothing in the UI can produce `paused` anymore.
- `pauseSearch` / `resumeSearch` store actions and `PausedSearchBanner.tsx` become unused and get removed from the UI layer (the store actions stay defined so no DB/type churn is required, or are deleted if nothing references them — decided at edit time to keep typecheck clean).
- Any legacy record that is still `paused` renders exactly like an active one, so no migration is needed.
- Files touched: `src/components/app/SearchSelector.tsx`, `src/components/app/FiltersSheet.tsx`, `src/routes/_authenticated.saved.tsx`, `src/routes/_authenticated.search.$searchId.tsx`, `src/components/preferences/SearchSwitcher.tsx`, `src/components/preferences/PausedSearchBanner.tsx` (removed usage), `src/components/landing/WhatYouGetGrid.tsx`, `src/components/landing/FaqFifteen.tsx`, `src/lib/store/appStore.ts`.
