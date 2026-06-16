import fp from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema.js';

async function drizzlePluginImpl(fastify) {
  if (!fastify.mysql) {
    throw new Error('MySQL pool is not registered. Register mysql plugin before drizzle.');
  }

  const db = drizzle(fastify.mysql, { schema, mode: 'default' });
  fastify.decorate('db', db);

  fastify.addHook('onClose', async (instance) => {
    instance.log.info('Drizzle layer closed');
  });
}

export const drizzlePlugin = fp(drizzlePluginImpl, {
  name: 'drizzle-plugin',
  dependencies: ['mysql-plugin'],
});
