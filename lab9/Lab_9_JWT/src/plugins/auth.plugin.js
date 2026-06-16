import fp from 'fastify-plugin';
import { createAuthService } from '#services/auth.service';

export const authPlugin = fp(
  async (fastify) => {
    fastify.decorate('authService', createAuthService());
  },
  { name: 'auth-plugin' },
);
