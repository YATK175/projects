import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { users, books } from '#db/schema';
import { buildApp } from '../../src/app.js';

describe('JWT auth flow and protected routes', () => {
  let app;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await app.drizzle.delete(books);
    await app.drizzle.delete(users);
    await app.redis.flushdb();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, refreshes and logs out user', async () => {
    const payload = { email: 'student@example.com', password: 'password123' };

    const registerResponse = await app.inject({ method: 'POST', url: '/auth/register', payload });
    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.json()).not.toHaveProperty('password');

    const loginResponse = await app.inject({ method: 'POST', url: '/auth/login', payload });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.json()).toHaveProperty('accessToken');
    const cookie = loginResponse.headers['set-cookie'];

    const refreshResponse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie },
    });
    expect(refreshResponse.statusCode).toBe(200);
    expect(refreshResponse.json()).toHaveProperty('accessToken');

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { authorization: `Bearer ${loginResponse.json().accessToken}`, cookie },
    });
    expect(logoutResponse.statusCode).toBe(204);
  });

  it('blocks POST /api/v1/items without token and allows it with token', async () => {
    const book = { title: 'Kobzar', author: 'Shevchenko', year: 1840, genre: 'Poetry' };
    const unauthorized = await app.inject({ method: 'POST', url: '/api/v1/items', payload: book });
    expect(unauthorized.statusCode).toBe(401);

    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'a@b.com', password: 'password123' },
    });
    const login = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'a@b.com', password: 'password123' },
    });
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/items',
      headers: { authorization: `Bearer ${login.json().accessToken}` },
      payload: book,
    });
    expect(response.statusCode).toBe(201);
    expect(response.json().book).toMatchObject(book);
  });
});
