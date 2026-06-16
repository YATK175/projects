import fastifyStatic from '@fastify/static';
import fp from 'fastify-plugin';
import { UPLOADS_DIR } from '#utils/paths';

export const staticPlugin = fp(async (fastify) => {
  await fastify.register(fastifyStatic, {
    root: UPLOADS_DIR,
    prefix: '/uploads/',
  });
});
