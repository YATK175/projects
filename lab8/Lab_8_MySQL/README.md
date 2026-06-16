# Lab_8_MySQL - Laboratory work 8, variant 3 Books

This folder represents a separate Git branch implementation for Lab 8. Data is stored in a database instead of files. Controllers, services, routes and API contracts are preserved from previous labs, while repositories now receive DB dependencies through Fastify decorators and dependency injection.


## API endpoints
- GET /api/v1/items
- GET /api/v1/items/:id
- POST /api/v1/items
- PATCH /api/v1/items/:id
- PUT /api/v1/items/:id
- DELETE /api/v1/items/:id
- GET /api/v2/items?page=1&limit=10
- GET /api/v1/items/export?transform=true
- GET /api/v1/items/stream
- POST /api/v1/items/import
- POST /api/v1/items/:id/image
- GET /api/v1/items/:id/details
- GET /api/v1/github/shared-repos?repo=fastify/fastify
- GET /api/v2/github/shared-repos?repo=fastify/fastify
- GET /docs

