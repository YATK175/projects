import { BOOK_EVENTS } from '#events/event-bus';
import { MESSAGES } from '#constants/messages';
import { itemsService } from '#services/items.service';
import { attachImageUrl, attachImageUrls } from '#utils/image-url';

const isTransformEnabled = (value) => value === true || value === 'true';

export const itemsController = {
  async getItems(request) {
    const result = await itemsService.getItems(request.query.author);

    return {
      count: result.count,
      items: attachImageUrls(request, result.items),
    };
  },

  async getPaginatedItems(request) {
    const result = await itemsService.getPaginatedItems(request.query);

    return {
      data: attachImageUrls(request, result.data),
      meta: result.meta,
    };
  },

  async getItemById(request, reply) {
    const item = await itemsService.getBookById(request.params.id);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return attachImageUrl(request, item);
  },

  async getItemDetails(request, reply) {
    const item = await itemsService.getBookDetails({
      id: request.params.id,
      externalApiUrl: request.server.config.EXTERNAL_API_URL,
      logger: request.log,
    });

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return attachImageUrl(request, item);
  },

  async createItem(request, reply) {
    const item = await itemsService.createBook(request.body);
    const book = attachImageUrl(request, item);

    request.server.bookEvents.emit(BOOK_EVENTS.CREATED, { event: BOOK_EVENTS.CREATED, data: book });

    return reply.status(201).send({
      message: MESSAGES.BOOK_CREATED,
      book,
    });
  },

  async patchItem(request, reply) {
    const item = await itemsService.updateBook(request.params.id, request.body);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    const book = attachImageUrl(request, item);
    request.server.bookEvents.emit(BOOK_EVENTS.UPDATED, { event: BOOK_EVENTS.UPDATED, data: book });

    return {
      message: MESSAGES.BOOK_UPDATED,
      book,
    };
  },

  async replaceItem(request, reply) {
    const item = await itemsService.replaceBook(request.params.id, request.body);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    const book = attachImageUrl(request, item);
    request.server.bookEvents.emit(BOOK_EVENTS.REPLACED, {
      event: BOOK_EVENTS.REPLACED,
      data: book,
    });

    return {
      message: MESSAGES.BOOK_REPLACED,
      book,
    };
  },

  async deleteItem(request, reply) {
    const isDeleted = await itemsService.deleteBook(request.params.id);

    if (!isDeleted) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    request.server.bookEvents.emit(BOOK_EVENTS.DELETED, {
      event: BOOK_EVENTS.DELETED,
      id: request.params.id,
    });

    return { message: MESSAGES.BOOK_DELETED };
  },

  async exportItems(request, reply) {
    const transform = isTransformEnabled(request.query.transform);
    const stream = itemsService.createCsvExportStream({
      request,
      author: request.query.author,
      transform,
    });

    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="items.csv"')
      .send(stream);
  },

  async streamItems(request, reply) {
    const stream = itemsService.createNdjsonStream({ request, author: request.query.author });

    return reply.type('application/x-ndjson').send(stream);
  },

  async importItems(request, reply) {
    const data = await request.file();

    if (!data) {
      throw reply.badRequest('File is required');
    }

    const buffer = await data.toBuffer();
    const records = itemsService.parseImportFile({
      filename: data.filename,
      mimetype: data.mimetype,
      buffer,
    });

    if (!records) {
      throw reply.badRequest(MESSAGES.INVALID_IMPORT_FILE);
    }

    return itemsService.importItems(records);
  },

  async uploadImage(request, reply) {
    const data = await request.file();

    if (!data) {
      throw reply.badRequest('Image file is required');
    }

    if (!['image/jpeg', 'image/png'].includes(data.mimetype)) {
      throw reply.badRequest(MESSAGES.IMAGE_TYPE_NOT_ALLOWED);
    }

    const item = await itemsService.saveImage(request.params.id, data);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    const book = attachImageUrl(request, item);
    request.server.bookEvents.emit(BOOK_EVENTS.UPDATED, { event: BOOK_EVENTS.UPDATED, data: book });

    return {
      message: MESSAGES.IMAGE_UPLOADED,
      book,
    };
  },
};
