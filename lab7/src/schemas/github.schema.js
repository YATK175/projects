export const githubRepoQuerySchema = {
  type: 'object',
  properties: {
    repo: {
      type: 'string',
      minLength: 3,
      pattern: '^[^/]+/[^/]+$',
      description: 'Repository in owner/name format, for example fastify/fastify',
    },
  },
  required: ['repo'],
  additionalProperties: false,
};

export const sharedReposResponseSchema = {
  type: 'object',
  properties: {
    repo: { type: 'string' },
    implementation: { type: 'string' },
    analyzedContributors: { type: 'integer' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          repo: { type: 'string' },
          url: { type: 'string' },
          sharedContributors: { type: 'integer' },
          sampleContributors: { type: 'array', items: { type: 'string' } },
        },
        required: ['repo', 'url', 'sharedContributors', 'sampleContributors'],
        additionalProperties: false,
      },
    },
  },
  required: ['repo', 'implementation', 'analyzedContributors', 'results'],
  additionalProperties: false,
};
