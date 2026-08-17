Make the transit-line badge inside the Step 4 chips (and the location-tab transit list) a content-hugging pill while keeping single-letter labels circular.

## What to change

- In `src/components/onboarding/Step4Preferences.tsx`, change the colored line-badge span from a fixed `h-6 w-6` circle to:
  - `h-6` fixed height
  - `px-1` (4px left/right padding) for multi-letter labels
  - `min-w-6` and `rounded-full` for the pill shape
  - conditional `w-6` when `line.label.length === 1` so one-letter labels (e.g., NY subway "N") stay a perfect circle

- Apply the same logic to the equivalent transit-line badge in `src/routes/_authenticated.search.$searchId.location.tsx` so the location tab stays consistent.

## Visual result

- "Muni N" → a rounded pill that hugs the text with 4px horizontal padding.
- "N" / "A" / "1" → a 24×24 circle.

## No changes to

- Data/schema, copy, or selection logic.
- Other chip usages (move-in date, amenities, etc.).
