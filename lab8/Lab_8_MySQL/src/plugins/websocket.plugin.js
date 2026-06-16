import fastifyWebsocket from '@fastify/websocket';
import fp from 'fastify-plugin';

export const websocketPlugin = fp(async (fastify) => {
  await fastify.register(fastifyWebsocket);
});
