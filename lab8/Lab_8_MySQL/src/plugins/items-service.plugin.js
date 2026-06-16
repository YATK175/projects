import fp from 'fastify-plugin';
import { createItemsService } from '#services/items.service';

export const itemsServicePlugin = fp(
  async (fastify) => {
    if (!fastify.itemsRepository) {
      throw new Error('itemsRepository is not registered');
    }

    fastify.decorate('itemsService', createItemsService(fastify.itemsRepository));
  },
  {
    name: 'items-service-plugin',
    dependencies: ['items-repository-plugin'],
  },
);
