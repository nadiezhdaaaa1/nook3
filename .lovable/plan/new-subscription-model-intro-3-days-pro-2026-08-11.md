# New subscription model: Intro (3 days) → Pro

Replaces the Free / Premium / Max ladder with one product in two states, per the attached spec. Design stays as-is; only logic and copy change — plus one requested layout change to the search selector.

## The model

| State | Price | What the user gets |
|---|---|---|
| Intro (days 1–3) | $0 | Full speed, no delay. Only the 3 best matches per email. 1 search — the one from onboarding. |
| Pro monthly (from day 4) | $14.99/month | Every match we find. Up to 3 searches, each with own filters, city, frequency and quiet hours. |
| Pro annual | $95.88/year ($7.99/mo, save 47%) | Same as Pro. Never automatic — bought manually on the landing page or via "Switch to annual" in Account. |

Max tier is removed everywhere. After the intro ends the charge is always monthly, never annual.

## Backend

- New `entitlement_state` on the profile: `intro` | `pro` | `expired`, with intro start/end timestamps (reusing the existing trial timestamps) and `matches_per_digest` (3 during intro, unlimited on Pro).
- Search quota comes from the entitlement state: intro/expired = 1 search, pro = 3. The existing quota trigger is updated accordingly.
- Plan/billing writes stay service-role only (unchanged security model). Checkout stays out of scope — the state is set through the existing mock plan update path until Stripe is wired.
- Existing `premium` profiles map to `pro`; existing `max` profiles also map to `pro`.

## Landing / pricing

Three cards in the current design:
1. **3 days free** — "See how it works, on your real search." · `$0 for 3 days → then $14.99/month` · CTA **Start 3 days free** · rows: daily or weekly, alerts with no delay, locked "only your 3 best matches per email", locked "1 search — the one you set up at signup" · disclosure: "Card required. After 3 days $14.99/month until cancelled. Cancel anytime in Account → Subscription in two steps."
2. **Pro** — "When you're actively looking." · `$14.99 /month` · CTA **Get Pro now** · rows: daily or weekly, no delay, every match we find, up to 3 searches — own filters, own cities.
3. **Pro annual** — "Same plan, paid once a year." · `$7.99 /month · billed $95.88/year · Save 47%` · CTA **Get Pro annual**.

Removed: Max card, global −47% toggle above the cards (discount now lives on the annual card), post-MVP bullets, 7-day refund line. Shared footer line: "All plans include: all filters and must-haves · match explanations, including what's missing · quiet hours in your timezone · 24/7 monitoring of your city."

## Account → Subscription

- Intro state: days remaining and what happens next, plus **Unlock all matches now**.
- Pro monthly: **Switch to annual** card. Pro annual: current plan.
- Cancel row always shows **Cancel on {period_end}**; ARL line: "Auto-renews at {price} until cancelled. Cancel anytime in Account → Subscription in two steps."
- Max plan card, badge and colors removed; plan badge becomes Intro / Pro.

## Search limits and copy

- Add-search button copy: **Add another search**.
- Blocked on intro: "A second search is part of Pro. Unlock all matches and up to 3 searches for $14.99/month."
- Blocked at 3 on Pro: "You're using all 3 searches. Edit or delete one to add another."
- The existing over-limit "disabled search" behaviour is kept for users dropping from Pro back to 1 search.
- Per-search frequency and quiet hours already live on the search record; intro users keep a single search so this needs no change.

## Requested design change: 3 search slots

Home header selector and Saved → My searches show exactly three slots:
- Filled slot: larger card with status dot, name, city, summary and edit action.
- Empty slot: dashed 1px border, plus icon and centered label ("Add another search").
- On intro, empty slots render locked (muted, lock icon) and clicking opens the upgrade modal with the intro copy above.

## Technical notes

- Migration: `entitlement_state` enum + column on `profiles`, `matches_per_digest`, backfill from current plan, update `enforce_search_quota` and `admin_set_plan`.
- Frontend: `SEARCH_LIMITS` keyed by entitlement state; `PricingThreeTiers`, `PricingLanding`, `PricingSection`, `UpgradeModal`, `PlanBadge`, `PlanLimitsBanner`, `_authenticated.account.tsx`, `SearchSelector`, `_authenticated.saved.tsx` updated. `max` removed from client plan types with a compatibility mapping for stored values.
- Email digest changes (3-match cap, unlock banner, intro_started/intro_ending emails, per-search digest sections) are backend/email work outside this frontend scope — flag as follow-up unless you want them now.
