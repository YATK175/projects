import { buildApp } from './app.js';
import { createGracefulShutdown } from '#utils/graceful-shutdown';

const start = async () => {
  const fastify = await buildApp();
  const gracefulShutdown = createGracefulShutdown(fastify);

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('uncaughtException', (error) => gracefulShutdown(error));
  process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    return gracefulShutdown(error);
  });

  await fastify.listen({
    port: fastify.config.PORT,
    host: fastify.config.HOSTNAME,
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
