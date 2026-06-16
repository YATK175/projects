const books = require('#data/books');

function findAll() {
  return books.map((book) => ({ ...book }));
}

function findById(id) {
  const book = books.find((item) => item.id === id);
  return book ? { ...book } : null;
}

function create(bookData) {
  const maxId = books.length ? Math.max(...books.map((book) => book.id)) : 0;
  const newBook = {
    id: maxId + 1,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    year: bookData.year,
  };

  books.push(newBook);
  return { ...newBook };
}

function updatePartial(id, bookData) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return null;
  }

  books[index] = {
    ...books[index],
    ...bookData,
    id,
  };

  return { ...books[index] };
}

function replace(id, bookData) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return null;
  }

  books[index] = {
    id,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    year: bookData.year,
  };

  return { ...books[index] };
}

function remove(id) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return false;
  }

  books.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  updatePartial,
  replace,
  remove,
};
