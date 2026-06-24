import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],

    // JSON-файли використовуються спільно, тому тести виконуються послідовно
    fileParallelism: false,
    maxWorkers: 1,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],

      // Не враховуємо точки запуску, міграції та необов’язкові
      // зовнішні інтеграції, які не використовуються у fallback-режимі.
      exclude: [
        'drizzle.config.js',
        'src/server.js',
        'src/constants/http.js',
        'src/models/**',
        'src/scripts/**',

        'src/db/mysql.js',
        'src/db/drizzle.js',
        'src/db/init.js',

        'src/controllers/backups.controller.js',
        'src/controllers/github.controller.js',

        'src/routes/backups.routes.js',
        'src/routes/github.routes.js',
        'src/routes/websocket.routes.js',

        'src/services/external-reference.service.js',
        'src/services/github.service.js',

        'src/transforms/**',

        'src/utils/backup.js',
        'src/utils/graceful-shutdown.js',
      ],

      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
