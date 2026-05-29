## Що робимо

Переносимо повну дизайн-систему Nook (токени, шрифти, патерни, анімації, компоненти) з експорту. Контент адаптуємо під продукт типу RentReboot: моніторинг орендних оголошень + миттєві алерти. Додаємо кабінет користувача.

## Фази

### Фаза 1 — Дизайн-система (фундамент)
- `src/styles.css`: токени (charcoal/sage/paper, радіуси, accent-блоки), Fraunces/Inter/JetBrains Mono, патерни (dots/grid/cross) з radial-fade масками, keyframes анімацій.
- Базові примітиви: `Logo` (з курсивною «o» sage), `Eyebrow`, `PatternBg`, `SectionDivider`, кастомні варіанти `Button`.
- Залежності: `framer-motion`, `lucide-react` (якщо немає).

### Фаза 2 — Лендінг (`/`)
Адаптований контент під апарт-алерти, структура з експорту Nook:
- Hero: «Be first to every apartment» в editorial-стилі Nook, email-форма, мокап email-алерту на патерн-фоні.
- How It Works: горизонтальний sticky-скрол на 3 кроки (моніторимо джерела → перевіряємо записи міста → шлемо алерт).
- Sources: список платформ/брокерів.
- Stats / Social proof: цифри + 2 відгуки.
- Pricing breakdown картка.
- Footer.

### Фаза 3 — Auth + Кабінет
- Lovable Cloud (auth + БД).
- Таблиці: `profiles`, `search_filters` (місто, бюджет, спальні, фільтри), `listings` (демо), `alerts` (історія).
- Layout кабінету з Nook-сайдбаром: `/app` (огляд), `/app/filters` (мої пошуки), `/app/listings` (стрічка матчів), `/app/alerts` (історія), `/app/settings`.
- Сторінки `/login`, `/signup`.

### Фаза 4 — SEO + поліровка
- `head()` мета на кожному маршруті, `sitemap.xml`, `robots.txt`.
- QA: перевірка лендінгу + кабінету в preview.

## Технічні деталі

- Стек залишається TanStack Start + Tailwind v4 (співпадає з експортом).
- Усі кольори/радіуси/тіні — лише через токени з `styles.css`, ніяких hardcoded класів `text-white`.
- Routing: `src/routes/index.tsx` (лендінг), `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/_authenticated.tsx` (layout з guard), `src/routes/_authenticated.app.*`.
- Кабінет читає дані через `createServerFn` + `requireSupabaseAuth`. Демо-listing'и сидяться міграцією для перших скрінів.
- Бекенду реального скрейпінгу не пишемо в цьому етапі — лише схема + UI + демо-дані. Інтеграцію з реальними джерелами додамо окремим запитом.

## Питання перед стартом

1. Назва продукту в UI — **Nook**? Тег-лайн запропоную в editorial-стилі.
2. Гео — теж NYC + rent-stabilized, чи інше місто/ніша (скажіть і я адаптую копірайт)?
3. Кабінет робимо з реальним auth (Lovable Cloud), чи поки що UI-only з мок-даними?

Скажіть «погнали» (з відповідями) — і починаю з Фази 1.
