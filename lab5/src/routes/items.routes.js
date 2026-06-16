import { itemsController } from '#controllers/items.controller';
import {
  bookActionResponseSchema,
  bookCreateBodySchema,
  bookParamsSchema,
  bookPatchBodySchema,
  bookQuerySchema,
  booksListResponseSchema,
  deleteResponseSchema,
  importResponseSchema,
  uploadImageResponseSchema,
} from '#schemas/book.schema';

const registerCrudRoutes = async (fastify, prefix) => {
  fastify.get(
    `${prefix}`,
    {
      schema: {
        querystring: bookQuerySchema,
        response: { 200: booksListResponseSchema },
      },
    },
    itemsController.getItems,
  );

  fastify.get(
    `${prefix}/:id`,
    {
      schema: {
        params: bookParamsSchema,
        response: { 200: { $ref: 'Book#' } },
      },
    },
    itemsController.getItemById,
  );

  fastify.post(
    `${prefix}`,
    {
      schema: {
        body: bookCreateBodySchema,
        response: { 201: bookActionResponseSchema },
      },
    },
    itemsController.createItem,
  );

  fastify.patch(
    `${prefix}/:id`,
    {
      schema: {
        params: bookParamsSchema,
        body: bookPatchBodySchema,
        response: { 200: bookActionResponseSchema },
      },
    },
    itemsController.patchItem,
  );

  fastify.put(
    `${prefix}/:id`,
    {
      schema: {
        params: bookParamsSchema,
        body: bookCreateBodySchema,
        response: { 200: bookActionResponseSchema },
      },
    },
    itemsController.replaceItem,
  );

  fastify.delete(
    `${prefix}/:id`,
    {
      schema: {
        params: bookParamsSchema,
        response: { 200: deleteResponseSchema },
      },
    },
    itemsController.deleteItem,
  );
};

export const itemsRoutes = async (fastify) => {
  await registerCrudRoutes(fastify, '/books');
  await registerCrudRoutes(fastify, '/items');

  fastify.get('/items/export', itemsController.exportItems);

  fastify.post(
    '/items/import',
    {
      schema: {
        response: { 200: importResponseSchema },
      },
    },
    itemsController.importItems,
  );

  fastify.post(
    '/items/:id/image',
    {
      schema: {
        params: bookParamsSchema,
        response: { 200: uploadImageResponseSchema },
      },
    },
    itemsController.uploadImage,
  );
};
