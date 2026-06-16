import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';

export const securityPlugin = fp(async (fastify) => {
  await fastify.register(helmet, { global: true });
  await fastify.register(cors, {
    origin: fastify.config.NODE_ENV === 'production' ? fastify.config.PRODUCTION_CORS_ORIGIN : '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });
});
