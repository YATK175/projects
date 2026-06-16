import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createItemsService } from '#services/items.service';

describe('items service', () => {
  let repository;
  let redis;
  let service;

  beforeEach(() => {
    repository = {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, title: 'Kobzar', author: 'Shevchenko', year: 1840, genre: 'Poetry', image: null },
        {
          id: 2,
          title: 'Zahar Berkut',
          author: 'Franko',
          year: 1883,
          genre: 'Historical',
          image: null,
        },
      ]),
      findById: vi.fn().mockResolvedValue({
        id: 1,
        title: 'Kobzar',
        author: 'Shevchenko',
        year: 1840,
        genre: 'Poetry',
      }),
      create: vi.fn().mockResolvedValue({ id: 3, title: 'New Book' }),
      patch: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Book' }),
      replace: vi.fn().mockResolvedValue({ id: 1, title: 'Replaced Book' }),
      delete: vi.fn().mockResolvedValue(true),
      streamAll: vi.fn(async function* () {
        yield {
          id: 1,
          title: 'Kobzar',
          author: 'Shevchenko',
          year: 1840,
          genre: 'Poetry',
          image: null,
        };
      }),
    };
    redis = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue('OK'),
      keys: vi.fn().mockResolvedValue(['cache:items:v2:page=1:limit=10:author=']),
      del: vi.fn().mockResolvedValue(1),
    };
    service = createItemsService(repository, redis);
  });

  it('returns list with count', async () => {
    const result = await service.getItems();
    expect(result.count).toBe(2);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('returns paginated data and writes it to Redis cache', async () => {
    const result = await service.getPaginatedItems({ page: 1, limit: 1 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(2);
    expect(redis.set).toHaveBeenCalled();
  });

  it('returns cached pagination without database call', async () => {
    redis.get.mockResolvedValueOnce(
      JSON.stringify({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }),
    );
    const result = await service.getPaginatedItems({ page: 1, limit: 10 });
    expect(result.meta.total).toBe(0);
    expect(repository.findAll).not.toHaveBeenCalled();
  });

  it('invalidates Redis cache after create, update and delete', async () => {
    await service.createBook({ title: 'Book', author: 'Author', year: 2020, genre: 'Fiction' });
    await service.updateBook(1, { title: 'Updated' });
    await service.deleteBook(1);
    expect(redis.del).toHaveBeenCalled();
  });

  it('parses JSON import file', () => {
    const records = service.parseImportFile({
      filename: 'books.json',
      mimetype: 'application/json',
      buffer: Buffer.from('[{"title":"A","author":"B","year":2020,"genre":"Fiction"}]'),
    });
    expect(records).toHaveLength(1);
  });
});
