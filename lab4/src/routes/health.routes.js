import { MESSAGES } from '#constants/messages';
import { healthController } from '#controllers/health.controller';
import { healthDetailsResponseSchema, publicHealthResponseSchema } from '#schemas/health.schema';

const adminApiKeyHook = async (request, reply) => {
  if (request.headers['x-api-key'] !== request.server.config.ADMIN_API_KEY) {
    throw reply.unauthorized(MESSAGES.UNAUTHORIZED);
  }
};

export const healthRoutes = async (fastify) => {
  fastify.get(
    '/health',
    {
      schema: {
        response: {
          200: publicHealthResponseSchema,
        },
      },
    },
    healthController.getHealth,
  );

  fastify.get(
    '/health/details',
    {
      onRequest: adminApiKeyHook,
      schema: {
        response: {
          200: healthDetailsResponseSchema,
        },
      },
    },
    healthController.getHealthDetails,
  );
};
