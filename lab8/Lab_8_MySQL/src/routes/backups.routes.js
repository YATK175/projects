import { MESSAGES } from '#constants/messages';
import { backupsController } from '#controllers/backups.controller';
import { backupParamsSchema } from '#schemas/backup.schema';

export const backupsRoutes = async (fastify) => {
  fastify.get(
    '/backups/:timestamp',
    {
      onRequest: async (request, reply) => {
        if (request.headers['x-api-key'] !== fastify.config.ADMIN_API_KEY) {
          throw reply.unauthorized(MESSAGES.UNAUTHORIZED);
        }
      },
      schema: {
        tags: ['backups'],
        params: backupParamsSchema,
      },
    },
    backupsController.downloadBackup,
  );
};
