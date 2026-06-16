const idParamsSchema = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'integer',
      minimum: 1,
    },
  },
};

export { idParamsSchema };
