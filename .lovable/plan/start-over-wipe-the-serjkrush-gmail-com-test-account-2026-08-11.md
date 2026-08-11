# Start over: wipe the serjkrush@gmail.com test account

Goal: remove all app data for `serjkrush@gmail.com` (and the login itself) so you can run signup → onboarding → search → alerts from a clean slate.

## What gets deleted

For user `serjkrush@gmail.com` (`e68b87df-…f6a51206`):

- 4 searches
- 26 saved / disliked listing rows
- Any listing reports, Wren chat conversations and messages
- Referral rows, referral events and queued referral notifications tied to this user
- The profile row (plan, trial, timezone, referral code) and its role row

Nothing shared is touched: the city listings catalog, blocked email domains, waitlist, newsletter and contact submissions all stay as they are.

## Order of operations

1. I delete the dependent rows first (chat messages before conversations, alerts before searches, referral rows before profiles), then the profile and role row.
2. You remove the login: Cloud → Users → find `serjkrush@gmail.com` → delete user. That is the one step I cannot do from here.
3. If you'd rather keep the same login, tell me and I'll stop after step 1 — the email/password keeps working and you'd re-enter onboarding with an empty profile.
4. After the login is gone, I re-check the tables to confirm nothing is left behind, then you sign up fresh and walk the flows.

## Notes

- This is a data-only change; no source files change.
- The signup trigger recreates a fresh profile + `user` role automatically when you register again, so onboarding will start from a truly empty state.
