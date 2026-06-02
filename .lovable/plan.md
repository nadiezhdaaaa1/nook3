# Nook — Plan: повна готовність frontend + backend

Зараз застосунок — frontend-only demo: всі дані в localStorage (Zustand persist), бекенду немає, валідація лише на email/phone у двох місцях, нема login, акаунт лише read-only, sonner підключений, але `toast()` не викликається жодного разу. Нижче — що саме треба, поділено на фази. Усе нове знає, що шар сторів (`useOnboardingStore` + `useAppStore`) лишається як "локальний кеш" поверх бази.

## Фаза 1 — Lovable Cloud + Auth (фундамент)

1. Увімкнути Lovable Cloud (Supabase під капотом) — створяться `src/integrations/supabase/{client,client.server,auth-middleware,auth-attacher}`, `.env` отримає `VITE_SUPABASE_*` + серверні ключі.
2. Авторизація:
   - Маршрути `/login`, `/signup`, `/auth/callback` з email+password (швидкий старт). Magic-link опціонально другою ітерацією.
   - Pathless layout route `src/routes/_authenticated.tsx` з `beforeLoad`, що редіректить на `/login` для `/preferences/*`.
   - На `__root` слухач `supabase.auth.onAuthStateChange` → синхронізує `useAppStore.user`.
   - Onboarding лишається публічним; завершення (`onboarding.success`) пропонує "Create account to save", якщо сесії нема.
3. Verification:
   - Email verified через Supabase auth (вже з коробки).
   - Phone — окремо: серверна функція `sendPhoneOtp` / `verifyPhoneOtp` (поки що mock-успіх, але з реальним state у БД).

## Фаза 2 — Схема БД + RLS + міграція

Створити міграції для:

- `profiles` (id PK = auth.uid, email, email_verified, phone, phone_verified, timezone, plan, billing_cycle, trial_active, trial_started_at, referral_code unique, is_affiliate, completed_at, move_out jsonb).
- `searches` (id, user_id, name, city_id, status, archived_at, всі поля з `Search.filters`, created_at, updated_at). Унікальний індекс по `(user_id, lower(name))`.
- `saved_alerts` (id, user_id, search_id FK, listing snapshot jsonb, status, snoozed_until, created_at).
- `user_roles` + enum `app_role` + `has_role()` SECURITY DEFINER (за патерном з інструкцій).
- `referrals` (id, referrer_user_id, referred_user_id, created_at, reward_status).

Для кожної таблиці: `GRANT` для `authenticated` + `service_role`, `ENABLE RLS`, політики "owner only" через `auth.uid() = user_id`. На `searches` — тригер, що валідує ліміт плану (free=1, premium=3, max=∞) перед insert.

Auto-profile тригер `on_auth_user_created` → створює `profiles` рядок + дефолтний `searches` (з даних onboarding, переданих через `raw_user_meta_data`).

## Фаза 3 — Server functions + перенос стора на БД

`src/lib/searches.functions.ts`, `src/lib/alerts.functions.ts`, `src/lib/profile.functions.ts` з `requireSupabaseAuth`:

- `listSearches`, `createSearch`, `updateSearch`, `renameSearch`, `pauseSearch`, `resumeSearch`, `archiveSearch`, `restoreSearch`, `deleteSearch`, `duplicateSearch`.
- `listAlerts({ searchId | "all", status })`, `updateAlertStatus`, `snoozeAlert`.
- `updateProfile`, `setMoveOut`, `sendPhoneOtp`, `verifyPhoneOtp`.

Усі з Zod-валідацією в `.inputValidator()` (бюджет як кортеж, статус enum, довжини, регекси).

Інтеграція з React Query: один `QueryClient` у роутер-контексті, `queryOptions` у `src/lib/queries/*`. `useAppStore` стає тонкою обгорткою — `activeSearchId` у `localStorage`, решта через `useSuspenseQuery`. Мутації — оптимістичні з rollback + `queryClient.invalidateQueries`.

Onboarding: завершення кроку 5 виконує `signUp` + `createSearch(snapshot)` одним flow; bridge-хелпери (`syncOnboardingToActiveSearch`, `syncOnboardingToUser`) переписуються в "push to server".

## Фаза 4 — Валідація скрізь (Zod)

Винести спільні схеми у `src/lib/validation/`:

- `email`, `phone (E.164 +1 fallback)`, `searchName (2–50, без емодзі/керівних)`.
- `budgetRange` (`[min, max]`, 500 ≤ min ≤ max ≤ 20000).
- `moveIn` (mode="specific" → date обов'язкова, не в минулому, ≤ +18 міс).
- `commute.maxMinutes` (5–120 або null).
- `MoveOutInfo` (адреса, дата, повний об'єкт).

Підключити:

- `NewSearchModal` — лічильник символів, помилка під полем, disabled submit поки невалідно.
- `SearchSwitcher` inline rename — показувати помилку під інпутом замість тихого no-op; toast при успіху/конфлікті імен.
- `Step1Where` — блокувати Continue, якщо `moveIn.mode==="specific"` без date.
- `Step4Preferences` — числовий інпут commute з мін/макс і повідомленням.
- `MoveOutModal` — Zod-схема, aria-invalid, повідомлення.
- `preferences.index` — підсилити: email/phone тепер required при `alertChannel === "email"/"phone"`.
- `preferences.account` — повноцінні edit-форми (email change → re-verify, phone change → OTP).
- Усі сервер-функції повторюють ту саму схему — клієнт показує, сервер енфорсить.

## Фаза 5 — Помилки, тости, стан UI

- Sonner `toast.success/error` у кожній мутації: створення/перейменування/пауза/архів/відновлення/видалення/snooze + "Undo" на archive/delete (5 с window).
- `errorComponent` + `pendingComponent` на:
  - `routes/_authenticated.tsx`,
  - `routes/preferences.tsx` (батьківський layout),
  - `routes/onboarding.tsx`.
- Loading skeletons для `preferences.alerts` (список), `preferences.index` (form), `SearchSwitcher` (поки React Query завантажує).
- Empty states з CTA: "немає алертів — спробуйте розширити фільтри / створити новий пошук".
- `PlanLimitsBanner` — прибрати hydration flicker (читати `localStorage` у `useEffect` з init `null`, не показувати до резолву).
- Network/offline banner: глобальний слухач `online/offline` + toast.
- Standalone `not-found` для глибоких маршрутів (наприклад, неіснуючий `searchId` у URL — коли додамо `/preferences/searches/$id`).

## Фаза 6 — Multi-search polish

- Реальні per-search `saved_alerts` з БД (генератор сидів-даних запускається в Edge `cron` або одноразово при створенні пошуку — для демо).
- Per-search статистика (`totalAlertsReceived`, `alertsLast7Days`, `alertsToday`) — обчислюється SQL view або `select count() filter (where ...)`.
- Авто-sync редактора → snapshot:
  - debounced effect у `preferences.tsx` (1.5 с після останньої зміни) викликає `syncOnboardingToActiveSearch()` + серверну мутацію.
  - також на `router.subscribe("onBeforeNavigate")` — flush перед переходом.
- Snooze алерту (Until tomorrow / +3 days / +1 week / custom).
- Rename — унікальність імен у межах юзера, помилка з конфлікту з БД конвертується у людський меседж.
- Сторінка `/preferences/archive` — повне керування архівом.

## Фаза 7 — Білінг + рефералки + Wren AI

- Stripe через `payments--enable_stripe` + серверні функції `createCheckoutSession`, `cancelSubscription`, webhook `/api/public/stripe/webhook` (з підписом).
- `UpgradeModal` запускає реальний checkout, success-redirect оновлює `profiles.plan`.
- `preferences.referrals`: реальні лічильники з таблиці `referrals`, копія посилання, applied-at-signup флоу через `?ref=` query param.
- Wren AI compare: серверна функція `compareListings` через Lovable AI Gateway (модель Gemini 2.5 Flash для дешевого аналізу), результат у `saved_alerts.ai_summary` jsonb.

## Фаза 8 — Дрібниці якості

- `__root.tsx` `title` → "Nook — Apartment alerts that actually work" (не "Lovable App"); meta description, OG image.
- Унікальні `head()` на кожному route (SEO).
- `robots.txt` + `sitemap` route.
- Перевірити `errorComponent` шаблон на retry → `router.invalidate()` + `reset()`.
- Audit-фікс: будь-який `dangerouslySetInnerHTML` (зараз не знайдено — добре), DOMPurify якщо з'явиться user-generated rich text.

---

## Технічні нотатки

- **Стек**: TanStack Start v1, React 19, Vite 7, Tailwind v4. Server runtime — Cloudflare Worker (нативні Node-only пакети — заборонені).
- **Auth flow**: `attachSupabaseAuth` уже є в шаблоні; підтвердити в `src/start.ts` після enable.
- **React Query**: `defaultPreloadStaleTime: 0`, окремий `QueryClient` на запит у `getRouter`.
- **Міграції**: окрема міграція на таблицю + GRANT + RLS + політики в тому самому файлі. Поле `Search.id` лишаємо string (UUID), щоб поточний фронт-код не ламався.
- **Backward compat**: одноразова `ensureMigratedFromLegacy()` уже є; додамо нову `pushLocalToCloudOnFirstLogin()` — якщо в `localStorage` є завершений onboarding, при першому логіні апсертимо `profiles` + `searches`.

## Порядок виконання

Я б ішов фазами по черзі (1→2→3 блокують решту), у 3 фазі робив би менші PR'и (по одній сутності). Фази 4/5 можна частково паралелити після того, як з'явилися serverFn. Скажіть, з якої фази стартуємо, чи робимо все підряд.
