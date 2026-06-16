const envSchema = {
  type: 'object',
  required: [
    'HOSTNAME',
    'PORT',
    'NODE_ENV',
    'ADMIN_API_KEY',
    'PRODUCTION_CORS_ORIGIN',
    'EXTERNAL_API_URL',
    'MONGO_URL',
    'MONGO_DB_NAME',
  ],
  properties: {
    HOSTNAME: { type: 'string', minLength: 1 },
    PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    NODE_ENV: { type: 'string', enum: ['development', 'production'] },
    ADMIN_API_KEY: { type: 'string', minLength: 8 },
    PRODUCTION_CORS_ORIGIN: { type: 'string', minLength: 1 },
    EXTERNAL_API_URL: { type: 'string', minLength: 1 },
    MONGO_URL: { type: 'string', minLength: 1 },
    MONGO_DB_NAME: { type: 'string', minLength: 1 },
  },
  additionalProperties: true,
};

export { envSchema };
