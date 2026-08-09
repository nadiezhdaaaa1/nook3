# Pin-anchored listing card on the onboarding preview map

## Goal
When the user taps a listing marker on the onboarding preview map, the listing card should open directly above that pin, centered horizontally, with the pin sitting just under the bottom edge of the card. The card must stay anchored to the pin while the map is panned or zoomed.

## Current state
- The preview map is rendered by `src/components/onboarding/SampleListingsMap.tsx` using the Google Maps JS API.
- The listing card is rendered in `src/routes/onboarding.preview.tsx` as an absolutely-positioned element inside the map's outer wrapper, but it is not tied to the marker's pixel coordinates.
- The card currently appears at a fixed top-center position in the map container, so it does not follow the selected marker.

## Proposed implementation
1. **Render the card as a Google Maps overlay**
   - Add a custom `google.maps.OverlayView` inside `SampleListingsMap` that renders a React element into the map's overlay layer.
   - The overlay will be positioned at the active listing's `lat/lng`, so it moves with the map automatically.
   - The card content will be supplied by a `cardRenderer` render-prop from `src/routes/onboarding.preview.tsx`, keeping the presentational markup in one place.

2. **Anchor the card above the pin**
   - The overlay container will be placed at the marker coordinates.
   - The inner card element will be shifted with CSS:
     - `transform: translateX(-50%) translateY(calc(-100% - 12px))`
     - This centers the card horizontally on the pin and leaves a small gap above the marker so the pin sits just under the card's bottom border.

3. **Move the card markup from the preview route into the map component**
   - Remove the current `absolute` card from `src/routes/onboarding.preview.tsx`.
   - Pass a render function to `SampleListingsMap` that returns the same card UI (header, price, beds, Wren's take, close button) wrapped in `motion.article` for enter/exit animation.
   - The close button will still call `setActiveId(null)` to dismiss the card.

4. **Handle interaction edge cases**
   - Add a click listener on the map base layer so clicking a non-marker area clears the active selection.
   - Keep marker click behavior: selecting another marker updates the active card.
   - Ensure the overlay is rendered on the mouse-target pane so clicks inside the card work (e.g., the close button and links).

5. **Lifecycle and cleanup**
   - Use `ReactDOM.createRoot` to render the card element into the overlay's DOM node.
   - Unmount the React root and remove the overlay element when the active listing changes or the component unmounts.

## Out of scope
- No changes to the marker design, sample listing data, or the rest of the preview page layout.
- No backend or API changes.

## Files to change
- `src/components/onboarding/SampleListingsMap.tsx`
- `src/routes/onboarding.preview.tsx`