# Fix: "Login / Email" shows Disabled after a password was set

## What's actually wrong

Two confirmed causes, both in the detection path:

1. **No profile row exists for this account.** A query on the database shows only one profile row (`sergekrush@gmail.com`); there is no row for the currently signed-in account `serjkrush@gmail.com` (it was wiped earlier). The account screen reads the `has_password` flag from that row, so it can never be true. Worse, the "Enable" flow writes the flag with an `update ... .single()` — with no row to update, the write fails silently for the user and the flag is never stored.
2. **The identity fallback can't work.** The screen also checks the auth identity list for an `email` provider. Setting a password on a Google-created account does not add an `email` identity (the live user record shows `google` only), so this fallback never flips to true either.

Net effect: the password really was set in auth, but the app has no persisted signal for it, so the row renders "Disabled / Enable".

## The fix

1. **Guarantee a profile row per account.** Make the profile write path create-or-update instead of update-only, so saving `has_password` (or timezone, phone, etc.) works even when the row is missing, and make the profile read self-heal by creating the row on first read. Also add the missing row for the current account so the screen recovers immediately.
2. **Make the flag authoritative.** Persist `has_password = true` when a password is set (Enable flow and password change), and treat the profile flag OR an `email` identity as "email/password enabled" — keeping the identity check only as a secondary signal.
3. **Surface failures.** If persisting the flag fails, show the error instead of closing the dialog as if it succeeded, so this can't silently regress.
4. **Keep the disconnect guard correct.** "Disconnect Google" stays blocked unless email/password is genuinely enabled, now judged from the reliable flag.

## Technical notes

- `src/lib/profile.functions.ts`: change `updateProfile` to an upsert keyed on `context.userId` (RLS still scopes to `auth.uid()`); `getProfile` inserts a default row when none exists instead of returning `null`.
- Migration/data: insert the missing `profiles` row for the current user id, and set `has_password = true` for it since the password already exists in auth.
- `src/routes/_authenticated.account.tsx`: `useSignInMethods` derives `hasEmailPassword` from `user?.hasPassword || emailIdentity`; `EnableEmailPasswordDialog` awaits the profile save and reports errors; the change-password flow also sets the flag.
- `src/lib/queries/useDbSync.ts` hydration currently bails when the profile is `null`; with `getProfile` always returning a row this path stops stalling.
- No visual/layout changes to the Profile section.
