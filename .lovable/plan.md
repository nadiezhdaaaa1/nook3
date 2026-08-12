Remove legacy `/preferences` route

Goal
- Delete the `/preferences` URL family since it is no longer a real page — it only redirects legacy URLs to `/home`, `/saved`, `/referrals`, `/account`, or `/search/$searchId/*`.

Current state
- `src/routes/preferences.tsx` — empty parent layout.
- `src/routes/preferences.index.tsx` — redirects `/preferences/` → `/home` (301).
- `src/routes/preferences.$.tsx` — redirects `/preferences/*` to `/saved`, `/referrals`, `/account`, or `/search/$searchId/*`.
- `src/routeTree.gen.ts` is generated from the above and will auto-regenerate.
- Source code search found no direct `<Link to="/preferences">`, `<a href="/preferences">`, or programmatic redirects to `/preferences` outside the route files themselves.

Changes
1. Delete `src/routes/preferences.tsx`.
2. Delete `src/routes/preferences.index.tsx`.
3. Delete `src/routes/preferences.$.tsx`.
4. Do not manually edit `src/routeTree.gen.ts`; let the TanStack Router Vite plugin regenerate it on the next dev/build run.

Risks / edge cases
- Any external/shared links or bookmarks pointing to `/preferences/*` will 404 after deletion. If this matters, the redirects should be kept or moved to a global catch-all. I will check for any references in the marketing/legal pages before deleting.
- `src/lib/preferences/` and `src/components/preferences/` are unrelated UI/data modules (preferences store, save bars, modals) and must not be touched.

Verification
- Search the repo again for `/preferences` route references after deletion.
- Run a typecheck to confirm the generated route tree compiles without the deleted routes.
- Check that no other route still imports or names these files.
