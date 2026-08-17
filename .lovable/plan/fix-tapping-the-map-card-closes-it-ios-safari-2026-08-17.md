# Fix: tapping the map card closes it (iOS Safari)

## What's happening

The listing card that floats above a map pin is injected into one of Google Maps' own overlay layers (`overlayMouseTarget`). When you tap the card, the tap also travels up to the map surface underneath, and the map's "tap on empty map" handler runs — that handler clears the selection, which removes the card. The card's own tap handler tries to stop this, but because the card is rendered into a separate React root inside the map's DOM, React's guard doesn't stop the raw browser event from reaching the map.

Confirmed in `src/components/onboarding/SampleListingsMap.tsx`: the overlay attaches the card container to `overlayMouseTarget` (line 312), and the map has a `click` listener that calls `onSelect(null)` (lines 405-415). The card calls `e.stopPropagation()` on its React handler in `src/components/onboarding/PreviewListingCard.tsx` (line 41-44), which is not enough across roots.

## Fix

In `SampleListingsMap.tsx`, where the card overlay container is created (the effect at lines 549-593):

- Call `google.maps.OverlayView.preventMapHitsAndGesturesFrom(inner)` on the card wrapper. This is the official way to tell Maps that taps, clicks, drags and scroll gestures inside that element belong to the element, not the map.
- As a belt-and-braces guard for Safari, also attach native `pointerdown`, `mousedown`, `touchstart`, `touchend` and `click` listeners on `inner` that call `stopPropagation()`, so nothing reaches the map's handlers even if the Maps helper is unavailable.
- Clean these up when the overlay is torn down (existing unmount/`setMap(null)` cleanup).

The map's close-on-empty-tap behaviour, the X button, the "More" toggle, and the title link all keep working — the X button still closes the card, and taps outside the card on the map still clear the selection.

This single change covers both places the map is used (`/onboarding/preview` and `/home`), since both render the popup through the same overlay code.

## Verification

Load `/home` in a mobile viewport, open a pin's card, tap the card body and the "More" toggle — the card must stay open; tap the map background — the card closes.
