# Move listings to the backend — 500 per city

Today all listings live in the frontend file `src/data/sampleListings.ts`: 10–12 handwritten rows per city, expanded in the browser to 50 per city on every page load. Nothing is stored in the database, which is why listings can't be shared, paginated, or referenced reliably by saved/disliked rows.

This change creates a real `listings` table in the backend, fills it with 500 listings per city (5,000 rows across the 10 cities), and makes the app read listings from there.

## What the user will see

- Home feed, map, and the onboarding preview show listings coming from the backend.
- Each city has 500 listings, so filters (rent range, beds, baths, neighborhoods, amenities) return far richer results.
- Listing IDs are now stable across sessions, so saved and disliked listings always resolve to the same listing.
- No visual redesign — the same cards, map pins, and filter behavior.

## Data model

New table `listings` with: city id, address, unit, rent, beds, baths, neighborhood, below-median percent, tag ("Likely RS", "Verified RS", "Rent controlled"), building note, image URL, source URL, latitude/longitude, amenities (list), and status (active/inactive) plus timestamps.

Access rules: listings are public catalog data — anyone (signed in or not) may read active listings; only backend/admin code may create, edit, or remove them.

Indexes on city + rent, city + beds, and city + neighborhood so filtered queries stay fast at 5,000+ rows.

## Seeding 500 per city

The 10–12 curated listings per city stay as the seed anchors (real neighborhoods, plausible coordinates and rents). The migration generates the remaining rows per city deterministically in SQL — varying unit/street number, rent within the city's observed range, bed/bath mix, amenity subset, tag, and coordinates jittered around the anchor neighborhood — so every city ends at exactly 500 rows. Seeding runs inside the migration, not on page load.

## Frontend wiring

- New server function `listListings` (city + filter/pagination arguments) reading from the table; returns plain listing DTOs shaped like today's `SampleListing`.
- `_authenticated.home.tsx`, `onboarding.preview.tsx`, and the landing hero demos switch to that query (TanStack Query, loader-prefetched on the authenticated home).
- Home filtering, map fitting, dislike/save flows keep their current logic, now keyed on the database listing id.
- `src/data/sampleListings.ts` shrinks to the seed anchors + types, used only as a fallback for the public landing demo if the fetch fails; the client-side 50-row expansion is deleted.

## Technical notes

- One migration: `create table` → `grant` (anon/authenticated read, service_role all) → enable RLS → read policy → indexes → generated `insert ... select` seeding from a `values` anchor list with `generate_series`.
- Listing ids remain text-friendly for existing local references: table gets a uuid primary key plus a unique `slug` (e.g. `nyc-g137`) used in the UI and in saved/disliked matching.
- Pagination: server function returns pages of 50 with a total count; home keeps infinite/gradual loading rather than rendering 500 cards at once.
- Amenities stay a jsonb array so `getListingAmenities` keeps working unchanged.
