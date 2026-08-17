# Remove the archive concept from searches

A search either exists or is deleted. Everything archive-related comes out, and the two remaining statuses collapse into a simple "alerts on/off" boolean.

## 1. Header search selector

- Drop the collapsed "Archived (n)" section and its toggle from the header dropdown; it lists only existing searches.
- Remove the archive icon import and the archived/live split — one list.

## 2. Searches tab (Saved page)

- Remove the archived split, the "· Archived" label, the archived opacity styling, and the archived guard on card click (clicking any card switches the active search).
- Plan-slot counting uses all searches instead of non-archived ones.

## 3. Remove archive machinery

- Store: delete `archiveSearch` and `restoreSearch` actions and their type entries.
- Search model: remove `archivedAt`.
- `SearchSwitcher` (preferences): remove the archive/restore icon buttons, `canArchive`, the archived section, `showArchived` state, and the `ArchivedRow` component.
- Sweep for any other "Archive"/"Restore" labels or icons.

## 4. Data model: `status` becomes `alertsEnabled`

- `Search.status: "active" | "paused" | "archived"` is replaced by `alertsEnabled: boolean`. The `SearchStatus` type is removed.
- Persisted local state migrates on load: `active` → `alertsEnabled: true`, `paused` → `false`, and stored `archived` searches are dropped.
- Plan-limit / quota counting (`selectQuota`, `lock.ts`, `PlanLimitsBanner`, account page, saved page) counts all searches.
- Over-limit handling keeps working: overflow searches are still flagged disabled through the existing lock logic, now flipping `alertsEnabled` to `false` instead of setting status `paused`.

## 5. Deletion is the only removal path

The existing delete dialog on the Searches tab keeps its type-to-confirm behaviour, with copy that names all four things that go away:

> Delete this search? This permanently removes its criteria, alert settings, match history, and the apartments you saved from it.

Deleting a search continues to remove its saved/dismissed listings through the existing database cascade — no new permission rules (last search / main search) are added in this task.

## 6. Untouched

The "Disliked listings" tab is a different entity and stays exactly as is.

## Technical notes

- Backend keeps the existing `searches.status` column; the sync layer maps `alertsEnabled` ↔ `active`/`paused` in `searches.shared.ts` (`toDbRow`, `toUpdatePatch`, `dbRowToSearch`), and `archived_at` stops being written. Any archived rows still in the database are filtered out when rows are read, so no risky enum surgery is needed now. A follow-up migration can drop the `archived` enum value and the `archived_at` column once no rows use them.
- Files touched: `src/lib/store/types.ts`, `src/lib/store/appStore.ts`, `src/lib/store/lock.ts`, `src/lib/searches.shared.ts`, `src/lib/searches.functions.ts`, `src/lib/onboarding.functions.ts`, `src/lib/queries/useDbSync.ts`, `src/components/app/SearchSelector.tsx`, `src/components/preferences/SearchSwitcher.tsx`, `src/components/preferences/PlanLimitsBanner.tsx`, `src/routes/_authenticated.saved.tsx`, `src/routes/_authenticated.account.tsx`.
- Zustand persist `version` bumps to 2 with a `migrate` step performing the status → `alertsEnabled` conversion and archived-row drop.
