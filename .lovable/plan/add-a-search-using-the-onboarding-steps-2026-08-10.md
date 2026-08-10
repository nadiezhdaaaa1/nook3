# Add a search using the onboarding steps

Creating a new search will walk the user through the same four screens as onboarding, ending with a "Save the search" button instead of "Find apartments".

## Flow

```text
/saved?tab=searches  → "New search"
      ↓
/search/new/1  Where (city, budget, move-in)
/search/new/2  Place (beds, baths, rent protection, fees)
/search/new/3  Location (neighborhoods)
/search/new/4  Preferences (amenities, transit, commute)
      ↓  [Save the search]
/saved?tab=searches  (new search appears, toast "Search created")
```

- Identical look and behaviour to onboarding steps 1–4: same shell, header, progress bar, Back/Next, validation, animations.
- Step 4's primary CTA reads "Save the search" (no preview/loading/pricing screens in this flow).
- Back from step 1 exits the flow and returns to Saved → My searches.
- Plan limits still apply: if the user is already at their search limit, the "New search" tile keeps showing the upgrade modal, so this flow is only reachable when a slot is free.

## What the user sees change

- "New search" on Saved no longer routes into the onboarding funnel; it opens the dedicated add-search wizard.
- After saving, the new search is created, becomes selectable in the header search selector, and the user lands back on My searches.

## Technical notes

- New routes: `src/routes/_authenticated.search.new.tsx` (layout reusing the onboarding shell chrome) and `src/routes/_authenticated.search.new.$step.tsx` dispatching to the existing `Step1Where` … `Step4Preferences` components. No duplication of step UI code.
- Add a small `SearchFlowContext` (`src/components/onboarding/searchFlow.tsx`) exposing `basePath`, `onExit`, `finalLabel`, and `onFinish`. The four step components currently hardcode `navigate({ to: "/onboarding/step/$step" })`; they read the context instead, defaulting to the existing onboarding behaviour so onboarding is unchanged.
- Draft state: the flow reuses the existing onboarding zustand store as the draft. On entering `/search/new`, snapshot the current store state, `reset()` it to defaults; on save or exit, restore the snapshot so the currently active search's edit state is untouched.
- Save action: `useAppStore.getState().createSearch(...)` built from the draft, then `useCreateSearchMutation()` to persist to the backend, then `hydrateActiveSearchIntoOnboarding()` is skipped (snapshot restore handles it) and navigate to `/saved?tab=searches`.
- Route metadata: `noindex, nofollow` plus its own title/description, consistent with the other authenticated routes.
