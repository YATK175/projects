import Fastify from 'fastify';
import { MESSAGES } from '#constants/messages';
import { errorHandlerPlugin } from '#plugins/error-handler.plugin';
import { envPlugin } from '#plugins/env.plugin';
import { schemasPlugin } from '#plugins/schemas.plugin';
import { securityPlugin } from '#plugins/security.plugin';
import { sensiblePlugin } from '#plugins/sensible.plugin';
import { booksRoutes } from '#routes/books.routes';
import { healthRoutes } from '#routes/health.routes';
import { getLoggerOptions } from '#utils/logger-options';
import { loadEnvConfig } from '#utils/load-env-config';

export const buildApp = async () => {
  const initialConfig = await loadEnvConfig();

  const fastify = Fastify({
    logger: getLoggerOptions(initialConfig.NODE_ENV),
  });

  await fastify.register(envPlugin);
  await fastify.register(schemasPlugin);
  await fastify.register(sensiblePlugin);
  await fastify.register(securityPlugin);
  await fastify.register(errorHandlerPlugin);

  fastify.addHook('onClose', async (instance) => {
    instance.log.info(MESSAGES.SERVER_CLOSED);
  });

  await fastify.register(healthRoutes);
  await fastify.register(booksRoutes);

  return fastify;
};
