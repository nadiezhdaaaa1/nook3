# Inset the preview header by 24px

## Goal
On `/onboarding/preview`, the sticky pill header should sit 24px away from the top and left edges of the screen and 24px away from the map panel on the right — matching the heading's alignment underneath it.

## Current behaviour
The header wrapper inside the left column uses negative horizontal margins (`-mx-6`) to bleed the header out to the column edges, and `top-0` so it touches the very top of the viewport. The left column also has no top padding, so the header starts flush with the top border.

## Changes
In `src/routes/onboarding.preview.tsx`, on the left column section and its sticky header wrapper:

1. Remove the negative horizontal margins from the sticky wrapper so the header respects the column's 24px horizontal padding. This gives a 24px gap on the left screen edge and a 24px gap to the map panel on the right.
2. Add 24px top padding to the left column and change the sticky offset to 24px, so the header sits 24px below the top border and keeps a 24px inset while it sticks during scroll.
3. Keep the existing 24px gap between the header and the heading below it.

## Notes
- The map panel keeps its own padding, so the visual gap between header and map stays a single 24px gutter rather than doubling.
- Applies to both mobile and desktop widths; no changes to the header component itself or to any data/logic.

## Files to change
- `src/routes/onboarding.preview.tsx`
