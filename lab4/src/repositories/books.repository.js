import { books } from '../data.js';

let nextId = books.reduce((maxId, book) => Math.max(maxId, book.id), 0) + 1;

export const booksRepository = {
  findAll(author) {
    if (!author) {
      return [...books];
    }

    return books.filter((book) => book.author.toLowerCase().includes(author.toLowerCase()));
  },

  findById(id) {
    return books.find((book) => book.id === id) ?? null;
  },

  create(data) {
    const book = {
      id: nextId,
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year,
    };

    nextId += 1;
    books.push(book);
    return book;
  },

  patch(id, updates) {
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return null;
    }

    books[index] = {
      ...books[index],
      ...updates,
      id: books[index].id,
    };

    if (updates.title) {
      books[index].title = updates.title.trim();
    }

    if (updates.author) {
      books[index].author = updates.author.trim();
    }

    return books[index];
  },

  replace(id, data) {
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return null;
    }

    books[index] = {
      id,
      title: data.title.trim(),
      author: data.author.trim(),
      year: data.year,
    };

    return books[index];
  },

  delete(id) {
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return false;
    }

    books.splice(index, 1);
    return true;
  },
};
