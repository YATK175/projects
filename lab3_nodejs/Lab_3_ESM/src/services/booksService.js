import * as booksRepository from '#repositories/booksRepository';

function getBooks(query) {
  const books = booksRepository.findAll();

  if (!query.author) {
    return books;
  }

  return books.filter((book) => book.author.toLowerCase().includes(query.author.toLowerCase()));
}

function getBookById(id) {
  return booksRepository.findById(id);
}

function createBook(bookData) {
  return booksRepository.create(bookData);
}

function updateBookPartially(id, bookData) {
  return booksRepository.updatePartial(id, bookData);
}

function replaceBook(id, bookData) {
  return booksRepository.replace(id, bookData);
}

function deleteBook(id) {
  return booksRepository.remove(id);
}

export { getBooks, getBookById, createBook, updateBookPartially, replaceBook, deleteBook };
