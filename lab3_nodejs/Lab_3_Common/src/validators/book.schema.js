const currentYear = new Date().getFullYear();

const bookCreateSchema = {
  type: 'object',
  required: ['title', 'author', 'year'],
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      minLength: 1,
    },
    author: {
      type: 'string',
      minLength: 1,
    },
    year: {
      type: 'integer',
      minimum: 1,
      maximum: currentYear,
    },
  },
};

const bookPatchSchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      minLength: 1,
    },
    author: {
      type: 'string',
      minLength: 1,
    },
    year: {
      type: 'integer',
      minimum: 1,
      maximum: currentYear,
    },
  },
};

module.exports = {
  bookCreateSchema,
  bookPatchSchema,
};
