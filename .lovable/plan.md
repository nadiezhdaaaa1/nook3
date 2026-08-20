Increase hero deck line weight

The hero deck line "Real-time apartment alerts that put you first" in `src/components/landing/heroB/HeroB.tsx` currently uses `font-weight: 400` in the `.hero-b-deck` CSS rule. Change it to `font-weight: 500` (medium) for a bolder read while keeping it subordinate to the H1's `font-weight: 600`. Verify the visual hierarchy in the preview after the change.