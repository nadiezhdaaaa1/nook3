# Fix the hero city card stack

Make the card deck behave like a real looped stack: drag left or right and the deck advances to the next city, wrapping around forever, in the order New York City → Los Angeles → San Francisco → Chicago.

## What's wrong now

- The dragged card and the incoming card share one motion `x` value, and `x` is reset to 0 the instant the drag ends. The card that should fly off the deck snaps back to center instead, so a swipe looks broken.
- The drag direction is inverted: dragging right moves backwards through the list.
- Only one card is ever rendered on top; the two shapes behind it are empty paper, so the stack never looks like it holds the next cities.
- No wrap feedback: a partial drag under the threshold has no spring-back, and repeated quick swipes can drop animations.

## What will change

1. Drag right or left both advance the stack forward one city (right = forward, left = also forward — a swipe in either direction sends the top card away and reveals the next one), looping endlessly after Chicago back to New York City.
2. The card being dismissed animates out in the direction it was thrown, with rotation, while the next city's card rises into the top slot.
3. A drag that doesn't pass the swipe threshold springs back to center with no city change.
4. The two cards behind the top card show the next two upcoming cities (photo + title), so the loop reads as a stack.
5. Arrow-key and reduced-motion behavior stay: Right/Left arrow advance the same way; with reduced motion the card cross-fades instead of flying.

Card order stays exactly as defined today: New York City, Los Angeles, San Francisco, Chicago.

## Technical notes

- `src/components/landing/heroA/HeroA.tsx`, `CardDeck`: give each card its own `x`/`rotate` motion values instead of a shared one hoisted in the parent, and stop calling `x.set(0)` on drag end so the exit variant can run. Exit offset comes from the recorded throw direction, not the parent's `dir`.
- Advance logic in `HeroA.cycle` becomes a single forward step (`index + 1`) with modulo wrap; `goTo` keeps handling the pill dropdown jumps.
- Render up to three stacked cards derived from `HERO_CITIES` with modulo offsets so the back cards preview the next cities; keep existing `.hero-a-card-back-*` sizing/offsets as the geometry for those slots.
- Preserve existing styles, stat roll animation, background cross-dissolve, and the `Coming soon` pill wiring. No changes outside the hero.
