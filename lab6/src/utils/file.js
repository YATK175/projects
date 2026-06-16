import fs from 'fs/promises';
import path from 'path';

export const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

export const pathExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const readJsonFile = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
};

export const writeJsonAtomic = async (filePath, data) => {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, '.json');
  const tmp = path.join(dir, `${base}.tmp.json`);

  try {
    await ensureDir(dir);
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, filePath);
  } catch (error) {
    try {
      await fs.unlink(tmp);
    } catch (unlinkError) {
      if (unlinkError.code !== 'ENOENT') {
        console.error('Failed to cleanup temporary file:', unlinkError);
      }
    }
    throw error;
  }
};
