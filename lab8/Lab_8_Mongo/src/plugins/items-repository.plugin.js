import fp from 'fastify-plugin';
import { Book } from '#db-models/book.model';
import { createItemsRepository } from '#repositories/items.repository';

export const itemsRepositoryPlugin = fp(
  async (fastify) => {
    if (!fastify.mongoose) {
      throw new Error('MongoDB is not registered');
    }

    fastify.decorate('itemsRepository', createItemsRepository(Book));
  },
  { name: 'items-repository-plugin', dependencies: ['mongo-plugin'] },
);
