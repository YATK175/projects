import path from 'path';
import { CACHE_DIR } from '#utils/paths';
import { ensureDir, readJsonFile, writeJsonAtomic } from '#utils/file';

const CACHE_TTL_MS = 120 * 1000;
const CACHE_FILE = path.join(CACHE_DIR, 'reference.json');

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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retryDelays.length) {
        throw error;
      }

      logger.warn(
        { err: error, attempt: attempt + 1 },
        'External service request failed. Retrying.',
      );
      await sleep(retryDelays[attempt]);
    }
  }

  return null;
};

const readActiveCache = async () => {
  try {
    const cache = await readJsonFile(CACHE_FILE);

    if (Date.now() - cache.createdAt <= CACHE_TTL_MS) {
      return cache.data;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  return null;
};

const saveCache = async (data) => {
  await ensureDir(CACHE_DIR);
  await writeJsonAtomic(CACHE_FILE, {
    createdAt: Date.now(),
    ttlMs: CACHE_TTL_MS,
    data,
  });
};

export const externalReferenceService = {
  async getGenres(baseUrl, logger) {
    const cached = await readActiveCache();

    if (cached) {
      return cached;
    }

    const genres = await fetchWithRetry(`${baseUrl}/genres`, logger);
    await saveCache(genres);
    return genres;
  },

  async getGenreByName(baseUrl, genreName, logger) {
    try {
      const genres = await this.getGenres(baseUrl, logger);
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
