export const REDIS_KEYS = {
  externalGenres: 'cache:external:genres',
  itemsV2: ({ page = 1, limit = 10, author = '' }) => `cache:items:v2:page=${page}:limit=${limit}:author=${author}`,
  itemsV2Pattern: 'cache:items:v2:*',
  refreshToken: (userId) => `auth:refresh:${userId}`,
  tokenBlacklist: (jti) => `auth:blacklist:${jti}`,
};
