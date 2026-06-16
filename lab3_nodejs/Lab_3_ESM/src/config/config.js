import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import configSchema from '#validators/config.schema';
import validateData from '#validators/validate';

function loadEnvFile(path = '.env') {
  const fullPath = resolve(process.cwd(), path);

  if (!existsSync(fullPath)) {
    return {};
  }

  return readFileSync(fullPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');

      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

const env = {
  ...process.env,
  ...loadEnvFile(),
};

const config = {
  HOSTNAME: env.HOSTNAME,
  PORT: Number(env.PORT),
  NODE_ENV: env.NODE_ENV,
};

const validationError = validateData(configSchema, config);

if (validationError) {
  console.error(`Configuration error: ${validationError}`);
  process.exit(1);
}

export default config;
