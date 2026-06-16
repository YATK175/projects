export const backupParamsSchema = {
  type: 'object',
  properties: {
    timestamp: { type: 'string', minLength: 1 },
  },
  required: ['timestamp'],
  additionalProperties: false,
};
