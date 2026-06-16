import fp from 'fastify-plugin';

const createMemoryRedis = () => {
  const store = new Map();
  const timers = new Map();

  const clearTimer = (key) => {
    const timer = timers.get(key);
    if (timer) {
      clearTimeout(timer);
      timers.delete(key);
    }
  };

  const scheduleExpire = (key, seconds) => {
    clearTimer(key);
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    const timer = setTimeout(() => {
      store.delete(key);
      timers.delete(key);
    }, seconds * 1000);

    timer.unref?.();
    timers.set(key, timer);
  };

  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },

    async set(key, value, mode, seconds) {
      store.set(key, String(value));
      if (mode === 'EX') scheduleExpire(key, Number(seconds));
      return 'OK';
    },

    async del(keys) {
      const list = Array.isArray(keys) ? keys : [keys];
      let deleted = 0;

      for (const key of list) {
        clearTimer(key);
        if (store.delete(key)) deleted += 1;
      }

      return deleted;
    },

    async keys(pattern = '*') {
      if (pattern === '*') return [...store.keys()];
      const prefix = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
      return [...store.keys()].filter((key) => key.startsWith(prefix));
    },

    async flushdb() {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
      store.clear();
      return 'OK';
    },

    async quit() {
      await this.flushdb();
    },
  };
};

export const redisPlugin = fp(
  async (fastify) => {
    const redis = createMemoryRedis();
    fastify.decorate('redis', redis);
    fastify.log.info(
      'Redis plugin started in in-memory fallback mode. Redis server is not required.',
    );

    fastify.addHook('onClose', async () => {
      await redis.quit();
      fastify.log.info('In-memory Redis fallback closed');
    });
  },
  { name: 'redis-plugin' },
);
