# Laboratory work 4 - Fastify Book Catalog

Variant 3: Book Catalog.

## Installation

```bash
npm install
cp .env.example .env
```

Edit `.env` if needed:

```env
HOSTNAME=localhost
PORT=3000
NODE_ENV=development
ADMIN_API_KEY=secret-admin-key
PRODUCTION_CORS_ORIGIN=https://example.com
```

## Run

```bash
npm run dev
```

or

```bash
npm start
```

## Endpoints

### Health

```http
GET http://localhost:3000/health
```

### Health details

```http
GET http://localhost:3000/health/details
x-api-key: secret-admin-key
```

### Books

```http
GET http://localhost:3000/books
GET http://localhost:3000/books?author=Shevchenko
GET http://localhost:3000/books/1
POST http://localhost:3000/books
PATCH http://localhost:3000/books/1
PUT http://localhost:3000/books/1
DELETE http://localhost:3000/books/1
```

Example body for POST and PUT:

```json
{
  "title": "Tini Zabutykh Predkiv",
  "author": "Mykhailo Kotsiubynskyi",
  "year": 1911
}
```

Example body for PATCH:

```json
{
  "year": 1841
}
```

## Git

```bash
git checkout Lab_3_ESM
git checkout -b Lab_4
git add .
git commit -m "Lab 4 Fastify variant 3"
git push -u origin Lab_4
```
