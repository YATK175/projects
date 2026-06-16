import fastifyRedis from '@fastify/redis';
import fp from 'fastify-plugin';

export const redisPlugin = fp(
  async (fastify) => {
    await fastify.register(fastifyRedis, {
      host: fastify.config.REDIS_HOST,
      port: fastify.config.REDIS_PORT,
      closeClient: true,
    });
  },
  { name: 'redis-plugin' },
);
