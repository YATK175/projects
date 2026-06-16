import fs from 'fs/promises';
import path from 'path';
import { ItemModel } from '#models/item.model';
import { getItemFilePath, ITEMS_DIR } from '#utils/paths';
import { ensureDir, readJsonFile, writeJsonAtomic } from '#utils/file';

const normalizeBook = (data) => ({
  ...ItemModel,
  ...data,
  title: data.title?.trim?.() ?? ItemModel.title,
  author: data.author?.trim?.() ?? ItemModel.author,
  genre: data.genre?.trim?.() ?? ItemModel.genre,
  image: data.image ?? ItemModel.image,
});

const readAllFiles = async () => {
  await ensureDir(ITEMS_DIR);
  const files = await fs.readdir(ITEMS_DIR);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  const items = await Promise.all(
    jsonFiles.map(async (file) => readJsonFile(path.join(ITEMS_DIR, file))),
  );

  return items.sort((a, b) => a.id - b.id);
};

const getNextId = async () => {
  const items = await readAllFiles();
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
};

export const itemsRepository = {
  async findAll(author) {
    const items = await readAllFiles();

    if (!author) {
      return items;
    }

    return items.filter((item) => item.author.toLowerCase().includes(author.toLowerCase()));
  },

  async findById(id) {
    try {
      return await readJsonFile(getItemFilePath(id));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  },

  async create(data) {
    const id = await getNextId();
    const item = normalizeBook({ ...data, id });
    await writeJsonAtomic(getItemFilePath(id), item);
    return item;
  },

  async patch(id, updates) {
    const item = await this.findById(id);

    if (!item) {
      return null;
    }

    const updatedItem = normalizeBook({ ...item, ...updates, id: item.id });
    await writeJsonAtomic(getItemFilePath(id), updatedItem);
    return updatedItem;
  },

  async replace(id, data) {
    const item = await this.findById(id);

    if (!item) {
      return null;
    }

    const replacedItem = normalizeBook({ ...data, id, image: item.image });
    await writeJsonAtomic(getItemFilePath(id), replacedItem);
    return replacedItem;
  },

  async delete(id) {
    try {
      await fs.unlink(getItemFilePath(id));
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  },
};
