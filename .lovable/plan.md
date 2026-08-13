# Subscription gate: plan rename, subscription status, routing gate

Data model + gate only. No new screens, no visual work.

## Things I found that change the approach — read first

1. **`profiles.completed_at` is NULL for every existing profile (all 7 rows).** `completedAt` is written only into the onboarding zustand store (`onboarding.success.tsx`); nothing ever pushes it to the DB, even though `updateProfile` already accepts it. So gating on `completed_at` today would bounce **every existing user, including yours, into onboarding**. Two mandatory pieces before the gate can ship: wire the write, and backfill existing rows.
2. **`profiles.entitlement_state` is already an enum `('intro','pro','expired')`** and is what `enforce_search_quota()` actually reads for the 1-vs-3 search limit. Renaming `app_plan` to `intro | pro` gives us two columns with near-identical names and meanings. Recommendation: keep `plan` as the tier of record (renamed as you asked), and treat `entitlement_state` as deprecated — kept in sync by `admin_set_plan` as it is today, with a follow-up pass to delete it and derive quota from `plan` + `subscription_status`. Deleting it in this pass would mean rewriting the quota trigger in the same migration that swaps the enum; doable, but it widens blast radius. Flagging so you choose.
3. **`has_password` is a user-writable profile column** (`profilePatchSchema` allows it). Using it as half of the `credentials` flag means a user can flip their own gate input. The trustworthy source is Supabase Auth identities (`email` / `google` providers). Plan below derives `credentials` from auth, not from the profile boolean.
4. **`credentials = none` + `subscription = active` is close to unreachable**: every sign-up path today produces either a password identity or a Google identity. That row of your table will effectively be dead code. Keeping it as a defensive fallback is fine, just don't expect traffic.
5. **Gate lock-out risk:** users with `canceled`/`none` get sent to `/onboarding/pricing`, which means they can no longer reach `/account` — where cancel-subscription, data export and account deletion live. Suggest exempting `/account` (and sign-out) from the gate. Also, a scheduled-for-deletion account still needs `/account` to reverse deletion.
6. **`past_due` expiry must be computed server-side.** `past_due_since + 7 days` evaluated on the client is trivially bypassable by clock change. The profile server fn returns a computed `accessAllowed` / `effectiveStatus`; the client gate only reads that.

## 1. Plan enum rename (`free|premium|max` → `intro|pro`)

DB migration:
- `CREATE TYPE public.app_plan_v2 AS ENUM ('intro','pro')`.
- `ALTER TABLE profiles ALTER COLUMN plan DROP DEFAULT`, then `TYPE app_plan_v2 USING CASE plan WHEN 'free' THEN 'intro' ELSE 'pro' END`, then default `'intro'`.
- Recreate `admin_set_plan(uuid, app_plan_v2, billing_cycle)`; drop the old signature; re-apply the `REVOKE ... FROM anon/authenticated` + `GRANT EXECUTE ... TO service_role` block (per security memory).
- `DROP TYPE public.app_plan`. Rename `app_plan_v2` → `app_plan` last so type name stays stable for generated types.
- Guard trigger `prevent_billing_field_self_update` is column-based, not value-based — unchanged.
- `enforce_search_quota` unchanged (reads `entitlement_state`).

Client:
- `src/lib/onboarding/store.ts`: `type Plan = "intro" | "pro"`; persist `version: 4` with a migrate step mapping `selectedPlan` `free→intro`, `premium|max→pro`.
- `src/lib/store/types.ts`: `SEARCH_LIMITS = { intro: 1, pro: 3 }`; drop the "Infinity for max" comments.
- `src/lib/billing.functions.ts`: `z.enum(["intro","pro"])`.
- `src/lib/queries/billing.ts`: replace the three toast strings (`"You're on Intro"` / `"Welcome to Pro!"`).

## 2. New profile columns

```
subscription_status  enum app_subscription_status ('none','trialing','active','past_due','canceled')  not null default 'none'
past_due_since       timestamptz null
```
Backfill: existing `plan='premium'` rows → `'active'`; `plan='free'` rows → `'trialing'` if `trial_active` else `'none'`. Both columns added to the guard trigger's protected list (service-role / `admin_set_plan` writes only). Reuse existing `subscription_canceled_at`, `subscription_period_end`, `completed_at`, `has_password` — nothing duplicated.

Backfill `completed_at` for existing accounts: `completed_at = created_at` for any profile that owns at least one row in `searches` (and, given only 7 rows exist and all are yours/testers, optionally all rows — your call).

## 3. The three flags

Computed in one place — a new `getAccessState` server fn (in `src/lib/profile.functions.ts`, `requireSupabaseAuth`), returning:

```
{ credentials: boolean, status: 'none'|'trialing'|'active'|'past_due'|'canceled',
  accessAllowed: boolean, onboarded: boolean, plan: 'intro'|'pro' }
```

- `credentials` — from Auth identities (password identity present OR `google` identity linked), read via the admin Auth API inside the handler; not from `has_password`.
- `status` — `subscription_status`, with `past_due` downgraded to `canceled` server-side once `now() - past_due_since > 7 days` (and the row updated, so it self-heals).
- `onboarded` — `completed_at is not null`. Set once, never unset. Deleting all searches does not touch it. `handoffCompleted` in the onboarding store stays as-is and is not consulted by routing.

`onboarding.success.tsx` starts persisting `completedAt` through `useUpdateProfileMutation` instead of only into zustand.

## 4. The gate

`src/routes/_authenticated.tsx` keeps `ssr: false`. `beforeLoad` after the existing `getUser()` check:

```ts
const access = await context.queryClient.ensureQueryData(accessQueryOptions())
```

Because `beforeLoad` is awaited, the route does not render until access resolves — no flash of app content, and no SSR bounce (the whole subtree is client-only already). While it resolves, the router shows the route's `pendingComponent`, which will render the existing `HydrationSkeleton`. `useDbSync`'s profile query reuses the same cache entry, so this adds no extra round trip in practice.

Routing, in order:

| credentials | status | onboarded | → |
|---|---|---|---|
| any | past_due (within 7d) | any | app |
| set | active / trialing | yes | app |
| set | active / trialing | no | `/onboarding/step/{lastStep}` |
| set | none / canceled | yes | `/onboarding/pricing` |
| set | none / canceled | no | `/onboarding/step/{lastStep}` |
| none | active / trialing | any | `/onboarding/success` |

`lastStep` read from `useOnboardingStore.getState().lastStep` (clamped 1–4, default 1). Exempt paths (proposed): `/account`, so a canceled or deletion-scheduled user can still pay, export or reverse.

## 5. Other `free` / `premium` / `max` readers I found (not in your list)

Must change (functional):
- `src/lib/store/appStore.ts` — default `plan: "free"` and five `?? "free"` fallbacks.
- `src/lib/store/bridge.ts:138`, `src/lib/store/migrate.ts:65` — `?? "free"`.
- `src/lib/store/lockHooks.ts:7`, `src/routes/_authenticated.saved.tsx:313`.
- `src/routes/api/wren-chat.ts:103` — gate is `plan !== "premium" && plan !== "max"`; becomes `plan !== "pro"` (or status-based).
- `src/routes/_authenticated.search.$searchId.notifications.tsx` — `PLAN_COPY.premium`, `minPlan: "premium"|"free"`, `freeFallback`.
- `src/components/app/PlanBadge.tsx` — `PlanKey = "free"|"premium"|"max"`.
- `src/components/landing/PricingThreeTiers.tsx` — `Tier.plan: "free"|"premium"` on three tiers; feeds `/onboarding/pricing`.
- `src/routes/_authenticated.account.tsx` — `PLANS` ids `"free"/"premium"`, ~20 `plan.id === "free"` branches, plan-rank helper.
- `src/routes/onboarding.success.tsx` — `PLAN_META`/`PLAN_VARIANT` keyed by `Plan`, `plan !== "free"`, button variant switch.

Cosmetic only, left alone unless you say otherwise: `origin-button` variant names `premium`/`max`, and marketing/legal copy mentioning Free/Premium/Max in `terms.tsx`, `refunds.tsx`, `index.tsx`, `signup.tsx`, `r.$code.tsx`, `_authenticated.referrals.tsx`, `data/blog/articles.ts`, `data/cities/chicago.ts`.

## 6. Order of work

1. Migration: new status enum + columns + `completed_at` backfill + plan enum swap + `admin_set_plan` rebuild + guard-trigger column list.
2. Regenerated types land; then client type rename and all readers above.
3. Persist `completedAt` to the profile on onboarding success.
4. `getAccessState` server fn + query options.
5. Gate in `_authenticated.tsx` + `pendingComponent`.
6. Verify with a browser pass: existing pro account reaches the app; a fresh `/signup` account lands on step 1.
