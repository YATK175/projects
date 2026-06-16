import { desc, eq, like } from 'drizzle-orm';
import { books } from '#db/schema';

const toApiBook = (row) => ({
  id: row.id,
  title: row.title,
  author: row.author,
  year: row.year,
  genre: row.genre,
  image: row.image,
});

export const createItemsRepository = (db) => ({
  async findAll(author) {
    const query = db.select().from(books).orderBy(desc(books.id));
    const rows = author ? await query.where(like(books.author, `%${author}%`)) : await query;
    return rows.map(toApiBook).reverse();
  },

  async *streamAll(author) {
    const rows = await this.findAll(author);
    for (const row of rows) {
      yield row;
    }
  },

  async findById(id) {
    const rows = await db.select().from(books).where(eq(books.id, Number(id))).limit(1);
    return rows[0] ? toApiBook(rows[0]) : null;
  },

  async create(data) {
    const result = await db.insert(books).values({
      title: data.title,
      author: data.author,
      year: data.year,
      genre: data.genre ?? 'Unknown',
      image: data.image ?? null,
    });
    const id = result[0]?.insertId;
    return this.findById(id);
  },

  async patch(id, updates) {
    const current = await this.findById(id);
    if (!current) return null;

    await db.update(books).set(updates).where(eq(books.id, Number(id)));
    return this.findById(id);
  },

  async replace(id, data) {
    const current = await this.findById(id);
    if (!current) return null;

    await db
      .update(books)
      .set({
        title: data.title,
        author: data.author,
        year: data.year,
        genre: data.genre ?? 'Unknown',
        image: current.image ?? null,
      })
      .where(eq(books.id, Number(id)));

    return this.findById(id);
  },

  async delete(id) {
    const current = await this.findById(id);
    if (!current) return false;

    await db.delete(books).where(eq(books.id, Number(id)));
    return true;
  },

  async count() {
    const rows = await db.select().from(books);
    return rows.length;
  },

  async clear() {
    await db.delete(books);
  },
});
