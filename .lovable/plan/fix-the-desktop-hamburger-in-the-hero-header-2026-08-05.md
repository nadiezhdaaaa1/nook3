Fix the desktop hamburger in the hero header

Problem: The hamburger menu icon is still appearing on the desktop version of the marketing header (HeroScrollNav), even though the code already includes a responsive `md:hidden` class.

Plan:
1. Investigate the HeroScrollNav CSS conflict: the `.hero-nav-burger` inline style sets `display: inline-flex`, which can override the Tailwind `md:hidden` media-query utility.
2. Refactor the burger button so its display is controlled by Tailwind classes rather than a conflicting inline rule, ensuring the button is hidden at `md` (768px) and above (tablet and desktop).
3. Keep the burger visible and correctly styled below `md` for mobile.
4. Verify the preview at a 1180px desktop viewport shows the full nav links without the hamburger.

Technical details:
- File: `src/components/landing/shared/HeroScrollNav.tsx`
- Remove the `display: inline-flex` declaration from the `.hero-nav-burger` inline CSS block.
- Apply `inline-flex` via the Tailwind class on the button where it is actually shown (below the `md` breakpoint), so the responsive `md:hidden` utility works without being overridden.
- Apply the same logic to the mobile sheet if needed so the desktop view never renders it.
