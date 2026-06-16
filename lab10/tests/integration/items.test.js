import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { books, users } from '#db/schema';
import { buildApp } from '../../src/app.js';

describe('items endpoints', () => {
  let app;
  let token;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await app.drizzle.delete(books);
    await app.drizzle.delete(users);
    await app.redis.flushdb();
    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'items@example.com', password: 'password123' },
    });
    const login = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'items@example.com', password: 'password123' },
    });
    token = login.json().accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('performs CRUD flow and returns semantic status codes', async () => {
    const book = { title: 'Zahar Berkut', author: 'Ivan Franko', year: 1883, genre: 'Historical' };
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/items',
      headers: { authorization: `Bearer ${token}` },
      payload: book,
    });
    expect(create.statusCode).toBe(201);
    const id = create.json().book.id;

    const getOne = await app.inject({ method: 'GET', url: `/api/v1/items/${id}` });
    expect(getOne.statusCode).toBe(200);

    const patch = await app.inject({
      method: 'PATCH',
      url: `/api/v1/items/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { genre: 'Novel' },
    });
    expect(patch.statusCode).toBe(200);

    const remove = await app.inject({
      method: 'DELETE',
      url: `/api/v1/items/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(remove.statusCode).toBe(200);

    const missing = await app.inject({ method: 'GET', url: `/api/v1/items/${id}` });
    expect(missing.statusCode).toBe(404);
  });

  it('returns paginated v2 response and stores cache in Redis', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/v1/items',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Book 1', author: 'Author', year: 2001, genre: 'Fiction' },
    });
    await app.inject({
      method: 'POST',
      url: '/api/v1/items',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Book 2', author: 'Author', year: 2002, genre: 'Fiction' },
    });

    const response = await app.inject({ method: 'GET', url: '/api/v2/items?page=1&limit=1' });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
    expect(response.json().meta.total).toBe(2);

    const keys = await app.redis.keys('cache:items:v2:*');
    expect(keys.length).toBeGreaterThan(0);
  });
});
