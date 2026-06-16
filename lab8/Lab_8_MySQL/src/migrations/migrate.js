import crypto from 'crypto';
import fs from 'fs/promises';
import { ItemModel } from '#models/item.model';
import { ITEMS_DIR, VERSION_FILE, getItemFilePath } from '#utils/paths';
import { ensureDir, readJsonFile, writeJsonAtomic } from '#utils/file';

export const getModelHash = () => crypto.createHash('md5').update(JSON.stringify(ItemModel)).digest('hex');

const readSavedVersion = async () => {
  try {
    return await readJsonFile(VERSION_FILE);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

export const isMigrationNeeded = async () => {
  const savedVersion = await readSavedVersion();
  return savedVersion?.modelHash !== getModelHash();
};

export const runMigration = async (log = console) => {
  await ensureDir(ITEMS_DIR);
  const modelHash = getModelHash();
  const savedVersion = await readSavedVersion();

  if (savedVersion?.modelHash === modelHash) {
    log.info('Migration skipped: model hash is unchanged');
    return { migrated: false, updated: 0 };
  }

  const files = (await fs.readdir(ITEMS_DIR)).filter((file) => file.endsWith('.json'));
  let updated = 0;

  for (const file of files) {
    const id = Number(file.replace('.json', ''));
    const current = await readJsonFile(getItemFilePath(id));
    const migrated = {
      ...ItemModel,
      ...current,
    };

    await writeJsonAtomic(getItemFilePath(id), migrated);
    updated += 1;
  }

  await writeJsonAtomic(VERSION_FILE, {
    modelHash,
    migratedAt: new Date().toISOString(),
  });

  log.info(`Migration completed. Updated files: ${updated}`);
  return { migrated: true, updated };
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
