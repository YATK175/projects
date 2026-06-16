export const publicHealthResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
  },
  required: ['status'],
  additionalProperties: false,
};

export const healthDetailsResponseSchema = {
  type: 'object',
  properties: {
    pid: { type: 'integer' },
    nodeVersion: { type: 'string' },
    platform: { type: 'string' },
    uptime: { type: 'number' },
    memoryUsage: {
      type: 'object',
      properties: {
        rss: { type: 'integer' },
        heapTotal: { type: 'integer' },
        heapUsed: { type: 'integer' },
        external: { type: 'integer' },
        arrayBuffers: { type: 'integer' },
      },
      required: ['rss', 'heapTotal', 'heapUsed', 'external', 'arrayBuffers'],
      additionalProperties: false,
    },
  },
  required: ['pid', 'nodeVersion', 'platform', 'uptime', 'memoryUsage'],
  additionalProperties: false,
};
