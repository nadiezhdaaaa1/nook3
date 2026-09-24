# Replace grace-period dunning with frozen-data re-engagement

## User-visible result
- Failed payments no longer create a seven-day grace state. Only `trialing` and `active` accounts receive new matches.
- Onboarded canceled or expired accounts can still browse Home, Saved, listing details, and their existing frozen matches instead of being redirected to Account.
- Home and the Saved/Disliked listing tabs show a persistent, non-dismissible restart card with the approved copy for trial-ended, voluntary cancellation, or payment-failure cancellation.
- Account uses the same three cancellation causes for its existing restart card.
- The preview DevPanel exposes exactly four billing presets: Active, Canceled after trial, Canceled voluntary, and Canceled after dunning.

## Implementation
1. Simplify the server-derived access state: remove grace-window self-healing and grant access only for `trialing`/`active`. Keep the existing payment-failure timestamp as a historical cancellation-cause marker, and tolerate the legacy database enum value without treating it as access.
2. Change the authenticated gate so an onboarded user with valid credentials may enter the app even without subscription access. Keep unfinished onboarding and credential redirects unchanged, and keep existing search quota/upgrade enforcement unchanged.
3. Remove the app-wide dunning strip and delete its module, repair screen, and mock portal/invoice routes. Remove all remaining DevPanel controls and local overrides tied to `past_due` repair/grace testing.
4. Add one shared re-engagement model/component that derives:
   - after trial: canceled/none, never paid, no payment-failure marker;
   - after dunning: canceled with the payment-failure marker;
   - voluntary: canceled after prior payment, without that marker.
   It will seed the approved plan/cycle, disable trial mode, and navigate to `/checkout/mock`.
5. Render the shared card above the Home matches list and above the Saved and Disliked listing lists. Do not render it in the My searches tab, create a new tab, dismiss it, or alter existing listing data.
6. Align Account’s restart card with the same three causes and approved copy/actions while leaving its purchase cards and active/trialing states unchanged.
7. Update the DevPanel presets to write the exact marker combinations for all three canceled causes, invalidate profile/access data, and navigate so changes appear immediately.
8. Verify type/build diagnostics and use the preview DevPanel to check all four presets across Home, Saved, Disliked, and Account at desktop and mobile widths.

## Technical details
- No schema change: `past_due_since` remains the mock-friendly payment-failure marker requested by the spec; the legacy `past_due` enum value may remain for database compatibility but is removed from current UI presets and access logic.
- The shared banner will use existing Account card styling and `OriginButton`, with `role="status"`, semantic colors, responsive layout, and no dismiss control.
- Checkout selection uses `selectedPlan`, `billingCycle`, and `trialActive: false`; after-trial always chooses Pro monthly, while voluntary/dunning reuse the access state’s stored plan/cycle.
