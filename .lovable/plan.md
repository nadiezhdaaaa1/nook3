# Fullscreen map on the matches screen

Add a fullscreen toggle to the map on `/home`. When on, the map stretches across the whole screen and the listings list is hidden. The search selector and Filters button float in the top-left of the map only while fullscreen, so they stay reachable without the list column.

## Behavior

- **Normal (split) view:** unchanged. Search selector + Filters stay in the list column header. The map shows only the new fullscreen button (top-right) plus existing +/- zoom controls (bottom-right).
- **Fullscreen on:** list column hidden, map fills the content area (full width, full viewport height under the app header). Top-left of the map gets a floating control group with the search selector and the Filters button. Top-right button switches to an "exit fullscreen" icon.
- **Fullscreen off:** everything returns to the split layout; the floating top-left group disappears.
- `Esc` exits fullscreen. Listing selection/hover, pins, clustering, popup card and filters all keep working in both modes.
- Mobile: the toggle works too — fullscreen makes the map fill the screen and hides the list; the floating controls stack in the top-left.

## Styling

- Fullscreen button matches the existing zoom controls exactly: same container (`#fffdf7` at 90%, 1px black/20 border, 12px radius, blur, soft shadow), 32px square button, 8px inner radius, `#241c12` icon, hover `black/5`, focus ring.
- Floating top-left group uses the same container treatment (paper background, black/20 border, 12px radius, blur, shadow) wrapping the existing search selector and Filters button so they read as map controls rather than page chrome.
- Icons: `Maximize2` / `Minimize2` (lucide, same set already used).

## Technical notes

- `src/routes/_authenticated.home.tsx`: add `mapFullscreen` state. When true, the map `<aside>` becomes full-width/full-height (drop `md:w-[45%]`, `md:sticky`, padding) and the listings `<section>` is not rendered. Pass an `onToggleFullscreen`/`isFullscreen` pair plus a `topLeftControls` node (rendered only in fullscreen) into `SampleListingsMap`. `Esc` handled with a keydown effect.
- `src/components/onboarding/SampleListingsMap.tsx`: new optional props `isFullscreen`, `onToggleFullscreen`, `topLeftControls`. Render the top-right toggle button (only when `onToggleFullscreen` is provided) and an absolutely positioned top-left slot for `topLeftControls`. No changes to map init, clustering, or overlay logic; onboarding preview usage stays untouched since new props are optional.
- Trigger `google.maps.event.trigger(map, "resize")` after a fullscreen change so tiles/pins re-layout correctly.
