import fp from 'fastify-plugin';
import { createItemsRepository } from '#repositories/items.repository';

export const itemsRepositoryPlugin = fp(
  async (fastify) => {
    if (!fastify.db) {
      throw new Error('Drizzle db is not registered');
    }

    fastify.decorate('itemsRepository', createItemsRepository(fastify.db));
  },
  { name: 'items-repository-plugin', dependencies: ['drizzle-plugin'] },
);
