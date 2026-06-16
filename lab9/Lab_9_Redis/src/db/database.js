import fp from 'fastify-plugin';
import { mysqlPlugin } from './mysql.js';
import { drizzlePlugin } from './drizzle.js';

async function databasePluginImpl(fastify) {
  await fastify.register(mysqlPlugin);
  await fastify.register(drizzlePlugin);
}

export const databasePlugin = fp(databasePluginImpl, { name: 'database-plugin' });
