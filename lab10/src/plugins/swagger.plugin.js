import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Book Catalog API',
        description:
          'Laboratory work 10. Vitest tests and Docker-ready Fastify API with local JSON fallback.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'health', description: 'Health endpoints' },
        { name: 'items', description: 'Book catalog endpoints' },
        { name: 'auth', description: 'JWT authentication endpoints' },
        { name: 'github', description: 'GitHub analytics endpoints' },
        { name: 'backups', description: 'Backup endpoints' },
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
