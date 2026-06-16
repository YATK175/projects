import HTTP_STATUS from '#constants/httpStatus';
import * as booksController from '#controllers/booksController';
import * as healthController from '#controllers/healthController';
import { sendJson } from '#utils/response';

function matchBookIdRoute(pathname) {
  const match = pathname.match(/^\/books\/(\d+)$/);

  if (!match) {
    return null;
  }

  return { id: Number(match[1]) };
}

async function router(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/health') {
    return healthController.getHealth(req, res);
  }

  if (req.method === 'GET' && pathname === '/books') {
    return booksController.getBooks(req, res, { url });
  }

  if (req.method === 'POST' && pathname === '/books') {
    return booksController.createBook(req, res, { url });
  }

  const bookParams = matchBookIdRoute(pathname);

  if (bookParams && req.method === 'GET') {
    return booksController.getBookById(req, res, { url, params: bookParams });
  }

  if (bookParams && req.method === 'PATCH') {
    return booksController.patchBook(req, res, { url, params: bookParams });
  }

  if (bookParams && req.method === 'PUT') {
    return booksController.putBook(req, res, { url, params: bookParams });
  }

  if (bookParams && req.method === 'DELETE') {
    return booksController.deleteBook(req, res, { url, params: bookParams });
  }

  return sendJson(res, HTTP_STATUS.NOT_FOUND, { error: 'Route not found' });
}

export default router;
