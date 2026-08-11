Landing page header session-aware navigation

## Problem
When a user is already signed in, the landing page header still shows the "Sign in" CTA. Because `/login` redirects authenticated users to `/home`, clicking it skips the Sign In page entirely and goes straight to Home. The header should reflect the user's real session state.

## Solution
Make the landing page header (`HeroScrollNav.tsx`) session-aware. Read auth state from the root router context (or via `supabase.auth.getUser()` / `onAuthStateChange` + `router.invalidate()` if context is not yet wired). Render different CTAs based on session.

## Changes
1. **Header state**
   - Authenticated: replace "Sign in" with "Searches" button (icon + text, same style as `AppHeader` search icon) and "Log out" text button.
   - Unauthenticated: keep existing "Sign in" + "Get free alerts".

2. **Searches button**
   - Link to `/home`.
   - Use the same search/magnifying-glass icon used in the app header.
   - Label: "Searches".

3. **Log out button**
   - Text button in the same visual style as the current "Sign in" link.
   - On click: cancel queries, clear React Query cache, call `supabase.auth.signOut()`, then navigate to `/login` (replace).

4. **Session freshness**
   - Ensure the root route has an `onAuthStateChange` subscriber that calls `router.invalidate()` so the landing header updates immediately after sign-in/sign-out without a manual refresh.

## Out of scope
- The `/login` route's authenticated-user redirect can remain as-is. The only path to `/login` for an authenticated user will be the explicit logout redirect.
- No database or backend changes required.

## Files to change
- `src/components/landing/shared/HeroScrollNav.tsx`
- `src/routes/__root.tsx` (if auth context / state-change listener is not already present)

## Verification
- Open landing page while signed out: header shows "Sign in" + "Get free alerts".
- Open landing page while signed in: header shows "Searches" + "Log out".
- Click "Log out": user is signed out and lands on `/login`.
- Sign in via Google/email: landing header updates without a manual refresh.
