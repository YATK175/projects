import fs from 'fs';
import path from 'path';

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=');
      acc[key.trim()] = valueParts.join('=').trim();
      return acc;
    }, {});
};

export const loadEnvConfig = async () => {
  const envPath = path.join(process.cwd(), '.env');
  const env = parseEnvFile(envPath);

  return {
    NODE_ENV: env.NODE_ENV || 'development',
  };
};
