import Fastify from 'fastify';
import { MESSAGES } from '#constants/messages';
import { errorHandlerPlugin } from '#plugins/error-handler.plugin';
import { envPlugin } from '#plugins/env.plugin';
import { eventBusPlugin } from '#plugins/event-bus.plugin';
import { multipartPlugin } from '#plugins/multipart.plugin';
import { rateLimitPlugin } from '#plugins/rate-limit.plugin';
import { redisPlugin } from '#plugins/redis.plugin';
import { sessionPlugin } from '#plugins/session.plugin';
import { schemasPlugin } from '#plugins/schemas.plugin';
import { securityPlugin } from '#plugins/security.plugin';
import { sensiblePlugin } from '#plugins/sensible.plugin';
import { staticPlugin } from '#plugins/static.plugin';
import { swaggerPlugin } from '#plugins/swagger.plugin';
import { websocketPlugin } from '#plugins/websocket.plugin';
import { itemsRepositoryPlugin } from '#plugins/items-repository.plugin';
import { authPlugin } from '#plugins/auth.plugin';
import { itemsServicePlugin } from '#plugins/items-service.plugin';
import { databasePlugin } from './db/database.js';
import { backupsRoutes } from '#routes/backups.routes';
import { githubV1Routes, githubV2Routes } from '#routes/github.routes';
import { healthRoutes } from '#routes/health.routes';
import { itemsV1Routes, itemsV2Routes } from '#routes/items.routes';
import { websocketRoutes } from '#routes/websocket.routes';
import { authRoutes } from '#routes/auth.routes';
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
  await fastify.register(redisPlugin);
  await fastify.register(sessionPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(multipartPlugin);
  await fastify.register(staticPlugin);
  await fastify.register(swaggerPlugin);
  await fastify.register(websocketPlugin);
  await fastify.register(eventBusPlugin);
  await fastify.register(databasePlugin);
  await fastify.register(itemsRepositoryPlugin);
  await fastify.register(itemsServicePlugin);
  await fastify.register(authPlugin);
  await fastify.register(errorHandlerPlugin);

  fastify.addHook('onClose', async (instance) => {
    instance.log.info(MESSAGES.SERVER_CLOSED);
  });

  await fastify.register(authRoutes, { prefix: '/auth' });

  await fastify.register(healthRoutes, { prefix: '/api/v1' });
  await fastify.register(itemsV1Routes, { prefix: '/api/v1' });
  await fastify.register(backupsRoutes, { prefix: '/api/v1' });
  await fastify.register(websocketRoutes, { prefix: '/api/v1' });
  await fastify.register(githubV1Routes, { prefix: '/api/v1' });
  await fastify.register(itemsV2Routes, { prefix: '/api/v2' });
  await fastify.register(githubV2Routes, { prefix: '/api/v2' });

  return fastify;
};
