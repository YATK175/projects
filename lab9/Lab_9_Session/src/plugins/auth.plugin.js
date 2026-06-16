import fp from 'fastify-plugin';
import { createAuthService } from '#services/auth.service';

export const authPlugin = fp(
  async (fastify) => {
    fastify.decorate('authService', createAuthService({ db: fastify.db }));
  },
  { name: 'auth-plugin', dependencies: ['drizzle-plugin'] },
);
