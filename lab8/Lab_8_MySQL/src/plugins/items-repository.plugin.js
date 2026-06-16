import fp from 'fastify-plugin';
import { createItemsRepository } from '#repositories/items.repository';

export const itemsRepositoryPlugin = fp(
  async (fastify) => {
    if (!fastify.mysql) {
      throw new Error('MySQL pool is not registered');
    }

    fastify.decorate('itemsRepository', createItemsRepository(fastify.mysql));
  },
  { name: 'items-repository-plugin', dependencies: ['mysql-plugin'] },
);
