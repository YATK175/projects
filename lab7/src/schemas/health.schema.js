export const healthResponseSchema = {
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
      additionalProperties: { type: 'number' },
    },
  },
  required: ['pid', 'nodeVersion', 'platform', 'uptime', 'memoryUsage'],
  additionalProperties: false,
};
