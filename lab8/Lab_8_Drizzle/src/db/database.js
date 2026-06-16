import fp from 'fastify-plugin';

async function databasePluginImpl(fastify) {
  fastify.decorate('dbMode', 'file-json');
  fastify.log.info('Database plugin started in file-json fallback mode. MySQL is not required.');
}

export const databasePlugin = fp(databasePluginImpl, { name: 'database-plugin' });
