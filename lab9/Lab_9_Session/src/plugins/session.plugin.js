import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import RedisStore from 'fastify-session-redis-store';
import fp from 'fastify-plugin';

export const sessionPlugin = fp(
  async (fastify) => {
    await fastify.register(fastifyCookie);
    await fastify.register(fastifySession, {
      secret: fastify.config.SESSION_SECRET,
      store: new RedisStore({ client: fastify.redis }),
      cookie: {
        httpOnly: true,
        secure: fastify.config.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      },
      saveUninitialized: false,
    });

    fastify.decorate('authenticate', async (request, reply) => {
      if (!request.session.userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    });
  },
  { name: 'session-plugin', dependencies: ['redis-plugin'] },
);
