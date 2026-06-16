export const healthController = {
  getHealth() {
    return { status: 'ok' };
  },

  getHealthDetails() {
    return {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  },
};
