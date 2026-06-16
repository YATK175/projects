# Лабораторна робота 8 — Variant 3 Books — Fixed Local Version

Ця версія виправлена для локального запуску без помилок MySQL `Access denied`.

Що змінено:

- прибрано обов'язкове підключення до MySQL під час запуску;
- `npm run db:migrate` тепер готує локальне JSON-сховище;
- `npm run seed` створює книги у `data/items/*.json`;
- виправлено ESLint для `fetch`, `AbortController`, `setTimeout`, `clearTimeout`;
- виправлено WebSocket route, який неправильно імпортував `itemsService`;
- виправлено схему `genreDetails`, щоб endpoint `/api/v1/items/:id/details` не падав із 500.

## Запуск

```bash
npm install
copy .env.example .env
npm run db:migrate
npm run seed
npm run dev
```

## Перевірка

```text
http://localhost:3000/api/v1/items
http://localhost:3000/api/v1/items/1
http://localhost:3000/api/v1/items/1/details
http://localhost:3000/api/v2/items?page=1&limit=10
http://localhost:3000/api/v1/items/export
http://localhost:3000/api/v1/items/export?transform=true
http://localhost:3000/api/v1/items/stream
http://localhost:3000/docs
```

Для зовнішнього сервісу жанрів можна відкрити другий термінал:

```bash
npm run external
```

Якщо `npm run external` не запущений, `/details` все одно працює і повертає fallback-відповідь.
