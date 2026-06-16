import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import { BACKUPS_DIR, ITEMS_DIR } from './paths.js';
import { ensureDir } from './file.js';

const getTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const createItemsReadable = async function* (files) {
  for (const file of files) {
    const content = await fs.readFile(path.join(ITEMS_DIR, file), 'utf8');
    yield `${content.trim()}
`;
  }
};

export const createStartupBackup = async (log = console) => {
  await ensureDir(ITEMS_DIR);
  await ensureDir(BACKUPS_DIR);

  const files = await fs.readdir(ITEMS_DIR);
  const jsonFiles = files.filter((file) => file.endsWith('.json')).sort();

  if (jsonFiles.length === 0) {
    log.info('Gzip backup skipped: data/items is empty');
    return;
  }

  const timestamp = getTimestamp();
  const backupPath = path.join(BACKUPS_DIR, `${timestamp}.gz`);

  await pipeline(
    Readable.from(createItemsReadable(jsonFiles)),
    createGzip(),
    createWriteStream(backupPath),
  );

  const backups = (await fs.readdir(BACKUPS_DIR))
    .filter((file) => file.endsWith('.gz'))
    .sort()
    .reverse();
  const oldBackups = backups.slice(5);

  await Promise.all(oldBackups.map((file) => fs.rm(path.join(BACKUPS_DIR, file), { force: true })));

  log.info(`Gzip backup created: ${backupPath}`);
};

export const getBackupFilePath = async (timestamp) => {
  const normalized = timestamp.endsWith('.gz') ? timestamp : `${timestamp}.gz`;

  if (!/^[0-9TZA-Za-z._-]+\.gz$/.test(normalized)) {
    return null;
  }

  const backupPath = path.join(BACKUPS_DIR, normalized);

  try {
    await fs.access(backupPath);
    return backupPath;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};
