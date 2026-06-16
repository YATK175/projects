export const healthController = {
  async getHealth() {
    return {
      status: 'ok',
    };
  },

  async getHealthDetails() {
    return {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  },
};
