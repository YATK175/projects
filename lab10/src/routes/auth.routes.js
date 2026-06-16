import { authController } from '#controllers/auth.controller';
import {
  authLoginBodySchema,
  authLoginResponseSchema,
  authRegisterBodySchema,
  authRegisterResponseSchema,
} from '#schemas/auth.schema';

export const authRoutes = async (fastify) => {
  fastify.post(
    '/register',
    {
      schema: {
        tags: ['auth'],
        body: authRegisterBodySchema,
        response: { 201: authRegisterResponseSchema },
      },
    },
    authController.register,
  );

  fastify.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        body: authLoginBodySchema,
        response: { 200: authLoginResponseSchema },
      },
    },
    authController.login,
  );

  fastify.post('/refresh', { schema: { tags: ['auth'] } }, authController.refresh);

  fastify.post(
    '/logout',
    {
      onRequest: [fastify.authenticate],
      schema: { tags: ['auth'], security: [{ bearerAuth: [] }] },
    },
    authController.logout,
  );
};
