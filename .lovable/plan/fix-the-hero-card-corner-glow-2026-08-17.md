# Fix the hero-card corner glow

## Changes
- Replace the current corner-fringing mask construction with a true rounded border-ring mask using `exclude`/`xor`, so the 3px glow remains inside one concentric 24px contour.
- Rebuild the bloom from the same rounded ring geometry and constrain its blurred output, preventing the terracotta strip from escaping at the lower-left or other corners.
- Keep the existing cursor tracking, 2.5° spring tilt, white card surface, 200ms fade, and main terracotta `#D66C38` glow unchanged.
- Preserve the reduced-motion static-border behavior.

## Verification
- Hover all four corners and edges in the live landing-page hero and confirm the glow follows the pointer without wedges, doubled radii, or color drift.
- Check the card at desktop and narrow/mobile widths and confirm its layout and tilt behavior remain unchanged.
