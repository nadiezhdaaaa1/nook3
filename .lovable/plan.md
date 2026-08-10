# Pagination redesign for authenticated home screen

## Goal
Replace the current full-page-number pagination on `/home` with the compact pagination pattern shown in the screenshot, while keeping the existing `OriginButton` styling.

## Current state
- File: `src/routes/_authenticated.home.tsx` (lines 337-371)
- Currently renders `Previous`, then every page number 1..N, then `Next`, all as `OriginButton` (`tertiary` / `main` variants, `medium` size).

## Target behavior
- Left arrow: `ChevronLeft` icon button, disabled on page 1.
- Right arrow: `ChevronRight` icon button, disabled on last page.
- Visible pages: first page, last page, current page, and immediate neighbors.
- Ellipsis (`...`) between gaps.
- Active page keeps the current `main` variant style; inactive pages keep `tertiary`.
- Ellipsis is non-interactive and styled to match the surrounding text/buttons.

## Implementation plan
1. Add a compact pagination helper in the route file that returns an array of items: numbers and `"ellipsis"` strings based on `page` and `totalPages`.
2. Replace the `Previous` button with an icon-only `OriginButton` (`tertiary`, `medium`) containing `ChevronLeft` from `lucide-react`.
3. Replace the `Next` button with an icon-only `OriginButton` containing `ChevronRight`.
4. Map the helper output: render number buttons as before, and render ellipsis as a plain centered span (e.g. `px-2 py-1 text-sm text-charcoal-700`).
5. Keep all existing handlers, loading/disabled states, and `gap-2` container layout.
6. Verify visually in the preview that page 1, current page, neighbors, last page, and ellipsis render correctly.
