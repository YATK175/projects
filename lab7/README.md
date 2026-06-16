# Лабораторна робота №7 — Node.js Streams, EventEmitter, WebSocket

Варіант 3: **Books**.

Проєкт є продовженням лабораторної №6 і реалізує:

- Gzip backup через `pipeline()` та `zlib.createGzip()`;
- потоковий CSV export `GET /api/v1/items/export?transform=true`;
- Transform stream для додавання поля `age` до книг;
- NDJSON endpoint `GET /api/v1/items/stream`;
- WebSocket endpoint `GET /api/v1/items/ws`;
- EventEmitter як внутрішню шину подій між REST і WebSocket;
- потокову віддачу backup-файлу `GET /api/v1/backups/:timestamp` із захистом через `x-api-key`.

## Запуск

```bash
npm install
npm run seed
npm run dev
```

Окремо для зовнішнього JSON Server з лабораторної №6:

```bash
npm run external
```

## Основні endpoint-и

```http
GET /api/v1/items
GET /api/v1/items/export
GET /api/v1/items/export?transform=true
GET /api/v1/items/stream
GET /api/v1/items/ws
GET /api/v1/backups/{timestamp}.gz
POST /api/v1/items
PATCH /api/v1/items/1
DELETE /api/v1/items/1
```

Для `/api/v1/backups/:timestamp` потрібен заголовок:

```http
x-api-key: secret-admin-key
```
