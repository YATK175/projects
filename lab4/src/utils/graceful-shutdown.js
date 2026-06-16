export const createGracefulShutdown = (fastify) => {
  let isShuttingDown = false;

  return async (signalOrError) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    const signal = signalOrError instanceof Error ? signalOrError.message : signalOrError;

    fastify.log.warn({ signal }, 'Graceful shutdown started');

    const forceExitTimer = setTimeout(() => {
      fastify.log.fatal('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);

    forceExitTimer.unref();

    try {
      await fastify.close();
      clearTimeout(forceExitTimer);
      fastify.log.info('Graceful shutdown finished');
      process.exit(0);
    } catch (error) {
      clearTimeout(forceExitTimer);
      fastify.log.fatal({ err: error }, 'Error during graceful shutdown');
      process.exit(1);
    }
  };
};
