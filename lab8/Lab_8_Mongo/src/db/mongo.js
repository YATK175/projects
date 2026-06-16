import fp from 'fastify-plugin';
import mongoose from 'mongoose';

async function mongoPlugin(fastify) {
  try {
    await mongoose.connect(fastify.config.MONGO_URL, {
      dbName: fastify.config.MONGO_DB_NAME,
    });
    fastify.log.info('MongoDB connected');
    fastify.decorate('mongoose', mongoose);
  } catch (error) {
    fastify.log.error(error, 'MongoDB connection error');
    process.exit(1);
  }

  fastify.addHook('onClose', async () => {
    await mongoose.connection.close();
    fastify.log.info('MongoDB connection closed');
  });
}

export const databasePlugin = fp(mongoPlugin, { name: 'mongo-plugin' });
