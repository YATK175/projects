import fs from 'fs/promises';
import { DATA_DIR, ITEMS_DIR, VERSION_FILE } from '#utils/paths';
import { ensureDir, pathExists, writeJsonAtomic } from '#utils/file';

await ensureDir(DATA_DIR);
await ensureDir(ITEMS_DIR);

if (!(await pathExists(VERSION_FILE))) {
  await writeJsonAtomic(VERSION_FILE, {
    storage: 'file-json',
    version: 1,
    migratedAt: new Date().toISOString(),
  });
}

try {
  await fs.access(ITEMS_DIR);
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

console.log(
  'Migration completed for local JSON storage. MySQL is not required in this fixed build.',
);
