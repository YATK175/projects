import { MESSAGES } from '#constants/messages';
import { itemsService } from '#services/items.service';
import { attachImageUrl, attachImageUrls } from '#utils/image-url';

export const itemsController = {
  async getItems(request) {
    const result = await itemsService.getItems(request.query.author);

    return {
      count: result.count,
      items: attachImageUrls(request, result.items),
    };
  },

  async getItemById(request, reply) {
    const item = await itemsService.getBookById(request.params.id);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return attachImageUrl(request, item);
  },

  async createItem(request, reply) {
    const item = await itemsService.createBook(request.body);

    return reply.status(201).send({
      message: MESSAGES.BOOK_CREATED,
      book: attachImageUrl(request, item),
    });
  },

  async patchItem(request, reply) {
    const item = await itemsService.updateBook(request.params.id, request.body);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return {
      message: MESSAGES.BOOK_UPDATED,
      book: attachImageUrl(request, item),
    };
  },

  async replaceItem(request, reply) {
    const item = await itemsService.replaceBook(request.params.id, request.body);

    if (!item) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return {
      message: MESSAGES.BOOK_REPLACED,
      book: attachImageUrl(request, item),
    };
  },

  async deleteItem(request, reply) {
    const isDeleted = await itemsService.deleteBook(request.params.id);

    if (!isDeleted) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return { message: MESSAGES.BOOK_DELETED };
  },

  async exportItems(request, reply) {
    const result = await itemsService.getItems();
    const rows = attachImageUrls(request, result.items);
    const csv = await itemsService.exportCsv(rows);

    return reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="items.csv"')
      .send(csv);
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

    return {
      message: MESSAGES.IMAGE_UPLOADED,
      book: attachImageUrl(request, item),
    };
  },
};
