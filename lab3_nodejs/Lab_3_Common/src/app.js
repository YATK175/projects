const { createServer } = require('node:http');
const config = require('#config/config');
const router = require('#routes/router');
const HTTP_STATUS = require('#constants/httpStatus');
const { logRequest, logError, logInfo } = require('#utils/logger');
const { sendJson } = require('#utils/response');

let isShuttingDown = false;

const server = createServer(async (req, res) => {
  res.on('finish', () => {
    logRequest(req, res);
  });

  try {
    await router(req, res);
  } catch (error) {
    logError(error.message, {
      method: req.method,
      url: req.url,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });

    if (!res.headersSent) {
      sendJson(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        error: 'Internal server error',
      });
    }
  }
});

function gracefulShutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logInfo(`Received ${signal}. Starting graceful shutdown`);

  const timeout = setTimeout(() => {
    logError('Server did not close in time. Forced shutdown', { status: 1 });
    process.exit(1);
  }, 10000);

  server.close((error) => {
    clearTimeout(timeout);

    if (error) {
      logError(`Error during server close: ${error.message}`, { status: 1 });
      process.exit(1);
    }

    logInfo('HTTP server closed successfully');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`, { status: 1 });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  logError(`Unhandled rejection: ${message}`, { status: 1 });
  gracefulShutdown('unhandledRejection');
});

server.listen(config.PORT, config.HOSTNAME, () => {
  logInfo(`Server running at http://${config.HOSTNAME}:${config.PORT}/`);
});
