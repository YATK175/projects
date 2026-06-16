import { MESSAGES } from '#constants/messages';
import { booksService } from '#services/books.service';

export const booksController = {
  async getBooks(request) {
    return booksService.getBooks(request.query.author);
  },

  async getBookById(request, reply) {
    const book = booksService.getBookById(request.params.id);

    if (!book) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return book;
  },

  async createBook(request, reply) {
    const book = booksService.createBook(request.body);

    return reply.status(201).send({
      message: MESSAGES.BOOK_CREATED,
      book,
    });
  },

  async patchBook(request, reply) {
    const book = booksService.updateBook(request.params.id, request.body);

    if (!book) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return {
      message: MESSAGES.BOOK_UPDATED,
      book,
    };
  },

  async replaceBook(request, reply) {
    const book = booksService.replaceBook(request.params.id, request.body);

    if (!book) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return {
      message: MESSAGES.BOOK_REPLACED,
      book,
    };
  },

  async deleteBook(request, reply) {
    const isDeleted = booksService.deleteBook(request.params.id);

    if (!isDeleted) {
      throw reply.notFound(MESSAGES.BOOK_NOT_FOUND);
    }

    return {
      message: MESSAGES.BOOK_DELETED,
    };
  },
};
