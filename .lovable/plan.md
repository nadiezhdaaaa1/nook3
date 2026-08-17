# Hero card motion: tap-to-enable, higher sensitivity

## What changes

1. **Remove the "✦ Enable motion" pill.** iOS users no longer see a badge on the card.
2. **Tapping the card itself asks for motion permission.** On iOS, the first tap/touch on the hero demo card triggers the permission request (a valid user gesture) and starts the sensor tilt. If the user dismisses or the request fails, state returns to idle so a later tap can retry. Android keeps starting automatically on mount.
3. **More sensitive tilt on both platforms.** Small phone movements now produce visible tilt and glow travel:
   - Sensor mapping divisor drops from 8 to ~3 degrees per unit, so ~7° of physical tilt reaches full deflection instead of ~20°.
   - Max tilt raised slightly (2.5° -> 3.5°) so the extra sensitivity is visible rather than clipped.
   - Smoothing lerp raised from 0.08 to 0.14 so it tracks movement more responsively.

The desktop pointer path, the baseline-on-enter-viewport logic, the clamp, and the glow layers stay as they are.

## Technical notes

- `src/components/landing/heroB/useCardTilt.ts`: expose an `onTouchStart` (and `onPointerDown` for touch pointerType) handler in `handlers` on touch devices that calls `requestMotion()` once; drop `needsMotionPermission` from the consumed API (kept internally or removed). Tune `MAX_TILT`, the `/8` divisors, and the `0.08` lerp factor.
- `src/components/landing/heroB/HeroB.tsx`: delete the `tilt.needsMotionPermission` button block; card already spreads `{...tilt.handlers}`, so the new touch handler attaches automatically. Debug overlay (`?debug=motion`) stays.
- Optional cleanup: the now-unused `.hero-b-card-motion` CSS rule in `src/styles.css` can be removed.
