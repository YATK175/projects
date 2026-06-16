export const getLoggerOptions = (nodeEnv = 'development') => {
  if (nodeEnv === 'production') {
    return {
      level: 'error',
    };
  }

  return {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'dd.mm.yyyy HH:MM:ss',
      },
    },
  };
};
