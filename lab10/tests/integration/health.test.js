import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app.js';

describe('health endpoints', () => {
  let app;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns public status', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('GET /api/v1/health/details rejects request without API key', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/health/details' });
    expect(response.statusCode).toBe(401);
  });

  it('GET /api/v1/health/details returns process information with valid API key', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health/details',
      headers: { 'x-api-key': process.env.ADMIN_API_KEY },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('pid');
  });
});
