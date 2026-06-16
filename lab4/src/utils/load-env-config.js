import Fastify from 'fastify';
import { envPlugin } from '#plugins/env.plugin';

export const loadEnvConfig = async () => {
  const fastify = Fastify({ logger: false });

  await fastify.register(envPlugin);
  await fastify.ready();

  const config = { ...fastify.config };
  await fastify.close();

  return config;
};
