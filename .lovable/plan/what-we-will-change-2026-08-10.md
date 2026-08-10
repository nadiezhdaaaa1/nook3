Restructure the `PreviewListingCard` layout to match the uploaded reference image.

## What we will change

- In `src/components/onboarding/PreviewListingCard.tsx`:
  - Move the listing address (title) back to the top of the card.
  - Place the meta info row (neighborhood · beds · baths · below median) directly below the address.
  - Move the price block to the bottom-left of the card, aligned to the left edge.
  - Keep the action row at the bottom-right, with the existing `ListingActions` component passed through the `actions` prop.
  - Ensure the bottom row uses `justify-between` so price sits on the left and actions on the right.
  - Preserve existing card container styles (border, radius, padding, hover/selected states) and the optional close button in the top-right.

## Why

The current card places the price near the top, while the reference image shows the price at the bottom-left as the primary value, with the address and meta info above it. This layout also puts the save action directly across from the price, which is the visual hierarchy the user wants.

## Files to edit

- `src/components/onboarding/PreviewListingCard.tsx` — reorder the internal layout blocks and adjust spacing.

## Out of scope

- No changes to `ListingActions.tsx` or the save/dislike/flag logic.
- No changes to the data model or sample listings.
- No changes to the map popup variant behavior.
