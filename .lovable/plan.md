# Fix: hero card glow never shows on hover

## What's wrong

The glow layers are alive and correctly positioned in code — hovering the card does set `--x`/`--y` to the live cursor position, `--glow-o` to 1, and the pseudo-element opacity to 1. Confirmed in the running preview:

- `--x: 954`, `--y: 293`, `--glow-o: 1`, `::before` opacity `1`
- `::before` background: `radial-gradient(150px at 954px 293px, rgba(255,162,0,0.8), transparent)`
- card `transform`: a live 3D matrix from the press tilt

That last line is the bug. The glow gradients rely on `background-attachment: fixed`, which anchors the gradient to the viewport — but only while no ancestor (or the element itself) is transformed. The press tilt puts a 3D transform on the card, so the transformed element becomes the containing block for its own fixed background. The gradient centre (viewport pixel 954, 293) is then measured from the card's own top-left instead of the viewport's, landing ~950px to the right of a 300px-wide card. The glow is drawn entirely outside the visible ring, so nothing appears.

This also explains why it worked in the earlier no-tilt version and broke once the tilt was added.

## The fix

Stop using viewport-anchored backgrounds on the transformed card and switch the spotlight to card-local coordinates:

1. In `useCardTilt.ts`, in addition to the existing viewport vars, write element-local hotspot vars (`--lx`, `--ly` in px relative to the card's padding box) on pointer move / pointer enter, and from the accelerometer loop on touch. Reset them to the card centre on leave.
2. In the card CSS in `HeroB.tsx`, change the spotlight layers (`::before` ring, `::after` specular, `.hero-b-card-bloom`, and the faint surface light on the card itself) from `background-attachment: fixed` with `var(--x)/var(--y)` to `background-attachment: scroll` positioned at `calc(var(--lx) * 1px) calc(var(--ly) * 1px)`.
3. Keep everything else as-is: same terracotta/amber hues, same radii and opacities, same 200ms fade in/out, same mask-composite border-ring construction, same spring tilt (2.5° max, stiffness 300 / damping 25), same reduced-motion fallback to a static `rgba(214,108,56,0.45)` border.

Hue currently keys off `--xp` (viewport-relative x), which still works and stays untouched.

## Verification

Drive the preview: hover across the card and confirm the `::before` gradient centre now tracks a coordinate inside the card box, then take a screenshot mid-hover to confirm the terracotta ring reads as a soft moving spotlight rather than a flat band, plus a check that the glow fades out on leave.

## Files

- `src/components/landing/heroB/useCardTilt.ts` — emit local hotspot vars
- `src/components/landing/heroB/HeroB.tsx` — glow layers use local coords instead of fixed attachment
