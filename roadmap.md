# Roadmap

## Listing detail drawer Figma restyle
- [x] Match the shared desktop and mobile drawer to Figma nodes 319:34 and 319:728
- [x] Add drawer-only listing actions while preserving card/map action visuals
- [x] Keep exact no-source copy and existing drawer behavior
- [x] Verify TypeScript, build, and responsive interaction states

## Registration modal + remove /onboarding/success
- [x] Shared auth logic module extracted from /signup
- [x] RegistrationModal (signup + sign-in modes, Google, confirm-email state)
- [x] Plan-intent flow hook used by landing pricing, /pricing, /onboarding/pricing
- [x] Landing `plan`/`cycle` query-param arrival contract
- [x] Commit onboarding at new call sites (post-auth pricing flow, subscribed preview CTA)
- [x] Delete /onboarding/success + success-variant machinery, update all references
- [x] Route gate redirects: no credentials → /signup?lockEmail=1; onboarded no-access → /account#subscription
- [x] Account subscription restart copy for voluntary churn vs dunning cancellation
- [x] Analytics events for modal open / auth success / checkout redirect
