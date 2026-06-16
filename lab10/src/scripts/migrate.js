import { BACKUPS_DIR, DATA_DIR, ITEMS_DIR, USERS_FILE, VERSION_FILE } from '#utils/paths';
import { ensureDir, pathExists, writeJsonAtomic } from '#utils/file';

await ensureDir(DATA_DIR);
await ensureDir(ITEMS_DIR);
await ensureDir(BACKUPS_DIR);

if (!(await pathExists(USERS_FILE))) {
  await writeJsonAtomic(USERS_FILE, []);
}

if (!(await pathExists(VERSION_FILE))) {
  await writeJsonAtomic(VERSION_FILE, {
    storage: 'file-json',
    auth: 'jwt-local-json-users',
    tests: 'vitest-local-mode',
    version: 1,
    migratedAt: new Date().toISOString(),
  });
}

console.log(
  'Migration completed for local JSON storage. MySQL, Redis and Docker are not required in this fixed build.',
);
