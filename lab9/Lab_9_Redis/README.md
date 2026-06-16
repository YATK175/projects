# Lab_9_Redis — Laboratory work 9, Variant 3 Books

Redis is integrated as a Fastify plugin. It is used for:

- external reference cache instead of data/cache/reference.json;
- rate limiting store for @fastify/rate-limit;
- cached GET /api/v2/items responses with 24 hour TTL and invalidation on POST/PATCH/PUT/DELETE.

Run:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
```
