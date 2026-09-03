# Registration modal and onboarding flow simplification

## User-visible result
- Picking any plan from landing pricing, `/pricing`, or `/onboarding/pricing` captures the plan immediately.
- Visitors without a session see an accessible registration/sign-in modal and remain on the current page while the modal is open.
- Successful authentication continues to checkout (or commits onboarding first when coming from the onboarding pricing step).
- Existing signed-in users go directly to checkout when unpaid, or to Account when already subscribed.
- `/onboarding/success` is removed; `/thanks`, the four-step wizard, preview layout, checkout internals, login page, and signup page behavior remain working.

## Implementation
1. Extract the existing signup validation, consent, referral, email-confirmation, Google OAuth, and email/password auth logic into a reusable client-safe auth form module.
2. Add `RegistrationModal` using the existing dialog primitives, with signup/sign-in modes, forgot-password navigation, focus/ESC/backdrop behavior from the dialog primitive, post-auth callback, analytics, and `nook:postAuthPath` continuation storage for OAuth.
3. Update `PricingThreeTiers` to own consistent plan-intent capture and session/subscription branching, with source metadata passed by landing and pricing-page callers.
4. Add landing query validation/effect for `plan` and `cycle`; persist valid intent, remove the params from the URL, and run the same registration/checkout decision flow.
5. Update `/onboarding/pricing` to open the modal for anonymous users and commit onboarding before checkout/home for authenticated users.
6. Move the atomic onboarding commit to the onboarding-pricing authenticated handoff and the subscribed preview CTA; preserve the existing `handoffCompleted` guard and invalidate access state after commit.
7. Change route-gate fallback destinations to `/signup?lockEmail=1` for missing credentials and `/account` for onboarded users without access. Add/reuse Account subscription copy and CTA behavior for voluntary restart versus dunning-caused cancellation, keeping the previous plan selected.
8. Delete `/onboarding/success`, remove its success-variant machinery and all references, update auth redirect/fallback and dev links, and leave `/thanks` unchanged.
9. Extend analytics event constants and fire modal-open, modal-auth-success, and checkout-redirect events with source/plan/cycle context.
10. Verify route generation, build diagnostics, and key modal/CTA behavior in the running preview.

## Assumptions
- The existing `useHasSession` and access query are the source of truth for session/subscription decisions.
- Registration-modal OAuth continuation targets `/checkout/mock`; onboarding-pricing auth continuation returns to that page, where the opener performs the authenticated onboarding commit before navigating.
- Account subscription UI is the correct destination for both onboarded no-access cases; dunning copy is selected from existing server-derived status and `pastDueSince`, not client storage.
