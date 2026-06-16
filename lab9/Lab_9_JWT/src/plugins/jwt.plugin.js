import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { REDIS_KEYS } from '#constants/redis-keys';

export const jwtPlugin = fp(
  async (fastify) => {
    await fastify.register(fastifyCookie);
    await fastify.register(fastifyJwt, {
      secret: fastify.config.JWT_SECRET,
      sign: { expiresIn: '15m' },
      trusted: async (request, decodedToken) => {
        if (!decodedToken.jti) return true;
        const exists = await fastify.redis.get(REDIS_KEYS.tokenBlacklist(decodedToken.jti));
        return !exists;
      },
    });

    fastify.decorate('authenticate', async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    });
  },
  { name: 'jwt-plugin', dependencies: ['redis-plugin'] },
);
