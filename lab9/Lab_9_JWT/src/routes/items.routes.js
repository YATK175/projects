import { itemsController } from '#controllers/items.controller';
import {
  bookActionResponseSchema,
  bookCreateBodySchema,
  bookParamsSchema,
  bookPatchBodySchema,
  bookQuerySchema,
  booksListResponseSchema,
  deleteResponseSchema,
  exportQuerySchema,
  importResponseSchema,
  paginatedBooksResponseSchema,
  paginationQuerySchema,
  uploadImageResponseSchema,
} from '#schemas/book.schema';

const authOptions = (fastify) =>
  fastify.authenticate ? { onRequest: [fastify.authenticate] } : {};

const registerCrudRoutes = async (fastify, prefix) => {
  fastify.get(
    `${prefix}`,
    {
      schema: {
        tags: ['items'],
        querystring: bookQuerySchema,
        response: { 200: booksListResponseSchema },
      },
    },
    itemsController.getItems,
  );

  fastify.post(
    `${prefix}`,
    {
      ...authOptions(fastify),
      schema: {
        tags: ['items'],
        body: bookCreateBodySchema,
        response: { 201: bookActionResponseSchema },
      },
    },
    itemsController.createItem,
  );

  fastify.get(
    `${prefix}/:id/details`,
    {
      schema: {
        tags: ['items'],
        params: bookParamsSchema,
        response: { 200: { $ref: 'BookDetails#' } },
      },
    },
    itemsController.getItemDetails,
  );

  fastify.post(
    `${prefix}/:id/image`,
    {
      ...authOptions(fastify),
      schema: {
        tags: ['items'],
        params: bookParamsSchema,
        response: { 200: uploadImageResponseSchema },
      },
    },
    itemsController.uploadImage,
  );

  fastify.get(
    `${prefix}/:id`,
    {
      schema: {
        tags: ['items'],
        params: bookParamsSchema,
        response: { 200: { $ref: 'Book#' } },
      },
    },
    itemsController.getItemById,
  );

  fastify.patch(
    `${prefix}/:id`,
    {
      ...authOptions(fastify),
      schema: {
        tags: ['items'],
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
      ...authOptions(fastify),
      schema: {
        tags: ['items'],
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
      ...authOptions(fastify),
      schema: {
        tags: ['items'],
        params: bookParamsSchema,
        response: { 200: deleteResponseSchema },
      },
    },
    itemsController.deleteItem,
  );
};

export const itemsV1Routes = async (fastify) => {
  fastify.get(
    '/items/export',
    {
      schema: {
        tags: ['items'],
        querystring: exportQuerySchema,
      },
    },
    itemsController.exportItems,
  );

  fastify.get(
    '/items/stream',
    {
      schema: {
        tags: ['items'],
        querystring: bookQuerySchema,
      },
    },
    itemsController.streamItems,
  );

  fastify.post(
    '/items/import',
    {
      ...authOptions(fastify),
      schema: {
        tags: ['items'],
        response: { 200: importResponseSchema },
      },
    },
    itemsController.importItems,
  );

  await registerCrudRoutes(fastify, '/books');
  await registerCrudRoutes(fastify, '/items');
};

export const itemsV2Routes = async (fastify) => {
  fastify.get(
    '/items',
    {
      schema: {
        tags: ['items'],
        querystring: paginationQuerySchema,
        response: { 200: paginatedBooksResponseSchema },
      },
    },
    itemsController.getPaginatedItems,
  );
};
