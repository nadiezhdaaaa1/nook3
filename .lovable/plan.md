# Fix: deletion state in "Privacy & data" needs a reload

## What's wrong

The red banner at the top reads deletion state straight from the server profile, so it flips instantly. But the "Delete account" row in Privacy & data (and its button) read the same state from the in-memory app store, and that store is filled **once** on first load and never refreshed afterwards. So scheduling or reversing deletion updates the server and the banner, while that row keeps its old title, text and button until a page reload.

## The fix

1. Make the deletion mutations write the fresh values they already get back from the server into the app store: `deletionRequestedAt`, `deletionScheduledAt`, `subscriptionCanceledAt`, `subscriptionPeriodEnd`. Both "schedule deletion" and "keep my account" do this, so the row, its button, and anything else reading the store update immediately.
2. Add a small ongoing sync so any later profile refresh (other tab, refetch on focus) also keeps those store fields current, instead of only the very first load.
3. Verify the row swaps between "Delete account" and "Account scheduled for deletion" (with the date) in both directions with no reload, and that the reversal path also restores the button.

## Technical notes

- `src/lib/queries/profile.ts`: in `useScheduleAccountDeletionMutation` and `useCancelAccountDeletionMutation` `onSuccess`, call `useAppStore.getState().updateProfile({...})` with the returned user's deletion + subscription fields (keeps the existing `invalidateQueries`). This also removes the need for the ad-hoc partial store update currently done inside `handleDelete` in the account route.
- `src/lib/queries/useDbSync.ts`: keep the one-time hydration as-is, but add an effect that mirrors `profileQ.data` deletion/subscription fields onto `useAppStore` whenever the query data changes after hydration (no searches/onboarding logic touched).
- No database or server-function changes; no visual changes.
