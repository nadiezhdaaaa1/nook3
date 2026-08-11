# Logged-in hero nav actions

## What changes

Update the shared marketing/hero header (`HeroScrollNav.tsx`) so authenticated users see app-oriented actions instead of the anonymous CTAs.

1. When the user has a Supabase session:
   - Replace the **Sign in** link with a **Log out** button that calls `supabase.auth.signOut()`.
   - Replace the **Get free alerts** primary button with a **Searches** button (`IconHomeSearch` from `@tabler/icons-react`, `OriginButton variant="secondary" size="medium"`) that links to `/home`.
2. Keep the anonymous state unchanged for logged-out visitors.
3. Apply the same swap inside the mobile sheet (currently shows **Sign in** and **Get free alerts**).
4. Ensure the icon + text render inside the button as an inline-flex row with a small gap.

## Files to edit

- `src/components/landing/shared/HeroScrollNav.tsx` — add `useHasSession`, import `IconHomeSearch` and `supabase`, swap desktop and mobile nav CTAs.

## Technical notes

- Use `useHasSession()` from `@/lib/queries/useHasSession` for the authenticated check.
- Use `supabase.auth.signOut()` from `@/integrations/supabase/client`.
- After sign-out, the global `onAuthStateChange` listener will redirect or re-render the route; no explicit `navigate()` is required.
- The new **Searches** button must be a `Link` wrapper around `OriginButton` (or use `onClick={() => navigate({ to: '/home' })}`) so it remains accessible and right-clickable.
