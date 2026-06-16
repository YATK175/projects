import { MESSAGES } from '#constants/messages';
import { healthController } from '#controllers/health.controller';
import { healthDetailsResponseSchema, healthResponseSchema } from '#schemas/health.schema';

export const healthRoutes = async (fastify) => {
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        response: { 200: healthResponseSchema },
      },
    },
    healthController.getHealth,
  );

  fastify.get(
    '/health/details',
    {
      onRequest: async (request, reply) => {
        if (request.headers['x-api-key'] !== fastify.config.ADMIN_API_KEY) {
          throw reply.unauthorized(MESSAGES.UNAUTHORIZED);
        }
      },
      schema: {
        tags: ['health'],
        response: { 200: healthDetailsResponseSchema },
      },
    },
    healthController.getHealthDetails,
  );
};
