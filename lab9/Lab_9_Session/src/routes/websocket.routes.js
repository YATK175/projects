import { BOOK_EVENTS } from '#events/event-bus';
import { itemsService } from '#services/items.service';

const safeSend = (socket, payload) => {
  if (socket.readyState === socket.OPEN || socket.readyState === 1) {
    socket.send(JSON.stringify(payload));
  }
};

export const websocketRoutes = async (fastify) => {
  const clients = new Set();

  const broadcast = (payload) => {
    for (const socket of clients) {
      safeSend(socket, payload);
    }
  };

  fastify.bookEvents.on(BOOK_EVENTS.CREATED, broadcast);
  fastify.bookEvents.on(BOOK_EVENTS.UPDATED, broadcast);
  fastify.bookEvents.on(BOOK_EVENTS.REPLACED, broadcast);
  fastify.bookEvents.on(BOOK_EVENTS.DELETED, broadcast);

  fastify.addHook('onClose', async () => {
    fastify.bookEvents.off(BOOK_EVENTS.CREATED, broadcast);
    fastify.bookEvents.off(BOOK_EVENTS.UPDATED, broadcast);
    fastify.bookEvents.off(BOOK_EVENTS.REPLACED, broadcast);
    fastify.bookEvents.off(BOOK_EVENTS.DELETED, broadcast);
    clients.clear();
  });

  fastify.get('/items/ws', { websocket: true }, async (connection, request) => {
    const socket = connection.socket ?? connection;
    clients.add(socket);

    const result = await itemsService.getItems();
    safeSend(socket, {
      event: 'initial',
      data: result.items,
    });

    socket.on('close', () => {
      clients.delete(socket);
    });

    socket.on('message', (rawMessage) => {
      safeSend(socket, {
        event: 'echo',
        data: rawMessage.toString(),
      });
    });

    request.log.info('WebSocket client connected');
  });
};
