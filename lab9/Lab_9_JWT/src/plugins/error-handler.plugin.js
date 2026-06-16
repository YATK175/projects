import fp from 'fastify-plugin';

export const errorHandlerPlugin = fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;

    request.log.error(
      {
        err: error,
        method: request.method,
        url: request.url,
        statusCode,
      },
      'Request error',
    );

    return reply.status(statusCode).send({
      statusCode,
      error: error.name,
      message: error.message,
    });
  });
});
