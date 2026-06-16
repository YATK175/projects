import { booksController } from '#controllers/books.controller';
import {
  bookActionResponseSchema,
  bookCreateBodySchema,
  bookParamsSchema,
  bookPatchBodySchema,
  bookQuerySchema,
  booksListResponseSchema,
  deleteResponseSchema,
} from '#schemas/book.schema';

export const booksRoutes = async (fastify) => {
  fastify.get(
    '/books',
    {
      schema: {
        querystring: bookQuerySchema,
        response: {
          200: booksListResponseSchema,
        },
      },
    },
    booksController.getBooks,
  );

  fastify.get(
    '/books/:id',
    {
      schema: {
        params: bookParamsSchema,
        response: {
          200: { $ref: 'Book#' },
        },
      },
    },
    booksController.getBookById,
  );

  fastify.post(
    '/books',
    {
      schema: {
        body: bookCreateBodySchema,
        response: {
          201: bookActionResponseSchema,
        },
      },
    },
    booksController.createBook,
  );

  fastify.patch(
    '/books/:id',
    {
      schema: {
        params: bookParamsSchema,
        body: bookPatchBodySchema,
        response: {
          200: bookActionResponseSchema,
        },
      },
    },
    booksController.patchBook,
  );

  fastify.put(
    '/books/:id',
    {
      schema: {
        params: bookParamsSchema,
        body: bookCreateBodySchema,
        response: {
          200: bookActionResponseSchema,
        },
      },
    },
    booksController.replaceBook,
  );

  fastify.delete(
    '/books/:id',
    {
      schema: {
        params: bookParamsSchema,
        response: {
          200: deleteResponseSchema,
        },
      },
    },
    booksController.deleteBook,
  );
};
