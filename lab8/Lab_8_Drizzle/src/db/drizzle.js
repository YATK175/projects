import fp from 'fastify-plugin';

async function drizzlePluginImpl(fastify) {
  fastify.decorate('db', null);
  fastify.log.info('Drizzle plugin disabled for local fallback build.');
}

export const drizzlePlugin = fp(drizzlePluginImpl, {
  name: 'drizzle-plugin',
});
