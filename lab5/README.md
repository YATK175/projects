# Лабораторна робота №5 - Variant 3 Books

Проєкт реалізує Book Catalog API на Fastify з файловим сховищем даних. Кожна книга зберігається як окремий JSON-файл у `data/items/{id}.json`.

## Запуск

```bash
npm install
npm run seed
npm run migrate
npm run dev
```

## Основні endpoints

- `GET /books` або `GET /items` - список книг
- `GET /books?author=Shevchenko` - фільтр за автором
- `GET /books/:id` - книга за id
- `POST /books` - створити книгу
- `PATCH /books/:id` - частково оновити книгу
- `PUT /books/:id` - повністю замінити книгу
- `DELETE /books/:id` - видалити книгу
- `GET /items/export` - експорт CSV
- `POST /items/import` - імпорт CSV або JSON
- `POST /items/:id/image` - завантажити зображення
- `GET /health` - публічна перевірка стану
- `GET /health/details` - детальна перевірка, потрібен заголовок `x-api-key`

## Health details

```http
GET http://localhost:3000/health/details
x-api-key: admin-secret
```
