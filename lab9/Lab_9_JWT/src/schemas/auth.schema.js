export const authRegisterBodySchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  additionalProperties: false,
};

export const authLoginBodySchema = authRegisterBodySchema;

export const authUserSchema = {
  $id: 'AuthUser',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    email: { type: 'string' },
  },
};

export const authRegisterResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    user: { $ref: 'AuthUser#' },
  },
};

export const authLoginResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    accessToken: { type: 'string' },
    user: { $ref: 'AuthUser#' },
  },
};
