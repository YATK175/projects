import { REDIS_KEYS } from '#constants/redis-keys';

const CACHE_TTL_SECONDS = 120;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const fetchWithRetry = async (url, logger) => {
  const retryDelays = [1000, 2000, 4000];

  for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, 5000);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === retryDelays.length) throw error;
      logger.warn(
        { err: error, attempt: attempt + 1 },
        'External service request failed. Retrying.',
      );
      await sleep(retryDelays[attempt]);
    }
  }

  return null;
};

export const externalReferenceService = {
  async getGenres(baseUrl, logger, redis) {
    if (redis) {
      const cached = await redis.get(REDIS_KEYS.externalGenres);
      if (cached !== null) return JSON.parse(cached);
    }

    const genres = await fetchWithRetry(`${baseUrl}/genres`, logger);
    if (redis) {
      await redis.set(REDIS_KEYS.externalGenres, JSON.stringify(genres), 'EX', CACHE_TTL_SECONDS);
    }
    return genres;
  },

  async getGenreByName(baseUrl, genreName, logger, redis) {
    try {
      const genres = await this.getGenres(baseUrl, logger, redis);
      return genres.find((genre) => genre.name.toLowerCase() === genreName.toLowerCase()) ?? null;
    } catch (error) {
      logger.warn(
        { err: error },
        'External genre service is unavailable. Returning degraded response.',
      );
      return null;
    }
  },
};
