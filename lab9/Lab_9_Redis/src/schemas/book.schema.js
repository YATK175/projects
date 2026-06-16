const currentYear = new Date().getFullYear();

const idSchema = {
  anyOf: [
    { type: 'integer', minimum: 1 },
    { type: 'string', minLength: 1 },
  ],
};

const nullableString = {
  anyOf: [{ type: 'string' }, { type: 'null' }],
};

const nullableGenreDetails = {
  anyOf: [
    {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        ageRating: { type: 'integer' },
      },
      required: ['id', 'name', 'ageRating'],
      additionalProperties: true,
    },
    { type: 'null' },
  ],
};

const bookProperties = {
  id: idSchema,
  title: { type: 'string', minLength: 1 },
  author: { type: 'string', minLength: 1 },
  year: { type: 'integer', minimum: 1, maximum: currentYear },
  genre: { type: 'string', minLength: 1 },
  image: nullableString,
};

export const bookSchema = {
  $id: 'Book',
  type: 'object',
  properties: bookProperties,
  required: ['id', 'title', 'author', 'year', 'genre', 'image'],
  additionalProperties: false,
};

export const bookDetailsSchema = {
  $id: 'BookDetails',
  type: 'object',
  properties: {
    ...bookProperties,
    genreDetails: nullableGenreDetails,
  },
  required: ['id', 'title', 'author', 'year', 'genre', 'image', 'genreDetails'],
  additionalProperties: false,
};

export const bookCreateBodySchema = {
  type: 'object',
  properties: {
    title: bookProperties.title,
    author: bookProperties.author,
    year: bookProperties.year,
    genre: bookProperties.genre,
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
    genre: bookProperties.genre,
  },
  minProperties: 1,
  additionalProperties: false,
};

export const bookParamsSchema = {
  type: 'object',
  properties: {
    id: idSchema,
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

export const exportQuerySchema = {
  type: 'object',
  properties: {
    author: { type: 'string', minLength: 1 },
    transform: { anyOf: [{ type: 'boolean' }, { type: 'string', enum: ['true', 'false'] }] },
  },
  additionalProperties: false,
};

export const paginationQuerySchema = {
  type: 'object',
  properties: {
    author: { type: 'string', minLength: 1 },
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  },
  additionalProperties: false,
};

export const booksListResponseSchema = {
  type: 'object',
  properties: {
    count: { type: 'integer' },
    items: { type: 'array', items: { $ref: 'Book#' } },
  },
  required: ['count', 'items'],
  additionalProperties: false,
};

export const paginatedBooksResponseSchema = {
  type: 'object',
  properties: {
    data: { type: 'array', items: { $ref: 'Book#' } },
    meta: {
      type: 'object',
      properties: {
        total: { type: 'integer' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        totalPages: { type: 'integer' },
      },
      required: ['total', 'page', 'limit', 'totalPages'],
      additionalProperties: false,
    },
  },
  required: ['data', 'meta'],
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

export const importResponseSchema = {
  type: 'object',
  properties: {
    imported: { type: 'integer' },
    rejectedCount: { type: 'integer' },
    rejected: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          row: { type: 'integer' },
          reason: { type: 'string' },
        },
        required: ['row', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['imported', 'rejectedCount', 'rejected'],
  additionalProperties: false,
};

export const uploadImageResponseSchema = bookActionResponseSchema;
