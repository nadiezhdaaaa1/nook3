# App restructure: searches, home screen, new header

## What changes

### 1. Onboarding becomes the first Search
Everything collected during onboarding (city, budget, move-in, bedrooms/baths, rent protection, neighborhoods, amenities, transit, commute, alert channel & frequency) is written to the database as a saved Search the moment the account is created. Today it only lives in the browser, so it can be lost.

Quotas stay as they already are in the backend: 1 active search on Free, 3 on Premium, unlimited on Max. Hitting the limit opens the existing upgrade dialog.

### 2. New home screen: listings + map
A new home screen at `/home` mirrors the onboarding preview layout: listing cards on the left, map with matching pins on the right (selection and hover synced both ways, same card design). Signing in and finishing onboarding land here.

Listings shown for the active search: real saved alerts when there are any, otherwise sample listings so the screen is never empty (labelled as a sample).

### 3. New header
Left side:
- Logo
- Vertical separator
- Search selector button: `Live`/`Paused` status dot + label, city name, search name, chevron.

Clicking the selector opens a dropdown:
- "New search" row pinned at the top (shows remaining quota; opens the upgrade dialog when at limit).
- One row per saved search: name, city, status, and brief info (budget range, bedrooms, number of neighborhoods, alert count), plus a pencil icon that opens that search's settings.
- Archived searches stay behind a collapsed "Archived" section.

Right side — four icon-only buttons with tooltips:
- Saved listings
- Wren chat (locked chip for Free)
- Referrals
- Account

The current left sidebar with "Search settings / Activity / Account" groups is removed from the app shell.

### 4. Search settings move into edit
Search settings become the edit surface for one search, at `/search/$searchId`, keeping the current left-menu layout with exactly four items: Notifications, Budget & Criteria, Apartment Details, Location. The edit screen always edits the search in its URL (not a global "active" search), so switching searches from the header is unambiguous.

"New search" asks for a name + city, creates the search, then drops the user into the same edit screen.

### 5. URL restructure
| Old | New |
| --- | --- |
| `/preferences` | `/search/$searchId/notifications` |
| `/preferences/budget` | `/search/$searchId/budget` |
| `/preferences/apartment` | `/search/$searchId/apartment` |
| `/preferences/location` | `/search/$searchId/location` |
| `/preferences/alerts` | `/saved` |
| `/preferences/wren` | `/wren` |
| `/preferences/referrals` | `/referrals` |
| `/preferences/account` | `/account` |
| — | `/home` (new) |

Old paths keep working via permanent redirects (search-scoped ones redirect to the currently active search). `/app` continues to redirect, now to `/home`.

## Technical notes

- New routes under `src/routes/_authenticated.*`: `home`, `saved`, `wren`, `referrals`, `account`, plus a `search.$searchId` layout route with four child routes. Existing page bodies move over largely unchanged; the shell/sidebar logic is what gets rewritten.
- New `src/components/app/AppHeader.tsx` (logo, separator, search selector, icon actions with shadcn `Tooltip`) replaces `TopBar` + `SidebarNav` in the old `_authenticated.preferences.tsx`. `SearchSwitcher` is rewritten into `SearchSelector` with the richer per-row summary, top-anchored "New search", and pencil-to-edit.
- Home screen reuses `SampleListingsMap` and `PreviewListingCard`; a small adapter maps `saved_alerts.listing` rows onto the sample-listing shape so one card component serves both sources.
- Search-scoped routes read `$searchId`, set it as the active search on mount, and `notFound()` when it does not belong to the user. Existing `useDbSync` debounced auto-save keeps handling persistence; `useOnboardingStore` stays the editing buffer via the existing bridge.
- Onboarding persistence: after sign-up succeeds on `/onboarding/success`, call the existing `createSearch` server function with the mapped onboarding state, then navigate to `/home`.
- No database migration needed — `searches`, `saved_alerts`, and the quota trigger already cover this.
- `head()` metadata added per new route, `noindex` for all authenticated screens.
