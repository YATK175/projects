import multipart from '@fastify/multipart';
import fp from 'fastify-plugin';

export const multipartPlugin = fp(async (fastify) => {
  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
});
