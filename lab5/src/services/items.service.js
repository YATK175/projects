import { createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { itemsRepository } from '#repositories/items.repository';
import { getUploadDirById } from '#utils/paths';
import { ensureDir } from '#utils/file';
import { validateImportItem } from '#utils/validation';

export const itemsService = {
  async getItems(author) {
    const items = await itemsRepository.findAll(author);

    return {
      count: items.length,
      items,
    };
  },

  async getBookById(id) {
    return itemsRepository.findById(id);
  },

  async createBook(data) {
    return itemsRepository.create(data);
  },

  async updateBook(id, updates) {
    return itemsRepository.patch(id, updates);
  },

  async replaceBook(id, data) {
    return itemsRepository.replace(id, data);
  },

  async deleteBook(id) {
    return itemsRepository.delete(id);
  },

  async exportCsv(items) {
    return stringify(items, {
      header: true,
      columns: ['id', 'title', 'author', 'year', 'genre', 'image'],
    });
  },

  parseImportFile(file) {
    const content = file.buffer.toString('utf8');
    const filename = file.filename.toLowerCase();

    if (file.mimetype === 'application/json' || filename.endsWith('.json')) {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [data];
    }

    if (file.mimetype === 'text/csv' || filename.endsWith('.csv')) {
      return parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    }

    return null;
  },

  async importItems(records) {
    const rejected = [];
    let imported = 0;

    for (const [index, record] of records.entries()) {
      const validation = validateImportItem(record);

      if (!validation.valid) {
        rejected.push({ row: index + 1, reason: validation.errors.join('; ') });
        continue;
      }

      await itemsRepository.create(validation.data);
      imported += 1;
    }

    return {
      imported,
      rejectedCount: rejected.length,
      rejected,
    };
  },

  async saveImage(id, data) {
    const item = await itemsRepository.findById(id);

    if (!item) {
      return null;
    }

    const ext = data.mimetype === 'image/png' ? '.png' : '.jpg';
    const fileName = `image${ext}`;
    const uploadDir = getUploadDirById(id);
    const filePath = path.join(uploadDir, fileName);

    await ensureDir(uploadDir);
    await pipeline(data.file, createWriteStream(filePath));

    return itemsRepository.patch(id, {
      image: `/${id}/${fileName}`,
    });
  },
};
