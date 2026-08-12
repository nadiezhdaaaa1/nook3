# Sign-in methods in the Profile section

Turn the Profile card into a clear list of sign-in methods, so the user can see which ones are active and add the missing one.

## Rows and states

The Profile card keeps Timezone, then shows sign-in method rows:

1. **Google Account** — only when the account has a Google connection.
   - Sub: `Connected <email>`
   - Right button: `Disconnect`
   - Clicking it opens a short dialog: if email/password is not enabled yet, it explains that Google is currently the only way in and that they must enable Email/Password sign-in first (button: `Enable Email/Password`). If email/password is already enabled, it asks for confirmation and then removes the Google connection.

2. **Login / Email** — always shown.
   - Enabled: sub shows the account email, no button (email is not editable).
   - Not enabled (Google-only account): sub reads `Disabled`, right button `Enable`. `Enable` opens a dialog that shows the fixed email (read-only, from the account) and asks for a new password twice; on success email/password sign-in becomes active.

3. **Password** — only when email/password is enabled. Existing row and Change-password dialog, unchanged.

So a user can end up with Google + Email + Password all listed at once. The email address is never editable anywhere; whatever email the account was created with (or came from Google) is used for all methods.

## Edge cases

- Google-only user cannot disconnect Google — never leave an account with no way to sign in.
- Email/password-only user simply sees no Google row (no "Connect Google" row is added, since this was not requested).
- Loading state while the connected methods are being read; failures show a neutral message, not a red error.

## Technical notes

- Source of truth for which methods exist: `supabase.auth.getUserIdentities()`, read once on mount in the account route. `provider === "google"` drives the Google row; `provider === "email"` drives the Email/Password + Password rows.
- Unverified detail to confirm during implementation: whether setting a password on a Google-only account makes an `email` identity appear. If it does not, we add a `has_password boolean` flag on `profiles` (default false), written by a small authenticated server function right after the password is set, and use `identities.email || profile.has_password` as the "email/password enabled" signal.
- Enable flow: `supabase.auth.updateUser({ password })` for the current session; no email change is ever sent.
- Disconnect flow: `supabase.auth.unlinkIdentity(googleIdentity)`, then refresh the identity list.
- All new UI reuses `OriginButton` (tertiary for row actions), the existing dialog primitives, and the same row markup/spacing as the current Timezone/Password rows; the lock asset stays on the Password row and the Google favicon asset already in the project is used for the Google row.
