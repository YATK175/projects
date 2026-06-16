import fp from 'fastify-plugin';
import { createItemsRepository } from '#repositories/items.repository';

export const itemsRepositoryPlugin = fp(
  async (fastify) => {
    fastify.decorate('itemsRepository', createItemsRepository());
  },
  { name: 'items-repository-plugin' },
);
