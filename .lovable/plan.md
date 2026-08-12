# Fix: "Also cancel my subscription" does nothing

## What's wrong

Two separate flows track subscription cancellation, and they don't talk to each other:

- The **Plan options → Cancel subscription** dialog marks the subscription canceled only in the browser (a `nook:subCanceled` flag in local storage). It never touches the account record.
- The **Delete account** flow saves the checkbox choice to the account record (`deletion_cancel_subscription`) but nothing acts on it — no cancellation happens, and the Plan options card still shows an active, auto-renewing subscription.

So checking "Also cancel my subscription" is recorded as an intent and then ignored.

## What to change

1. Make cancellation a real account state instead of a browser flag: store `subscription_canceled_at` (and keep the period-end date) on the user's profile, and read it in the Plan options card so the "canceled — active until <date>" state survives reload, other devices, and sign-out.
2. Point the existing standalone Cancel/Renew dialogs at that state (same UI and copy, just persisted server-side instead of local storage). Migrate a user who currently has the local flag set so nothing regresses for them.
3. When the delete-account flow is confirmed with the checkbox checked, cancel the subscription in the same step — one server call that both schedules deletion and sets the cancellation. Unchecked leaves billing untouched, exactly as the copy promises.
4. Reversing the deletion ("Keep my account") clears the deletion schedule but leaves the subscription canceled — the user can turn auto-renewal back on with the existing Renew action. The confirmation toast will say so.

Note: real Stripe billing is still paused, so this cancels the subscription state in the app (plan access continues to period end, no auto-renew). When Stripe is wired up, the same server call is where the provider cancellation gets added — no UI rework needed.

## Technical notes

- Migration: add `subscription_canceled_at timestamptz` and `subscription_period_end timestamptz` to `public.profiles` (nullable). No new grants needed — profiles already has them.
- `src/lib/profile.functions.ts`: extend `scheduleAccountDeletion` to set `subscription_canceled_at = now()` when `cancelSubscription` is true; add `setSubscriptionCanceled` server fn for the standalone Cancel/Renew dialogs. `cancelAccountDeletion` clears deletion fields only.
- `src/routes/_authenticated.account.tsx`: `SubscriptionSection` drops the `localStorage`/`useEffect` flag and derives `canceled` from the profile query, with a one-time migration of an existing local flag; `periodEnd` reads the stored value with the current 18-day fallback.
- `src/lib/profile.ts` mapper and `src/lib/queries/profile.ts` gain the new fields so the plan card re-renders on mutation success.
