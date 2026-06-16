# Лабораторна робота №6

Тема: REST API, fetch і Swagger. Варіант 3: Books.

## Запуск

```bash
npm install
npm run seed
npm run migrate
npm run external
```

В іншому терміналі:

```bash
npm run dev
```

## Основні адреси

- Swagger UI: `http://localhost:3000/docs`
- Health: `GET http://localhost:3000/api/v1/health`
- Books v1: `GET http://localhost:3000/api/v1/items`
- Books v2 pagination: `GET http://localhost:3000/api/v2/items?page=1&limit=2`
- Details with external service: `GET http://localhost:3000/api/v1/items/1/details`
- GitHub analytics v1: `GET http://localhost:3000/api/v1/github/shared-repos?repo=fastify/fastify`
- GitHub analytics v2: `GET http://localhost:3000/api/v2/github/shared-repos?repo=fastify/fastify`

## API versioning

Усі маршрути попередніх лабораторних робіт перенесено під `/api/v1`.
Нова версія `/api/v2/items` має пагінацію.

## External service

`npm run external` запускає JSON Server на порту 3001 з файлом `db.json`.
Для варіанту 3 використовується ресурс `/genres`.
