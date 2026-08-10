# Saved page → three tabs

Restructure `/saved` into a tabbed page: **Saved listings**, **My searches**, **Disliked listings**.

## Tabs (top of page)

Segmented tab bar in the app style (pill row, active = dark charcoal / paper text), each tab with a count. Tab state lives in the URL (`?tab=saved|searches|disliked`) so it survives reload and can be linked.

## Tab 1 — Saved listings

- Every listing the user saved (alerts with status `saved`, plus `new`/`contacted` kept as saved-state today — see technical notes).
- Cards use the same visual component as the home page listing list (`PreviewListingCard`), so the look matches exactly, with the same `ListingActions` row (save/unsave, dislike, report).
- Keeps the existing per-search scope chips when the user has more than one search, and the existing "Compare 2–3 with Wren AI" bar.
- Empty state: short prompt with a link back to the home matches.

## Tab 2 — My searches

- One card per saved search (non-archived), in the project card style (`#fffdf7` surface, `border-black/10`, 12px radius).
- Card shows: search name + Live/Paused status dot, city, and all options as small muted text — budget range, move-in, bedrooms/bathrooms, rent protection, broker fee, neighborhoods (with "+N more" past a few), amenities/transit preferences count, commute cap, alert channel + frequency.
- Edit button on each card → the existing search edit flow (`/search/$searchId`).
- "New search" card/button at the top, respecting the plan quota (1 free / 3 premium / unlimited max) — disabled with an upgrade hint when the quota is used up.

## Tab 3 — Disliked listings

- Listings the user dismissed via the Dislike action.
- Same card component, rendered dimmed (reduced opacity, muted image) with the title struck through, and the dislike reason shown as a small label ("Too expensive", "Wrong location", …).
- Each card gets an "Undo" action that restores it to the matches list.
- Reported listings are not shown here (they are a separate moderation action).

## Technical notes

- Data: `saved_alerts` already stores `status` (`new` | `saved` | `contacted` | `dismissed`) and the listing snapshot, so Saved = non-dismissed rows, Disliked = `dismissed` rows.
- The dislike reason is currently collected in the UI (`ListingActions` passes it) but discarded. Add a nullable `dismiss_reason text` column on `public.saved_alerts` via migration, accept it in `updateAlertStatus`, and pass it from the home screen's dislike handler so tab 3 can show real reasons. Rows dismissed before this change show no reason label.
- Reuse `PreviewListingCard` for all listing cards; map `SavedAlert` → the card's `SampleListing` shape in one small adapter so the three tabs share it.
- Searches come from the existing `searchesQueryOptions` / app store; no new backend work there.
- Keep `AppPage` as the wrapper; title stays "Saved" with the tabs directly beneath.
