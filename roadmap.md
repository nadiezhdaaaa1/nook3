# Roadmap

## Listing detail drawer Figma restyle
- [ ] Match the shared desktop and mobile drawer to Figma nodes 319:34 and 319:728
- [ ] Add drawer-only listing actions while preserving card/map action visuals
- [ ] Keep exact no-source copy and existing drawer behavior
- [ ] Verify TypeScript, build, and responsive interaction states

## Registration modal + remove /onboarding/success
- [ ] Shared auth logic module extracted from /signup
- [ ] RegistrationModal (signup + sign-in modes, Google, confirm-email state)
- [ ] Plan-intent flow hook used by landing pricing, /pricing, /onboarding/pricing
- [ ] Landing `plan`/`cycle` query-param arrival contract
- [ ] Commit onboarding at new call sites (post-auth pricing flow, subscribed preview CTA)
- [ ] Delete /onboarding/success + success-variant machinery, update all references
- [ ] Route gate redirects: no credentials → /signup?lockEmail=1; onboarded no-access → /account#subscription
- [ ] Account subscription restart copy for voluntary churn vs dunning cancellation
- [ ] Analytics events for modal open / auth success / checkout redirect
