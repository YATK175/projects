import fs from 'fs/promises';
import path from 'path';
import { getItemFilePath, ITEMS_DIR } from '#utils/paths';
import { ensureDir, readJsonFile, writeJsonAtomic } from '#utils/file';

const normalizeId = (id) => Number(id);

const toApiBook = (book) => ({
  id: Number(book.id),
  title: book.title,
  author: book.author,
  year: Number(book.year),
  genre: book.genre ?? 'Unknown',
  image: book.image ?? null,
});

const readAllBooks = async () => {
  await ensureDir(ITEMS_DIR);
  const files = await fs.readdir(ITEMS_DIR);
  const jsonFiles = files
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));
  const books = [];

  for (const file of jsonFiles) {
    try {
      const book = await readJsonFile(path.join(ITEMS_DIR, file));
      books.push(toApiBook(book));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  return books.sort((a, b) => a.id - b.id);
};

const getNextId = (books) => books.reduce((max, book) => Math.max(max, Number(book.id)), 0) + 1;

const writeBook = async (book) => {
  const now = new Date().toISOString();
  const normalized = {
    ...book,
    id: Number(book.id),
    year: Number(book.year),
    genre: book.genre ?? 'Unknown',
    image: book.image ?? null,
    createdAt: book.createdAt ?? now,
    updatedAt: now,
  };

  await writeJsonAtomic(getItemFilePath(normalized.id), normalized);
  return toApiBook(normalized);
};

export const createItemsRepository = () => ({
  async findAll(author) {
    const books = await readAllBooks();

    if (!author) return books;

    const normalizedAuthor = String(author).toLowerCase();
    return books.filter((book) => book.author.toLowerCase().includes(normalizedAuthor));
  },

  async *streamAll(author) {
    const rows = await this.findAll(author);

    for (const row of rows) {
      yield row;
    }
  },

  async findById(id) {
    try {
      const book = await readJsonFile(getItemFilePath(normalizeId(id)));
      return toApiBook(book);
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  },

  async create(data) {
    const books = await readAllBooks();
    const id = getNextId(books);

    return writeBook({
      id,
      title: data.title,
      author: data.author,
      year: Number(data.year),
      genre: data.genre ?? 'Unknown',
      image: data.image ?? null,
    });
  },

  async patch(id, updates) {
    const current = await this.findById(id);
    if (!current) return null;

    return writeBook({
      ...current,
      ...updates,
      id: current.id,
      year: updates.year === undefined ? current.year : Number(updates.year),
    });
  },

  async replace(id, data) {
    const current = await this.findById(id);
    if (!current) return null;

    return writeBook({
      id: current.id,
      title: data.title,
      author: data.author,
      year: Number(data.year),
      genre: data.genre ?? 'Unknown',
      image: current.image ?? null,
      createdAt: current.createdAt,
    });
  },

  async delete(id) {
    const current = await this.findById(id);
    if (!current) return false;

    await fs.rm(getItemFilePath(normalizeId(id)), { force: true });
    return true;
  },

  async count() {
    const books = await readAllBooks();
    return books.length;
  },

  async clear() {
    await ensureDir(ITEMS_DIR);
    const files = await fs.readdir(ITEMS_DIR);
    await Promise.all(
      files
        .filter((file) => file.endsWith('.json'))
        .map((file) => fs.rm(path.join(ITEMS_DIR, file), { force: true })),
    );
  },
});
