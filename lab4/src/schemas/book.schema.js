const bookProperties = {
  id: { type: 'integer', minimum: 1 },
  title: { type: 'string', minLength: 1 },
  author: { type: 'string', minLength: 1 },
  year: { type: 'integer', minimum: 1, maximum: new Date().getFullYear() },
};

export const bookSchema = {
  $id: 'Book',
  type: 'object',
  properties: bookProperties,
  required: ['id', 'title', 'author', 'year'],
  additionalProperties: false,
};

export const bookCreateBodySchema = {
  type: 'object',
  properties: {
    title: bookProperties.title,
    author: bookProperties.author,
    year: bookProperties.year,
  },
  required: ['title', 'author', 'year'],
  additionalProperties: false,
};

export const bookPatchBodySchema = {
  type: 'object',
  properties: {
    title: bookProperties.title,
    author: bookProperties.author,
    year: bookProperties.year,
  },
  minProperties: 1,
  additionalProperties: false,
};

export const bookParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
  },
  required: ['id'],
  additionalProperties: false,
};

export const bookQuerySchema = {
  type: 'object',
  properties: {
    author: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
};

export const booksListResponseSchema = {
  type: 'object',
  properties: {
    count: { type: 'integer' },
    items: {
      type: 'array',
      items: { $ref: 'Book#' },
    },
  },
  required: ['count', 'items'],
  additionalProperties: false,
};

export const bookActionResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    book: { $ref: 'Book#' },
  },
  required: ['message', 'book'],
  additionalProperties: false,
};

export const deleteResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
};
