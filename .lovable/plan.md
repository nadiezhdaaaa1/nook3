# Fix: onboarding loading screen never finishes

## What happens now

Reproduced in the live app: completing Step 4 → "Find apartments" navigates to `/onboarding/loading`, but the screen stays on step 1 ("Gathering listings from across the web") forever and never routes to `/onboarding/preview`. Opening `/onboarding/loading` directly as a fresh page load works, so the failure only occurs on in-app navigation from Step 4.

## Why

`src/routes/onboarding.loading.tsx` runs the whole simulated progress inside one effect with two conflicting guards:

- a `startedRef` flag that makes the effect body run only once per component instance;
- a `cancelled` closure flag set by that effect's cleanup.

When the loading component mounts, runs the effect, then gets unmounted/re-mounted once during the client-side route transition, the cleanup flips `cancelled` to true and kills the timer chain, while `startedRef` is still true so the re-run bails out immediately. The step progression and the final `navigate({ to: "/onboarding/preview" })` never fire — a dead loading screen.

## The fix

Rework the progression in `src/routes/onboarding.loading.tsx` so it cannot get stranded:

- Remove the `startedRef` "run once" guard and the async for-loop.
- Drive progress from state: one effect keyed on the current step index that sets a single `setTimeout` for that step's dwell time and clears it in cleanup. A remount then simply restarts the current step's timer instead of stopping forever.
- When the last step completes, after the short settle pause, navigate to `/onboarding/preview` with `replace: true` (so Back doesn't land back on the loader), guarded so it only fires once.
- Keep the existing visual design, copy, step timings, "Almost there…" fallback, a11y roles and reduced-motion behaviour unchanged.

## Verification

Run the full onboarding flow in a headless browser (city → Step 2 → Step 3 → Step 4 → "Find apartments") and confirm the loader advances through all three steps and lands on `/onboarding/preview`, plus a direct visit to `/onboarding/loading` still works.
