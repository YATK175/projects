import { DATA_DIR, ITEMS_DIR, USERS_FILE, VERSION_FILE } from '#utils/paths';
import { ensureDir, pathExists, writeJsonAtomic } from '#utils/file';

await ensureDir(DATA_DIR);
await ensureDir(ITEMS_DIR);

if (!(await pathExists(USERS_FILE))) {
  await writeJsonAtomic(USERS_FILE, []);
}

if (!(await pathExists(VERSION_FILE))) {
  await writeJsonAtomic(VERSION_FILE, {
    storage: 'file-json',
    auth: 'jwt-local-json-users',
    version: 1,
    migratedAt: new Date().toISOString(),
  });
}

console.log(
  'Migration completed for local JSON storage. MySQL and Redis are not required in this fixed build.',
);
