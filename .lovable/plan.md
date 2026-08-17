# Fix SearchSelector dropdown width on mobile

## Problem
The search selector dropdown in `src/components/app/SearchSelector.tsx` is set to a fixed width of `w-[380px]`. On mobile (viewport ~393px), this causes the dropdown to overflow the content area and bump against the screen edge.

## Goal
Make the dropdown width responsive so it never exceeds the available content area on mobile, while preserving the current desktop experience.

## Changes
1. In `src/components/app/SearchSelector.tsx`, update the dropdown container from `w-[380px]` to a responsive width that matches the header button on mobile and expands to `380px` on larger screens:
   - Use `w-full max-w-[calc(100vw-32px)]` or similar constraint so it hugs the content area on mobile.
   - Keep `sm:w-[380px]` for desktop.
2. Ensure the dropdown remains left-aligned under the selector button and does not overflow the viewport.
3. Preserve existing internal spacing, list scrolling, and archived section behavior.

## Verification
1. Check the preview on mobile viewport width to confirm the dropdown fits within the content area.
2. Confirm desktop viewport still shows the dropdown at `380px`.
3. Verify the dropdown list items and archived section remain usable and do not clip text.
