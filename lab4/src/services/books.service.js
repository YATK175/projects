import { booksRepository } from '#repositories/books.repository';

export const booksService = {
  getBooks(author) {
    const items = booksRepository.findAll(author);

    return {
      count: items.length,
      items,
    };
  },

  getBookById(id) {
    return booksRepository.findById(id);
  },

  createBook(data) {
    return booksRepository.create(data);
  },

  updateBook(id, updates) {
    return booksRepository.patch(id, updates);
  },

  replaceBook(id, data) {
    return booksRepository.replace(id, data);
  },

  deleteBook(id) {
    return booksRepository.delete(id);
  },
};
