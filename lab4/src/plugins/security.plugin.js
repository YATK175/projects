import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fp from 'fastify-plugin';
import { API_METHODS } from '#constants/http';

export const securityPlugin = fp(async (fastify) => {
  await fastify.register(fastifyHelmet, { global: true });

  await fastify.register(fastifyCors, {
    origin: fastify.config.NODE_ENV === 'production' ? fastify.config.PRODUCTION_CORS_ORIGIN : '*',
    methods: API_METHODS,
  });
});
