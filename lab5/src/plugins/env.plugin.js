import fastifyEnv from '@fastify/env';
import fp from 'fastify-plugin';
import { envSchema } from '#schemas/env.schema';

export const envPlugin = fp(async (fastify) => {
  await fastify.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true,
  });
});
