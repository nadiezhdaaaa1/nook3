# Saved page tabs: prevent cropping

## Goal
Stop the saved-page tabs from being cropped at the section edges on mobile; make every tab fully visible within the section boundaries.

## Current state
`src/routes/_authenticated.saved.tsx` wraps the tabs in a `flex flex-nowrap gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0` container with `style={{ scrollbarWidth: "none" }}`. This hides the scrollbar and can clip the rightmost tab against the section edge on narrow screens.

## Change
- Remove horizontal scrolling: drop `overflow-x-auto`, `scrollbarWidth: "none"`, `flex-nowrap`, and the `sm:flex-wrap` breakpoint override.
- Use a natural wrapping container: `flex flex-wrap gap-3 pb-2` on all screen sizes.
- Keep `shrink-0` on each tab button so they do not collapse below their intended width.
- Verify that the `AppPage` tabs slot has no `overflow-hidden` or clipping rule that would cut off wrapped tabs.

## Verification
- Open `/saved` on a mobile viewport in the preview.
- Confirm all three tabs are fully visible and wrap to additional lines if needed, with no text clipped at the section edge.
- Check desktop view still shows tabs in a wrapped row without layout shifts.
