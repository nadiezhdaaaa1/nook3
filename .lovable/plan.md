# Fix: deleted search reappears after reload

## What's happening

Deleting a search does remove it from the database — but the app then immediately
re-creates it. The database shows a fresh "New York City Search" row created a
couple of minutes ago for your account, right after the delete.

The cause is the onboarding hand-off: the browser still keeps the onboarding
answers (city, budget, bedrooms…) from when you first signed up. The sync layer
has a rule "if this account has zero searches but the browser holds onboarding
answers, save them as the first search". Deleting your last search satisfies that
condition, so the onboarding answers get inserted again as a brand-new search.

A second, related path can also resurrect a search: an unsaved local search kept
in browser storage is re-inserted by matching its name against the database.

## The fix

1. Treat the onboarding hand-off as a one-time event per account. Once it has run
   (or once the account has ever had a search), clear the stored onboarding
   answers and mark the hand-off done so it can never re-fire after a deletion.
2. Record deleted search ids in a short-lived "tombstone" list so neither the
   hand-off nor the local-search reconciliation can re-insert a search the user
   just deleted.
3. Make deletion clear the in-memory editing buffer when the deleted search was
   the one being edited, so no stale draft is left to be re-saved.

## Technical notes

- `src/lib/queries/useDbSync.ts`
  - Effect 1b (onboarding hand-off): guard with a persisted "handoff done" flag
    instead of a per-mount ref, and call the onboarding store's `reset()` after a
    successful insert so the answers can't be reused.
  - Effect 1c (local reconcile): skip any local search whose id is in the
    tombstone set.
- `src/lib/store/appStore.ts`: `deleteSearch` records the id in a
  `deletedSearchIds` set (persisted with the store) and clears the onboarding
  editing buffer when it pointed at the deleted search.
- `src/lib/onboarding/store.ts`: add the persisted `handoffCompleted` flag used
  by the guard above.
- No database or schema changes; the existing `deleteSearch` server function is
  already correct.

## Verification

- Delete the only search, reload: the searches list stays empty with the empty
  state, and no new row appears in the database.
- Delete one of several searches, reload: only that one is gone.
- A fresh sign-up right after onboarding still gets its first search saved once.
