import fp from 'fastify-plugin';
import { eventBus } from '#events/event-bus';

export const eventBusPlugin = fp(async (fastify) => {
  if (!fastify.hasDecorator('bookEvents')) {
    fastify.decorate('bookEvents', eventBus);
  }
});
