import fp from 'fastify-plugin';
import { bookDetailsSchema, bookSchema } from '#schemas/book.schema';

export const schemasPlugin = fp(async (fastify) => {
  fastify.addSchema(bookSchema);
  fastify.addSchema(bookDetailsSchema);
});
