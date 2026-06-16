import fp from 'fastify-plugin';
import mysql from 'mysql2/promise';

async function mysqlPluginImpl(fastify) {
  const pool = mysql.createPool({
    host: fastify.config.MYSQL_HOST,
    port: fastify.config.MYSQL_PORT,
    user: fastify.config.MYSQL_USER,
    password: fastify.config.MYSQL_PASSWORD,
    database: fastify.config.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    const connection = await pool.getConnection();
    connection.release();
    fastify.log.info('MySQL pool connected for Drizzle');
  } catch (error) {
    fastify.log.error(error, 'MySQL connection error');
    process.exit(1);
  }

  fastify.decorate('mysql', pool);

  fastify.addHook('onClose', async () => {
    await pool.end();
    fastify.log.info('MySQL pool closed');
  });
}

export const mysqlPlugin = fp(mysqlPluginImpl, { name: 'mysql-plugin' });
export const databasePlugin = mysqlPlugin;
