# Lab 10 - Fastify Testing and Docker, Variant 3 Books

This branch continues the JWT version from Lab 9 and adds automated testing with Vitest and containerization with Docker.

## Run locally

```bash
npm install
npm run db:migrate
npm run seed
npm run dev
```

## Tests

Use a separate MySQL database and Redis instance from `.env.test`.

```bash
npm run test
npm run test:coverage
```

## Docker

```bash
docker compose up --build
```

The compose file starts the application, MySQL, Redis and an auxiliary JSON Server.

Список книг:http://localhost:3000/api/v1/items

Одна книга:http://localhost:3000/api/v1/items/1

Пагінація другої версії АРІ:http://localhost:3000/api/v2/items?page=1&limit=10

Swagger:http://localhost:3000/docs

JSON-Swager:http://localhost:3000/docs/json
