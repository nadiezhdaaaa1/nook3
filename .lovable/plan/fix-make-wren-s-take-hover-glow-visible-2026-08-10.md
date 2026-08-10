# Fix: Make Wren's Take Hover Glow Visible

## Problem
The Wren's take button in `PreviewListingCard.tsx` has a multicolor glow element added on hover, but it is not visible in the preview. The glow element currently uses low-opacity radial gradients (`0.35`, `0.28`, `0.22`) with a heavy blur (`12px`) and is layered underneath the `#FFF1EA` cursor-expansion circle, which may be masking it.

## Goal
Make the hover glow clearly visible without changing the `#FFF1EA` hover fill or the dark text/icon colors.

## Plan
1. Inspect the current layering in `PreviewListingCard.tsx` and confirm the glow element is being rendered.
2. Test candidate adjustments in the live preview:
   - Increase glow opacity and reduce blur so the color is more saturated.
   - Ensure the glow sits *behind* the `#FFF1EA` cursor-expansion circle but still reads as a glow rather than being fully covered.
   - Optionally widen the glow slightly beyond the button bounds (e.g. `-inset-1` or scale) so it catches the eye.
3. Pick the strongest-but-subtle variant that is visible against both the white card background and the `#FFF1EA` open state.
4. Verify the glow is visible on hover in the preview for both closed and opened Wren's take states.

## Technical details
- File: `src/components/onboarding/PreviewListingCard.tsx`
- Component: `WrenTakeButton` (lines ~98-131)
- Current glow: `motion.span` with three radial gradients, `blur(12px)`, opacity 0→1 on hover, pulsing `scale` animation.
- Constraints: keep text and icons `#241C12` in all states; keep `#FFF1EA` hover/open fill.
