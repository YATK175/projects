import fastifyRateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

export const rateLimitPlugin = fp(
  async (fastify) => {
    await fastify.register(fastifyRateLimit, {
      max: 100,
      timeWindow: '1 minute',
      redis: fastify.redis,
      errorResponseBuilder: (request, context) => ({
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Retry after ${context.after}`,
      }),
    });
  },
  { name: 'rate-limit-plugin', dependencies: ['redis-plugin'] },
);
