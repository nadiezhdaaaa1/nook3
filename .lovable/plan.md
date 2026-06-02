# Legal & Compliance UI — план в фазах

ТЗ великий (10 нових сторінок + cookie banner + signup consents + auto-renewal + email compliance + CCPA flow + видалення SMS). Розбиваю на 3 фази за вашою пріоритезацією. Кожна фаза = окремий чат-меседж, щоб не змішувати багато доменів і легко рев'юити.

---

## Phase 0 — підготовка (1 повідомлення)

**База, від якої залежить решта:**

1. Створити layout-компонент `LegalPageLayout` (760px width, sticky TOC desktop / collapsible mobile, типографіка Fraunces/Inter, "Last updated" subline, footer "Questions? email…").
2. Створити 10 route-файлів під цей layout з **placeholder** контентом і HTML-коментарем `{/* Replace before launch — to be drafted by legal counsel */}`:
   `/terms`, `/privacy`, `/cookies`, `/acceptable-use`, `/fair-housing`, `/accessibility`, `/dmca`, `/refunds`, `/subprocessors`, `/do-not-sell` (остання — окремо, з формою у Phase P0).
3. Кожна сторінка має свій `head()` з title/description/og:title/og:description (route-specific, не дублювати головну).
4. Оновити **MarketingFooter**:
   - LEGAL колонка з 8 links (Terms, Privacy, Cookies, Acceptable Use, Fair Housing, Accessibility, "Do Not Sell or Share →", DMCA).
   - Bottom bar: Zentaro Systems Ltd info, registered address, support email, copyright.
   - Видалити "MADE WITH CARE · NEW YORK".

---

## Phase P0 — must-ship для launch (3-4 повідомлення)

Розбиваю на смислові пачки, по одному повідомленню кожна:

**P0.1 — Cookie banner + Manage modal**
- Sticky bottom banner (charcoal/cream, 3 кнопки: Reject all / Manage / Accept all).
- Manage modal з 4 toggle groups (Strictly necessary disabled-ON, інші OFF за замовчуванням).
- localStorage з 12-місячним expiry → re-prompt.
- `useCookieConsent` hook + контекст для решти аплікації (analytics/ads дивляться на нього).
- "Manage cookie preferences" reopens modal з `/cookies` сторінки і футера.

**P0.2 — Signup consents**
- На signup-формі 2 розділені chekboxes (Terms+Privacy required / marketing-email optional), unchecked by default.
- Submit disabled поки required не активований.
- Зберігати consent у `profiles.consents` (jsonb): timestamp, ip, version, method.
- Міграція: додати колонку `consents` до profiles.

**P0.3 — Auto-renewal disclosure + cancel flow**
- Microcopy під CTAs "Start 3-day trial" на Premium і Max картках (font-size === price size, не grayed).
- Same disclosure для annual plans.
- Cancel flow в Account → Subscription (modal, 2 кліки, з варіантом "Pause instead"), без friction.
- Auto-convert у Free в кінці billing period (не одразу).

**P0.4 — SMS sweep + Communications tab**
- Перевірити кожне місце з SMS-згадкою (FAQ, hero preview, pricing tooltips, account, notifications). Більшість вже почищено; фінальний прохід.
- Notifications tab: замість каналів — display "Alert channel: Email · verified".
- Account → Communications: чекбокси з always-on disabled для rental alerts/billing, вибірковими для digest/tips/partner offers.

⚠️ Email infrastructure (CAN-SPAM footer, pre-billing email, cancellation confirmation, trial-start email) — потребує окремої конфігурації email-домену через Lovable. Запропоную окремо після P0.4: треба буде запустити `email_domain--setup_email_infra` + `scaffold_transactional_email`. Це окрема велика підсистема.

---

## Phase P1 — перші 30 днів (2-3 повідомлення)

**P1.1 — CCPA "Do Not Sell or Share" + GPC**
- Заповнити `/do-not-sell` інтерактивною формою (всі поля з ТЗ).
- Таблиця `privacy_requests` у БД (logging, reference number, status).
- GPC header detection (server-side через middleware) + банер "We detected GPC".
- Auto-acknowledgment email (потребує email-інфраструктури з P0).

**P1.2 — Account deletion + Data export**
- Account → Danger zone: 3-крокова deletion (reason → type DELETE → email confirmation з 24h токеном).
- Сервер-функція генерує токен, маркує account як `pending_deletion`, через 30 днів cron-job видаляє.
- Account → Data & Privacy: "Download my data" → server-fn збирає JSON+CSV, кладе в Storage, генерує signed URL (7 днів).

---

## Phase P2 — перші 90 днів

- Заповнити `/subprocessors` таблицею (Supabase, Lovable, Google Maps, аналітика, тощо).
- Доповнити `/accessibility` (WCAG 2.1 AA commitment, alternative formats contact).
- DMCA designated agent — UI готовий у Phase 0, реєстрація у USCO це off-platform.

---

## Технічний огляд

- **Routes:** flat `src/routes/{slug}.tsx` з `createFileRoute("/{slug}")`. `_authenticated`-роути не чіпаємо.
- **Forms & consents:** zod-схеми, `react-hook-form`, серверні `createServerFn` для запису у БД.
- **Cookie consent:** Zustand store з persist + контекст для аналітики.
- **БД-зміни:** `profiles.consents` (jsonb), нова таблиця `privacy_requests`, нова таблиця `account_deletion_requests`.
- **i18n:** контент в EN (US ринок), без перекладів.
- **Дизайн-токени:** тільки наявні (`--color-brand-*`, `--color-charcoal-*`). Жодних нових кольорів.

---

## Що мені потрібно від вас перед стартом

1. **Підтвердіть юридичні константи** (інакше piшy `[XXXXXXXX]`/`[address]` як placeholder, замінимо коли пришлете):
   - Company No. (England & Wales)
   - Registered UK address
   - Підтверджую: support `hello@thenook.rent`, legal `legal@thenook.rent`, privacy `privacy@thenook.rent`?

2. **З якої фази стартуємо?** Пропоную **Phase 0 (footer + 10 routes з placeholder)** — це база для усього іншого і одне акуратне повідомлення. Потім по черзі P0.1 → P0.2 → P0.3 → P0.4.

Скажіть "go" — почну з Phase 0.