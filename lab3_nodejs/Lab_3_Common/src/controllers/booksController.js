const HTTP_STATUS = require('#constants/httpStatus');
const booksService = require('#services/booksService');
const { sendJson } = require('#utils/response');
const { readJsonBody } = require('#utils/requestBody');
const validateData = require('#validators/validate');
const { bookCreateSchema, bookPatchSchema } = require('#validators/book.schema');
const { idParamsSchema } = require('#validators/params.schema');
const { bookQuerySchema } = require('#validators/query.schema');

function validateParams(params) {
  const error = validateData(idParamsSchema, params);

  if (error) {
    return `Invalid route params: ${error}`;
  }

  return null;
}

async function getBooks(req, res, context) {
  const query = Object.fromEntries(context.url.searchParams.entries());
  const queryError = validateData(bookQuerySchema, query);

  if (queryError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: queryError });
  }

  const items = booksService.getBooks(query);

  return sendJson(res, HTTP_STATUS.OK, {
    count: items.length,
    items,
  });
}

async function getBookById(req, res, context) {
  const params = { id: Number(context.params.id) };
  const paramsError = validateParams(params);

  if (paramsError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: paramsError });
  }

  const book = booksService.getBookById(params.id);

  if (!book) {
    return sendJson(res, HTTP_STATUS.NOT_FOUND, { error: 'Book not found' });
  }

  return sendJson(res, HTTP_STATUS.OK, book);
}

async function createBook(req, res) {
  const body = await readJsonBody(req);
  const bodyError = validateData(bookCreateSchema, body);

  if (bodyError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: bodyError });
  }

  const book = booksService.createBook(body);

  return sendJson(res, HTTP_STATUS.CREATED, {
    message: 'Book created successfully',
    book,
  });
}

async function patchBook(req, res, context) {
  const params = { id: Number(context.params.id) };
  const paramsError = validateParams(params);

  if (paramsError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: paramsError });
  }

  const body = await readJsonBody(req);
  const bodyError = validateData(bookPatchSchema, body);

  if (bodyError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: bodyError });
  }

  const book = booksService.updateBookPartially(params.id, body);

  if (!book) {
    return sendJson(res, HTTP_STATUS.NOT_FOUND, { error: 'Book not found' });
  }

  return sendJson(res, HTTP_STATUS.OK, {
    message: 'Book updated successfully',
    book,
  });
}

async function putBook(req, res, context) {
  const params = { id: Number(context.params.id) };
  const paramsError = validateParams(params);

  if (paramsError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: paramsError });
  }

  const body = await readJsonBody(req);
  const bodyError = validateData(bookCreateSchema, body);

  if (bodyError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: bodyError });
  }

  const book = booksService.replaceBook(params.id, body);

  if (!book) {
    return sendJson(res, HTTP_STATUS.NOT_FOUND, { error: 'Book not found' });
  }

  return sendJson(res, HTTP_STATUS.OK, {
    message: 'Book replaced successfully',
    book,
  });
}

async function deleteBook(req, res, context) {
  const params = { id: Number(context.params.id) };
  const paramsError = validateParams(params);

  if (paramsError) {
    return sendJson(res, HTTP_STATUS.BAD_REQUEST, { error: paramsError });
  }

  const deleted = booksService.deleteBook(params.id);

  if (!deleted) {
    return sendJson(res, HTTP_STATUS.NOT_FOUND, { error: 'Book not found' });
  }

  return sendJson(res, HTTP_STATUS.OK, { message: 'Book deleted successfully' });
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  patchBook,
  putBook,
  deleteBook,
};
