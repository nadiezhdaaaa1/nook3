# Fix: listing card no longer appears on the map

## What's happening

Clicking a price pin on the home map should open the floating listing card. It stops rendering because of the tooltip that was recently added to the card's title.

The map card is not rendered inside the app's React tree — the map component mounts it into its own separate React root attached to a Google Maps overlay (`createRoot(inner)` in `SampleListingsMap.tsx`). React context does not cross root boundaries, so the `TooltipProvider` mounted in `__root.tsx` is not visible to that card. The Radix tooltip in `PreviewListingCard` requires a provider above it, so the card's render fails and the overlay ends up empty.

## Fix

Wrap the card content in its own `TooltipProvider` so it works in any root:

- In `src/components/onboarding/PreviewListingCard.tsx`, wrap the returned markup in `TooltipProvider` (harmless when nested inside the app-level provider).

Alternative (equivalent): wrap `root.render(card)` in `SampleListingsMap.tsx` with `TooltipProvider`. The card-level fix is preferred because the same card is reused in other map overlays.

## Verification

- Open the authenticated home screen, click a price pin, confirm the card appears above the pin, the title tooltip works, and closing/reselecting behaves as before.
- Confirm the onboarding preview map card is unchanged.
- Run a production build.
