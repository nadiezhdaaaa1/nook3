# Restyle the listing detail drawer to the approved Figma

## User-visible result
- The listing drawer on Home and Saved matches Figma nodes `319:34` and `319:728` in both the desktop side panel and mobile bottom drawer.
- Address, price, property facts, amenities, description, close control, and both source-link footer states use the approved hierarchy, spacing, typography, colors, and dimensions.
- Report, dislike, save, external-link, close, deep-link, loading, and unavailable-listing behavior remains unchanged.
- Listing action controls on cards and map popups keep their current appearance.

## Implementation
1. Restructure the shared drawer content into the Figma section order: address header, price/tag row, icon-led specs, property/neighborhood/age lines, amenity pills, and conditional description.
2. Apply the exact 482px desktop width, 24px horizontal content inset, 56px top inset, 24px section gaps, 32px content bottom spacing, and Figma typography. Use the existing Google Sans Flex, Fraunces, and semantic foreground/primary tokens; add only the missing drawer-specific neutral/badge tokens to the global design system.
3. Restyle the desktop Sheet close control and add the matching accessible close control to the mobile Drawer while retaining overlay, Escape, drag-dismiss, focus restoration, and scroll-lock behavior from the existing primitives.
4. Add a `drawer` presentation variant to `ListingActions` that reuses its current report/dislike dropdowns, report dialog, save state, and loading behavior, but renders the Figma utility controls and ordering. Keep the default/card presentation byte-for-byte equivalent in behavior and appearance.
5. Update only the drawer action instances in Home and Saved to request the new presentation. Keep existing handlers, including closing after dislike/report, and keep list/map card action instances unchanged.
6. Rebuild the sticky footer for the source-link and no-source states with the exact copy, dimensions, spacing, and fixed row structure from the two Figma frames.
7. Restyle the loading skeleton and unavailable state only enough to fit the new panel insets and close layout, without changing their behavior or wording.
8. Verify TypeScript, build diagnostics, and the live drawer at desktop and mobile sizes, including source/no-source footers and interactive action menus.

## Technical details
- Use Lucide `X`, `BedDouble`, `Bath`, `Ruler`, `House`, `MapPin`, `Clock`, `ArrowUpRight`, `Flag`, `ThumbsDown`, and `Heart`; no Figma localhost assets will be embedded.
- Keep `ListingDetailDrawer` as the single shared content implementation used by both Sheet and Drawer.
- Preserve the current `actions` slot contract while passing `variant="drawer"` from the existing Home/Saved action nodes.
