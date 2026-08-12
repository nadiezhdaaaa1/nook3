# Fix the right-side gap on stat-card illustrations

## What's happening

The illustration box on each Account stat card is 96 px wide × 80 px tall, but the artwork itself is taller than it is wide (160 × 192). With `object-contain`, the image scales to fit the height and is then centred, leaving roughly 15 px of empty space on the left and right — that is the gap next to the right edge.

## The fix

- Anchor the artwork to the bottom-right instead of centring it (`object-bottom right`), so no space is left between the image and the card's right edge.
- Keep the visible artwork at 80 × 96 px so its natural proportions are preserved and nothing is cropped.
- Two of the three source images (bell, clock) also have a few pixels of empty space along their own bottom edge; nudge them down by that amount so all three sit visually flush with the card's bottom edge.

Visual-only change in `src/routes/_authenticated.account.tsx` — no data or logic touched.
