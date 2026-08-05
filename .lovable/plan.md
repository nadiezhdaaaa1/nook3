Apply the character-roll hover effect from the Hero A CTA to the main menu options, Sign in, and the header CTA button.

## What to do
1. Extract a reusable `RollText` component from the existing `RollCta` animation logic in `src/components/landing/heroA/HeroA.tsx` so it can wrap any `<a>`, `<Link>`, or `<button>` element with the same hover effect.
2. Apply the reusable component to the persistent marketing header (`src/components/marketing/MarketingHeader.tsx`):
   - Desktop nav links: How it works, What you get, Pricing, FAQ, Blog
   - Desktop Sign in link
   - Desktop and mobile CTA buttons (Get free alerts / Get alerts)
3. Apply the same reusable component to the Hero A inline nav (`src/components/landing/heroA/HeroA.tsx` in `HeroNav`):
   - Desktop nav links: How it works, What you get, Pricing, FAQ, Blog
   - Sign in link
   - CTA button (Get free alerts)
4. Preserve current styling, fonts, colors, and accessibility behavior (screen-reader-only duplicate label, reduced-motion fallback, focus-visible outline).
5. Verify the build succeeds and the hover effect works on all target elements in the preview.

## Technical notes
- The new component should accept `children` (the text label), `className`, and `as`/`render` props so it can wrap TanStack `Link` and native `<a>`/`<button>` without losing route behavior.
- Keep the existing animation timing: 0.35 s per character with 0.02 s stagger, `EASE_REVEAL`, and opacity fallback for reduced motion.
- Leave the original `RollCta` in Hero A unchanged or refactor it to use the new `RollText` internally to avoid duplicated code.
