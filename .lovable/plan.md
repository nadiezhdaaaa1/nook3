# Переробка лендінгу Nook

Виконую один великий рефакторинг `src/routes/index.tsx` та супутніх компонентів. Brand colors і ритм зберігаємо, копі та структуру перебудовую під ТЗ. Працюю в frontend only (без backend змін).

## City state (city-agnostic)

Створюю `src/lib/city/CityContext.tsx`:
- `useCity()` повертає `{ city, setCity, cities }`.
- `cities`: NYC (active), LA / SF / Chicago (`comingSoon: true`), + "Other city — waitlist".
- Зберігаю вибір у `localStorage`. Default = NYC (без geo-IP на цьому етапі — лишаю TODO comment, щоб не вигадувати IP-сервіс).
- Кожне місто несе: `label`, `defaultNeighborhood`, `sampleAddress`, `sampleRent`, `neighborhoodPills[]` — щоб Hero card, Step 1 mock, FAQ підставляли значення без хардкоду.

Provider підключаю в `src/routes/__root.tsx` навколо `<Outlet />`.

## Нова структура `src/routes/index.tsx`

```
<MarketingLayout>
  <HeroCityAware />          // Block 1
  <HowItWorksThreeSteps />   // Block 2 (новий)
  <WhatYouGetGrid />         // Block 3.NEW (заміна "104+ sources")
  <TiredOfSection />         // Block 4 (заміна "By the numbers")
  <ReviewsMasonry />         // Block 5
  <PricingThreeTiers />      // Block 6 (заміна PricingLanding)
  <FaqFifteen />             // Block 7
  <BlogTeaser />             // Block 8 (новий)
  <CtaStrip />               // лишається
</MarketingLayout>
```

Видаляю з рендеру: `UrgencyStrip`, `WhyStillLooking`, `TimeLossCalculator`, `WrenAIBlock`, `SourcesSection`, `StatsSection`, старий `HowItWorksLanding`, старий `PricingLanding`, старий `FaqSection`. Файли поки лишаю на диску (на випадок майбутнього reuse) — не імпортую.

## Компоненти, які створюю / переписую

1. `src/components/landing/CitySelector.tsx` — pill із dropdown, "Coming soon" badge, waitlist option (поки `alert()` / Sonner toast, без бекенду).
2. `src/components/landing/HeroCityAware.tsx` — нова копі ("Find your next apartment before it's gone." + italic "Without losing your mind."), CitySelector над h1, dynamic preview card з даних `useCity()`, floating "LIVE MATCH" badge. Видаляю всі згадки 53k+, StreetEasy, "No card required".
3. `src/components/landing/HowItWorksThreeSteps.tsx` — 3 кроки з mini-mock на кожному (форма / activity feed / iPhone notification), bottom CTA.
4. `src/components/landing/WhatYouGetGrid.tsx` — 6-cell grid (lucide icons: ShieldCheck, Zap, Filter, Sparkles, Layers, Pause).
5. `src/components/landing/TiredOfSection.tsx` — темний фон, 4 pain→solution картки, bottom CTA.
6. `src/components/landing/ReviewsMasonry.tsx` — 6 placeholder reviews у CSS columns masonry (без city у підписах).
7. `src/components/landing/PricingThreeTiers.tsx` — Monthly/Annual toggle, 3 картки (Free / Premium MOST POPULAR / Max) з повними фіче-листами з ТЗ.
8. `src/components/landing/FaqFifteen.tsx` — Radix Accordion (single), 15 QA, перше default open.
9. `src/components/landing/BlogTeaser.tsx` — 3 placeholder картки, "See all articles →" (неактивний `<span>` з tooltip "Coming soon").

## Footer

Переписую `src/components/marketing/MarketingFooter.tsx`:
- Блок company info (Zentaro Systems Ltd, Company No. `TBD`, Address `TBD`, hello@thenook.rent).
- 4 колонки: Product / Company / Legal / Account за ТЗ.
- Прибираю "About" та "MADE WITH CARE · NEW YORK".
- Copyright: "© 2026 Zentaro Systems Ltd. All rights reserved."
- Headline "Where home finds you." лишаю.

## Header

`MarketingHeader.tsx` — оновлюю nav-лінки під нові anchors: How it works, What you get, Pricing, FAQ, Blog.

## Стилі

У `src/styles.css` додаю brand tokens із ТЗ (узгоджую з існуючими `cream` / `sage` / `peach`):
- `--color-brand-cream: #F5EDE0`
- `--color-brand-soft-white: #FAF6EE`
- `--color-brand-charcoal: #2B2521`
- `--color-brand-terracotta: #C2664E`
- `--color-brand-sage: #9DAA8E`
- `--color-brand-clay: #D9C7B2`

Використовую їх через `bg-[var(--color-brand-...)]` у нових компонентах, щоб не ламати існуючу палітру.

## Що НЕ роблю в цьому проході

- `/blog` маршрут і CMS — лишаю на пізніше (link "See all articles →" disabled).
- Geo-IP detect — TODO коментар, default NYC.
- Реальні Privacy/Terms сторінки — у footer ставлю лінки на placeholder routes якщо існують, інакше `#`.
- Backend для waitlist — toast "We'll let you know" без запису.

## Технічні нотатки

- Усі компоненти — pure presentational, без `useEffect` запитів.
- City state через React Context + `localStorage` (SSR-safe: читаю в `useEffect`).
- Animation — лишаю наявні `animate-fade-in-up`, `stagger`, `hover-lift`.

Підтверди — і я починаю.