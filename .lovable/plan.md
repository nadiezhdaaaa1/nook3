# Fix Pro subscription cards on the account page

The plan cards in `/account#plans` do not match the pricing spec uploaded in `nook_plans_5.html`. The current layout uses a Monthly/Annual toggle and renders the annual price inside the Pro card, but the spec treats **Pro annual as a separate third card** and uses different copy, labels, and iconography.

## Goal
Restructure the account-page plan options so the cards match the uploaded spec exactly: three distinct offers (Intro, Pro monthly, Pro annual), with the correct state-aware CTA labels, feature icons, and badges.

## What will change

### 1. Remove the Monthly/Annual billing toggle
- Delete the `BillingToggle` from the "Plan options" section header.
- The toggle is replaced by rendering the annual plan as its own card.

### 2. Split the plan model into three cards
Introduce a third plan definition for the annual tier, e.g.:

```text
Intro    → $0 for 3 days → then $14.99/month
Pro      → $14.99 /month
Pro annual → $7.99 /month, billed $95.88/year, Save 47% badge
```

- Keep `Plan` type values (`free`, `premium`, `max`) and `BillingCycle` unchanged.
- Derive the third card locally from the existing Pro annual price (`$95.88/year`).

### 3. Render the right cards for each state
- **During Intro trial (`plan === "free" && trialActive`)**: show Intro card (Current) + Pro monthly card (CTA: "Unlock all matches now").
- **On Pro monthly (`plan === "premium" && billingCycle === "monthly")**: show Pro monthly card (Current, CTA: "Cancel on {periodEnd}") + Pro annual card (CTA: "Switch to annual").
- **On Pro annual (`plan === "premium" && billingCycle === "annual")**: show Pro annual card (Current) + Pro monthly card (CTA: "Switch to monthly" or equivalent downgrade label).
- **Legacy `max` profiles**: treat as Pro monthly for card rendering.

### 4. Update card copy and CTAs per spec
- Intro: label "3 days free", tagline "See how it works, on your real search.", price "$0 for 3 days", bill line "then $14.99/month", disclaimer "Card required. After 3 days $14.99/month until cancelled. Cancel anytime in Account → Subscription in two steps."
- Pro monthly: label "Pro", tagline "When you're actively looking.", price "$14.99 /month", bill line context-aware ("billed today" / "next charge {date}"), CTA "Unlock all matches now" when upgrading, "Cancel on {date}" when current.
- Pro annual: label "Pro annual", tagline "Same plan, paid once a year.", price "$7.99 /month", bill line "billed $95.88/year", badge "Save 47%", CTA "Switch to annual" in account, disclaimer "$95.88 charged on {date}, then yearly until cancelled. Cancel anytime in Account → Subscription in two steps."

### 5. Fix feature list iconography
- Intro: two checkmarks for included features, two lock icons for limited features ("Only your 3 best matches per email", "1 search — the one you set up at signup"), with the limited text highlighted.
- Pro: four checkmarks; bold the two value-prop lines ("Every match we find", "Up to 3 searches — own filters, own cities").

### 6. Keep related components in sync
- Verify `PricingThreeTiers.tsx` and `onboarding.pricing.tsx` already reflect the same three-tier model (Intro, Pro, Pro annual). If they still use the old two-card + toggle layout, update them to match.

## Out of scope
- No backend schema changes: `Plan`, `BillingCycle`, and `trialActive` already support the needed states.
- No checkout/webhook work: the user previously paused Stripe wiring, so CTAs remain demo/toast flows unless checkout is already wired.

## Verification
- Preview `/account#plans` in Intro state and Pro monthly state.
- Confirm three-card layout on landing/pricing pages, two-card layout in account cabinet, and correct CTA labels/badges.
