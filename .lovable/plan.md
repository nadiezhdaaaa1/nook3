# Fix: delete-account dialog reappears after "Keep my account"

## What happens

The Delete account button and its dialog live in one component. When deletion is scheduled, that component swaps to the "Keep my account" button, which throws the dialog away while its "is open" flag is still held by the surrounding component. Pressing "Keep my account" swaps the button back, the old flag is still set, and the deletion dialog pops up again — mid-flow state and all.

Exact ordering of the close vs. the swap is not confirmed by reading alone, so the fix makes the dialog's visibility impossible to get wrong instead of relying on the close firing at the right moment.

## The fix

1. Tie the dialog's visibility to account state, not just the button flag: it can never be shown while the account is scheduled for deletion.
2. Clear the open flag as soon as deletion becomes scheduled, so returning from "Keep my account" always starts from a closed dialog.
3. Ensure the dialog's internal step/reason/feedback state starts fresh next time it opens, rather than resuming step 2.
4. Verify the round trip on the Account page with no reload: delete flow → banner + "Keep my account" → press it → row returns to "Delete account" with no dialog; opening it again shows step 1.

## Technical notes

- `src/routes/_authenticated.account.tsx`, `DeleteAccountButton`: keep `DeleteAccountDialog` rendered from a single return, pass `open={open && !scheduledAt}`, and add an effect that calls `setOpen(false)` when `scheduledAt` becomes truthy.
- `DeleteAccountDialog`: reset local state on close via a `key` tied to the open cycle (or reset on `open` transition) instead of the 200 ms timeout that fires after unmount.
- Frontend only; no server function, query, or database changes.
