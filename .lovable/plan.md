# Fix hero card glow: corner artifacts + true terracotta

Scope: the demo listing cards in the landing hero only (`src/components/landing/heroB/HeroB.tsx`). No app cards, no layout, no tilt behaviour changes.

## 1. The corner bug

The glow ring layers sit 3px outside the card (`inset: -3px`) but reuse the card's own 24px corner radius via `border-radius: inherit`. On a box that is 6px wider and taller, a 24px radius is too tight, so the ring cuts across the rounded corners and leaves visible hard edges / stray colour blobs at the top-left and bottom-left corners.

Fix: give the outset layers their own radius equal to the card radius plus the ring width (24 + 3 = 27px), so the ring stays concentric with the card. The outer bloom keeps the card's radius since it is inset at 0.

## 2. Glow colour

Right now the hue is driven off cursor position (`--base: 18` plus up to 25 degrees of drift) and the border layer is pushed through `brightness(2)`. Both together shift the light towards amber/yellow — that is what reads as "not our terracotta" and what tints the corner artifacts.

Fix: lock the glow to the brand terracotta `#D66C38` and drop the hue drift and the brightness boost, so the spotlight, ring, bloom and card-face wash are all the same terracotta at different intensities. The white specular hotspot stays (it is what makes the ring look lit rather than painted), just slightly toned down so it does not wash the terracotta out.

## Technical details

In the `<style>` block of `ListingCard`:
- Replace the `--hue` drift variable with a fixed terracotta colour token (`--glow-rgb: 214 108 56`) and use `rgb(var(--glow-rgb) / <alpha>)` in the card background spotlight, the `::before` ring, and the `.hero-b-card-bloom` halo.
- Remove `filter: brightness(2)` from `::before`; compensate with a slightly higher `--border-spot-opacity`.
- Add `border-radius: calc((var(--radius) + var(--border)) * 1px)` to `.hero-b-card::before, .hero-b-card::after` instead of `border-radius: inherit`.
- Lower `--border-light-opacity` so the white specular layer accents rather than dominates.
- Reduced-motion fallback (static terracotta border) stays unchanged.

## Verification

Hover a hero card in the preview and confirm the ring is terracotta end to end, follows the cursor, and the corners are clean rounded arcs with no yellow fringe.
