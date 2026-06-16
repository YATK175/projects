import Fastify from 'fastify';
import { MESSAGES } from '#constants/messages';
import { errorHandlerPlugin } from '#plugins/error-handler.plugin';
import { envPlugin } from '#plugins/env.plugin';
import { multipartPlugin } from '#plugins/multipart.plugin';
import { schemasPlugin } from '#plugins/schemas.plugin';
import { securityPlugin } from '#plugins/security.plugin';
import { sensiblePlugin } from '#plugins/sensible.plugin';
import { staticPlugin } from '#plugins/static.plugin';
import { healthRoutes } from '#routes/health.routes';
import { itemsRoutes } from '#routes/items.routes';
import { isMigrationNeeded } from '#migrations/migrate';
import { createStartupBackup } from '#utils/backup';
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
  await fastify.register(multipartPlugin);
  await fastify.register(staticPlugin);
  await fastify.register(errorHandlerPlugin);

  fastify.addHook('onClose', async (instance) => {
    instance.log.info(MESSAGES.SERVER_CLOSED);
  });

  await createStartupBackup(fastify.log);

  if (await isMigrationNeeded()) {
    fastify.log.warn('Data schema changed. Run "npm run migrate" to update existing files.');
  }

  await fastify.register(healthRoutes);
  await fastify.register(itemsRoutes);

  return fastify;
};
