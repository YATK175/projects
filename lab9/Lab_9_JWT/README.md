# Lab 9 JWT — fixed local version

This fixed build keeps the Lab 9 JWT API structure but runs without local MySQL and Redis setup issues.

- Books are stored in `data/items/*.json`.
- Users for JWT authentication are stored in `data/users.json`.
- Redis is replaced with an in-memory fallback for local development.
- `npm run db:migrate` prepares local folders and metadata.

## Run

```bash
npm install
copy .env.example .env
npm run db:migrate
npm run seed
npm run dev
```

Open:

- `http://localhost:3000/docs`
- `http://localhost:3000/api/v1/items`
- `http://localhost:3000/api/v2/items?page=1&limit=10`
