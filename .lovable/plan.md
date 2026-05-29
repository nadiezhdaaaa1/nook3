# Nook — Onboarding + Cabinet Implementation Plan

## Скоуп
Реалізуємо повний flow по ТЗ: 5-кроковий onboarding → loading → sample alert → pricing → trial → success → cabinet (4 таби). Усе на існуючій Nook design system (charcoal/sage/paper/peach, Fraunces/Inter Tight/JetBrains Mono).

Лендінг чіпаємо мінімально: додаємо city dropdown в header + редірект з email-форми в `/onboarding/step/1`.

## Архітектура

### Маршрути (TanStack file-based)
```
src/routes/
  index.tsx                          (існує, додаємо city dropdown + redirect)
  onboarding.tsx                     layout (shell + ProgressBar + Outlet + persist guard)
  onboarding.step.$n.tsx             splat-style: один файл, switch по n (1..5)
  onboarding.loading.tsx
  onboarding.preview.tsx
  onboarding.pricing.tsx
  onboarding.success.tsx
  preferences.tsx                    layout (sidebar + referral block + Outlet)
  preferences.index.tsx              Notifications (default)
  preferences.budget.tsx
  preferences.apartment.tsx
  preferences.location.tsx
```

### Дані по містах
`src/data/cities/*.ts` — окремий файл на місто (10 шт: nyc, la, sf-bay, chicago, dc, boston, seattle, miami, austin, philadelphia). Експортує `CityConfig` згідно типу з ТЗ §5. `src/data/cities/index.ts` — `CITIES` map + `getCity(id)` helper.

Кожен файл містить: budget range/median, rentProtection (опц.), brokerFeeDefault, neighborhoodGroups, transit.lines з `servesNeighborhoods` для smart filter, buildingDataAvailable.

### State (Zustand + localStorage)
`src/lib/onboarding/store.ts` — `useOnboardingStore` із persist middleware, ключ `nook.onboarding.v1`. Структура — точно `OnboardingState` з ТЗ §6. Селектори: `useCity()`, `useStep(n)`, `setField(key, val)`.

Cabinet читає той самий store + auto-save on blur/change.

### Бібліотеки до встановлення
- `zustand` — state + persist
- `react-leaflet` + `leaflet` — мапа (Step 3 + cabinet Location). Polygons з спрощеного GeoJSON; на старті — bounding-box rectangles per neighborhood, замість справжніх кордонів (інакше треба тягнути сотні KB геоданих). Структура готова під заміну на реальний GeoJSON пізніше.
- `date-fns` (вже може бути) — для DatePicker

Без Lovable Cloud цього разу (юзер сказав «кабінет буде інший» — лише UI + localStorage; auth/БД в окремому ТЗ).

### Reusable компоненти
`src/components/onboarding/` — `ProgressBar`, `CityPills`, `CitySearchDropdown`, `RentSlider`, `MoveInPicker`, `MultiSelectPills`, `SingleSelectPills`, `TriStateToggle`, `RentProtectionPicker`, `NeighborhoodMap`, `NeighborhoodList`, `AmenityPresetChips`, `TransitLineGrid`, `AlertChannelCards`, `LoadingChecklist`, `SampleListingCard`, `PricingCards`, `TrialModal`, `MoveOutModal`.

`src/components/preferences/` — `PreferencesSidebar`, `ReferralBlock`, `FrequencyRadioCards`, `PlanCards` (reuse `PricingCards` з варіантом `currentPlan`).

Усі візуальні токени — з існуючого `src/styles.css` (sage, peach, charcoal, paper, mono accents). Жодних hardcoded `text-white`.

## План по фазах (відповідає Build Sequence з ТЗ §9)

### Фаза A — Фундамент (Prompts 1-2)
1. Створити city configs (10 файлів) + типи + index.
2. Створити Zustand store з persist.
3. Додати city dropdown в `MarketingHeader` + handler «Get alerts» → store.email + nav `/onboarding/step/1`.
4. `onboarding.tsx` layout: top bar з логотипом, ProgressBar (1..5), close (✕) з confirm, Skip slot.
5. Step 1: city (search + pills) → budget slider (city-aware) → move-in (specific/flexible).

### Фаза B — Кроки фільтрів (Prompts 3-7)
6. Step 2: beds multi, baths single, rent-protection (city-aware show/hide), broker-fee checkbox.
7. `NeighborhoodMap` (react-leaflet, OSM tiles, rectangle polygons з config).
8. Step 3: split-screen (desktop) / tabs (mobile). Search, presets chips, grouped list з «Show all», selected chips bar, nearby suggestions.
9. Step 4: AmenityPresetChips + tri-state amenities (3 групи) + transit з smart filter по `servesNeighborhoods ∩ selectedNeighborhoods`, toggle «Show all lines».
10. Step 5: AlertChannelCards (3 шт) + email/phone з валідацією (zod). Frequency не показуємо — default `balanced`.

### Фаза C — Post-flow (Prompts 8-10)
11. Loading screen: 4-крокова анімована checklist (~1с кожен), auto-nav на preview.
12. Sample alert preview: захардкоджені 10 sample listings per city у `src/data/sampleListings.ts`; SampleListingCard з building-data блоком тільки якщо `buildingDataAvailable`.
13. Pricing: monthly/annual toggle, visual comparison strip (heuristic alert count), 3 cards. Continue → free → Success, paid → TrialModal.
14. TrialModal (Premium pre-selected) → «Start Free Trial» (mock, no Stripe) → Success.
15. Success screen + MoveOutModal + ReferralBlock-link → `/preferences`.

### Фаза D — Cabinet (Prompts 11-13)
16. `preferences.tsx` layout: top bar (logo + Back to home), page header (H1 + Unsubscribe), vertical TabSidebar (4 пункти + active indicator), ReferralBlock внизу. Outlet справа.
17. Notifications tab: PlanCards (current badge), AlertChannelCards, FrequencyRadioCards. Auto-save в store.
18. Budget & Criteria tab: RentSlider, MoveInPicker, RentProtectionPicker (city-aware), broker fee checkbox.
19. Apartment Details tab: beds multi, baths single, TriStateToggle для 16 amenities (2 cols desktop).
20. Location tab: simplified NeighborhoodList (без presets/search) + map view + TransitLineGrid з smart-filter toggle.

### Фаза E — Поліровка (Prompt 14)
21. Mobile pass (375/768/1280), accessibility (focus rings, aria-labels, keyboard nav на tri-state), edge cases (no matches, map fail fallback, refresh-resume modal на landing).

## Технічні деталі

**Tri-state toggle цикл:** `neutral → nice → required → neutral`. Зберігається як `Record<string, 'neutral'|'nice'|'required'>` у store (відсутній ключ = neutral, щоб не роздувати persist).

**Smart subway filter:** `lines.filter(l => l.servesNeighborhoods.some(n => selected.includes(n)))`. Якщо результат порожній (юзер не вибрав сусіди, які покриваються лініями) — fallback на «Show all».

**Auto-save в кабінеті:** every setter в store одразу пише в localStorage через persist — окремий save button не треба. Toast «Saved» через `sonner` на blur (опц., можна без).

**Heuristic alert count для preview/pricing:** `Math.round(neighborhoods.length * (budget/median1BR) * 2)`, clamp [2, 50].

**Resume modal:** при mount `index.tsx` перевіряє `store.city && !store.completedAt` → показує banner «Continue where you left off → /onboarding/step/N» (N = last step з заповненими полями).

**Mock Stripe:** «Start Free Trial» просто ставить `selectedPlan='premium'`, `trialActive=true` в store і веде на success. Реальна оплата — в окремому ТЗ.

**Лендінг:** не переробляємо. Тільки `MarketingHeader` отримує `<CitySwitcher />` (dropdown 10 міст, пише в store.city) та `<HeroSection>` email-форма редіректить.

**Що НЕ робимо** (явно з ТЗ §11): listings catalog, favorites, saved searches list, pause, quiet hours, account/email change, billing history, roommate UI, Wren AI, lasso/draw, public SEO pages.

## Що очікую підтвердити перед стартом

Жодних блокерів — спека дуже детальна. Якщо «погнали» — починаю з Фази A (cities config + store + landing wiring + onboarding shell + Step 1) одним великим коммітом, потім по фазах.
