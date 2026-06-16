import { githubController } from '#controllers/github.controller';
import { githubRepoQuerySchema, sharedReposResponseSchema } from '#schemas/github.schema';

export const githubV1Routes = async (fastify) => {
  fastify.get(
    '/github/shared-repos',
    {
      schema: {
        tags: ['github'],
        querystring: githubRepoQuerySchema,
        response: { 200: sharedReposResponseSchema },
      },
    },
    githubController.getSharedReposV1,
  );
};

export const githubV2Routes = async (fastify) => {
  fastify.get(
    '/github/shared-repos',
    {
      schema: {
        tags: ['github'],
        querystring: githubRepoQuerySchema,
        response: { 200: sharedReposResponseSchema },
      },
    },
    githubController.getSharedReposV2,
  );
};
