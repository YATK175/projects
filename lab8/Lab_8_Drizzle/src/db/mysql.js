import fp from 'fastify-plugin';

async function mysqlPluginImpl(fastify) {
  fastify.decorate('mysql', null);
  fastify.log.info('MySQL plugin disabled for local fallback build.');
}

export const mysqlPlugin = fp(mysqlPluginImpl, { name: 'mysql-plugin' });
export const databasePlugin = mysqlPlugin;
