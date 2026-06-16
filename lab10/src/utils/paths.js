import path from 'path';

export const ROOT_DIR = process.cwd();
export const DATA_DIR = path.join(ROOT_DIR, 'data');
export const ITEMS_DIR = path.join(DATA_DIR, 'items');
export const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
export const CACHE_DIR = path.join(DATA_DIR, 'cache');
export const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
export const VERSION_FILE = path.join(DATA_DIR, 'version.json');
export const USERS_FILE = path.join(DATA_DIR, 'users.json');

export const getItemFilePath = (id) => path.join(ITEMS_DIR, `${id}.json`);
export const getUploadDirById = (id) => path.join(UPLOADS_DIR, String(id));
