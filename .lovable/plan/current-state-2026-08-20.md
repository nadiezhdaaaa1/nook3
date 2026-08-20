Fit hero H1 into exactly 3 lines

## Current state
- H1 copy: "Find your next apartment faster. Real-time apartment alerts that put you first."
- H1 style: 58px, line-height 120%, letter-spacing -1.54px, max-width inherited from `.hero-b-copy` (640px).
- Hero grid: `1fr 0.5fr` with 40px gap on a 1280px container.

## Goal
Make the hero H1 render as three lines without breaking the layout or the card column.

## Approach
Tackle it with two levers at once: typography and container width.

1. **Typography tweak** — reduce H1 from 58px to 54px and line-height from 120% to 1.05–1.08. This keeps the headline large but makes the full text fit a 3-line block cleanly.
2. **Container width tweak** — raise `.hero-b-copy` max-width from 640px to 720px (and H1 to 100% of that width). At the current grid ratio, the left column has enough room for 720px without pushing the card column out of bounds.
3. **Controlled line breaks** — if the natural wrap still lands on 4 lines or creates awkward breaks, insert a `<br>` between the two sentences and optionally between "alerts" and "that" so the break is intentional:
   - Line 1: "Find your next apartment faster."
   - Line 2: "Real-time apartment alerts"
   - Line 3: "that put you first."

## Verification
- Check the rendered H1 at desktop viewport (1280px+).
- Check at 1100px breakpoint where the grid collapses to single column.
- Check that the card column still fits inside the 1280px container.

## Out of scope
- No copy changes to the wording itself.
- No changes to the card or grid ratio (unless verification proves the card is clipped).
