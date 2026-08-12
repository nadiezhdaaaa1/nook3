# Fix cropped Account stat-card illustrations

## Change
- Keep each illustration at its requested fixed size.
- Remove the negative bottom/right offsets that push most of the image outside the card.
- Anchor the complete image at the card’s bottom-right edge with `bottom-0 right-0` and retain `object-contain` so it is not internally cropped.

## Verification
- Check all three Account stat cards at the current desktop viewport and a mobile viewport.
- Confirm every illustration is fully visible, aligned flush to the bottom-right corner, and does not cover the stat label or value.
