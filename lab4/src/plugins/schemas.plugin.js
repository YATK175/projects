import fp from 'fastify-plugin';
import { bookSchema } from '#schemas/book.schema';

export const schemasPlugin = fp(async (fastify) => {
  fastify.addSchema(bookSchema);
});
