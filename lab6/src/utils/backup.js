import fs from 'fs/promises';
import path from 'path';
import { BACKUPS_DIR, ITEMS_DIR } from './paths.js';
import { ensureDir } from './file.js';

const getTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

export const createStartupBackup = async (log = console) => {
  await ensureDir(ITEMS_DIR);
  await ensureDir(BACKUPS_DIR);

  const files = await fs.readdir(ITEMS_DIR);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    log.info('Backup skipped: data/items is empty');
    return;
  }

  const backupDir = path.join(BACKUPS_DIR, getTimestamp());
  await ensureDir(backupDir);

  await Promise.all(
    jsonFiles.map((file) => fs.copyFile(path.join(ITEMS_DIR, file), path.join(backupDir, file))),
  );

  const backups = (await fs.readdir(BACKUPS_DIR)).sort().reverse();
  const oldBackups = backups.slice(5);

  await Promise.all(
    oldBackups.map((folder) =>
      fs.rm(path.join(BACKUPS_DIR, folder), { recursive: true, force: true }),
    ),
  );

  log.info(`Backup created: ${backupDir}`);
};
