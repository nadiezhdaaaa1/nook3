# Onboarding Success — commit-on-CTA plus four variants

## 1. The write problem

Today `onboarding.success.tsx` runs a mount effect that stamps `completedAt` and calls
`syncOnboardingToActiveSearch()` / `syncOnboardingToUser()`. Anyone who merely lands on the
page gets a search written, and the Success ↔ step-1 edit loop re-runs it. There is a second
writer too: `useDbSync.ts` has a "handoff" effect that inserts the first search and a separate
effect that persists `completed_at`. So the same intent is expressed in three places with no
ordering guarantee.

### Fix: one server function, one call site

New authenticated server function `commitOnboarding` (`src/lib/onboarding.functions.ts`):

- input: the full validated search payload (same shape `createSearch` already validates) plus
  `billingCycle` / `selectedPlan` for the profile mirror
- handler order, all inside one call:
  1. if the account already owns a search or `handoffCompleted` was recorded, skip the insert
     (idempotent — safe to retry)
  2. insert the search row
  3. mirror the profile contact/preference fields
  4. **last:** set `profiles.completed_at`
- returns `{ searchId, completedAt }`

There is no cross-statement transaction available through the Data API, so atomicity is
achieved by ordering rather than by a transaction: `completed_at` is written last and is the
only thing the gate reads as "onboarded". Any failure before that leaves the account
not-onboarded, so the gate sends the user back through onboarding — where the idempotency check
in step 1 adopts the already-inserted search instead of duplicating it. A duplicate-search bug
is the failure mode I care most about, and step 1 plus the existing `handoffCompleted` flag
covers it.

If you want true atomicity we can move steps 2–4 into a single `SECURITY DEFINER` SQL function
(`public.commit_onboarding(...)`) and call that from the server fn — one statement, one
transaction. I recommend this; it costs one migration and removes the partial-write reasoning
entirely. Plan assumes we do it, with the ordered fallback as the non-migration path.

### Call sites

- mount effect in `onboarding.success.tsx`: deleted
- `useDbSync.ts`: the handoff insert and the `completed_at` write are removed for the onboarding
  path. `useDbSync` keeps only reconciliation of pre-existing local searches, so it can no
  longer race the commit.
- `handoffCompleted` stays as the local guard and is set only after `commitOnboarding` resolves.

### Ordering vs. credentials

A search can only be written for an authenticated user, so on variant A the CTA sequence is:
authenticate → commit → redirect to `/checkout/mock`. The answers already live in the persisted
onboarding store, so after a Google round-trip or email signup the Success screen resumes,
sees a session and a pending-commit flag, runs `commitOnboarding`, then redirects.
`completed_at` is therefore set **before** payment: an abandoned checkout returns as an
onboarded account that owes money, which is what you asked for.

## 2. Variant structure

Selection is a pure function, not four screens:

```text
src/lib/onboarding/successVariant.ts
  pickSuccessVariant({ credentials, status, onboarded }) -> "A" | "B" | "C" | "D"
```

- A: `!credentials && !paid`
- B: `!credentials && paid`
- C: `credentials && onboarded && !paid`
- D: `credentials && paid && !onboarded`

Input comes from `accessQueryOptions()`; while it is loading we render the existing skeleton
rather than guessing (a guess would flash the wrong heading).

One layout, driven by a per-variant config object:

```text
{ heading, subhead, planCard: "editable" | "fact", body: "summary" | "searches",
  auth: "none" | "open" | "locked", cta: { label, action } }
```

The screen renders: heading/subhead → plan card → body → CTA block. Each slot reads the config,
so copy and CTA differences are data and the four variants share one JSX tree. Two body
components (`SearchSummary`, existing markup extracted as-is; `ExistingSearchesList`, new) and
one auth block with a `lockedEmail?: string` prop.

Per variant:

- **A** — plan card with Change plan → `/onboarding/pricing`; summary with Edit → step 1;
  auth open; CTA "Pay and start watching" → commit → `/checkout/mock`.
- **B** — "Last step — pick a password"; subhead as specified; plan card as fact plus the line
  "Plan changes are in Account after setup"; summary keeps Edit; auth locked to the email on
  file; CTA "Start my apartment search" → commit → `/home`.
- **C** — no summary, no Edit; `ExistingSearchesList` with a freshness count per search; plan
  card editable; CTA "Turn my alerts back on" → `/checkout/mock` (no commit — already onboarded).
- **D** — no auth block, no commit of credentials; CTA "Start my apartment search" → commit
  (search + `completed_at`) → `/home`.

## 3. Variant C freshness counts

New server fn `getSearchFreshness` returning per search
`{ searchId, count, window: "24h" | "7d" | "none" }`.

The count must come from the same code the digest uses, so the matcher is extracted into one
shared module (`src/lib/matching.shared.ts`) built from today's `applyFilters` /
`deriveFilterScope`, and both the digest path and this endpoint import it. If the two ever
disagree the number is a refund request, so a single import is the whole point.

Rules: try `created_at > now() - 24h`; if the count is below a small threshold, retry with 7d
and label the window; if 7d is also zero, return `window: "none"` and the UI renders the search
criteria with no number. A zero is never rendered next to a pay button.

## 4. Email locking

- `/signup` gains a `lockEmail` search param (validated string). When present the email input
  renders read-only with its value, and the field is not part of the editable form state.
- Variant B's "Continue with email" navigates to
  `/signup?redirect=/home&lockEmail=<email on file>`.
- Google: after the OAuth round-trip, compare the session email to the expected address. On a
  mismatch, sign out immediately and show "That Google account is name@example.com. This setup
  belongs to expected@example.com — sign in with that account instead." Naming both addresses
  is the point; a generic auth error strands the user.

Server side still re-checks: `lockEmail` is a URL param, so `commitOnboarding` verifies the
session's email matches the profile on file before writing. UI locking is UX, not security.

## 5. Risks I want to flag

- **`completed_at` before payment** is correct for your requirement, but it means the gate must
  route an onboarded-and-unpaid account to a paywall rather than to onboarding. That is the
  current `_authenticated` gate behaviour; I will verify it with a dev-panel pass through all
  four rows rather than assume.
- **Variant B is the riskiest path**: the account was created by payment and has no credentials,
  so a failed password step leaves a paying user unable to sign in. The mitigation is that
  variant B is re-enterable — they land back on it every time until credentials exist — plus a
  visible "we emailed you a sign-in link" fallback if you want one (say the word; not in scope
  as written).
- **The `useDbSync` handoff removal** is a behaviour change for accounts mid-flow with answers
  in localStorage and no search row. Variant D covers them: they land on Success, see the
  summary, and commit on the CTA.
- **Google returning a different address on variant A** (no email on file yet) has nothing to
  compare against, so the lock only applies to B/C/D. That is intended, but worth stating.

## 6. Files

- new: `src/lib/onboarding.functions.ts`, `src/lib/onboarding/successVariant.ts`,
  `src/lib/matching.shared.ts`, `src/components/onboarding/SearchSummary.tsx`,
  `src/components/onboarding/ExistingSearchesList.tsx`,
  `src/components/onboarding/SuccessAuthBlock.tsx`
- edited: `src/routes/onboarding.success.tsx` (restructured), `src/routes/signup.tsx`
  (`lockEmail`), `src/lib/queries/useDbSync.ts` (remove the two onboarding writers),
  `src/lib/searches.functions.ts` (share the insert payload validator)
- migration (recommended): `public.commit_onboarding(...)` `SECURITY DEFINER`
