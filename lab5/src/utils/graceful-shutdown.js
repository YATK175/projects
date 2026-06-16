import { setTimeout, clearTimeout } from 'node:timers';
export const createGracefulShutdown = (fastify) => {
  let isShuttingDown = false;

  return async (reason) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    const isError = reason instanceof Error;
    const signal = isError ? reason.name : reason;

    fastify.log[isError ? 'error' : 'info']({ reason }, `Graceful shutdown started: ${signal}`);

    const timeout = setTimeout(() => {
      fastify.log.error('Forced shutdown: timeout exceeded');
      process.exit(1);
    }, 10000);
    timeout.unref();

    try {
      await fastify.close();
      clearTimeout(timeout);
      process.exit(isError ? 1 : 0);
    } catch (error) {
      fastify.log.error({ err: error }, 'Shutdown failed');
      clearTimeout(timeout);
      process.exit(1);
    }
  };
};
