const configSchema = {
  type: 'object',
  required: ['HOSTNAME', 'PORT', 'NODE_ENV'],
  additionalProperties: true,
  properties: {
    HOSTNAME: {
      type: 'string',
      minLength: 1,
    },
    PORT: {
      type: 'integer',
      minimum: 1,
      maximum: 65535,
    },
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'production'],
    },
  },
};

module.exports = configSchema;
