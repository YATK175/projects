import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Book Catalog API',
        description: 'Laboratory work 6. REST API, fetch, rate limiting and Swagger documentation.',
        version: '1.0.0',
      },
      tags: [
        { name: 'health', description: 'Health endpoints' },
        { name: 'items', description: 'Book catalog endpoints' },
        { name: 'github', description: 'GitHub analytics endpoints' },
      ],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
});
