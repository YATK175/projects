export const getLoggerOptions = (nodeEnv) => ({
  level: nodeEnv === 'production' ? 'error' : 'info',
  transport:
    nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:dd.mm.yyyy HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
