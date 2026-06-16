const toApiBook = (row) => ({
  id: row.id,
  title: row.title,
  author: row.author,
  year: row.year,
  genre: row.genre,
  image: row.image,
});

const buildFilterSql = (author) => {
  if (!author) {
    return { sql: '', params: [] };
  }

  return { sql: 'WHERE LOWER(author) LIKE LOWER(?)', params: [`%${author}%`] };
};

export const createItemsRepository = (pool) => ({
  async findAll(author) {
    const filter = buildFilterSql(author);
    const [rows] = await pool.execute(`SELECT id, title, author, year, genre, image FROM books ${filter.sql} ORDER BY id`, filter.params);
    return rows.map(toApiBook);
  },

  async *streamAll(author) {
    const items = await this.findAll(author);
    for (const item of items) {
      yield item;
    }
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT id, title, author, year, genre, image FROM books WHERE id = ?', [id]);
    return rows[0] ? toApiBook(rows[0]) : null;
  },

  async create(data) {
    const [result] = await pool.execute(
      'INSERT INTO books (title, author, year, genre, image) VALUES (?, ?, ?, ?, ?)',
      [data.title, data.author, data.year, data.genre ?? 'Unknown', data.image ?? null],
    );
    return this.findById(result.insertId);
  },

  async patch(id, updates) {
    const current = await this.findById(id);
    if (!current) return null;

    const data = { ...current, ...updates, id: current.id };
    await pool.execute('UPDATE books SET title=?, author=?, year=?, genre=?, image=? WHERE id=?', [
      data.title,
      data.author,
      data.year,
      data.genre,
      data.image ?? null,
      id,
    ]);
    return this.findById(id);
  },

  async replace(id, data) {
    const current = await this.findById(id);
    if (!current) return null;

    await pool.execute('UPDATE books SET title=?, author=?, year=?, genre=?, image=? WHERE id=?', [
      data.title,
      data.author,
      data.year,
      data.genre ?? 'Unknown',
      current.image ?? null,
      id,
    ]);
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM books WHERE id=?', [id]);
    return result.affectedRows > 0;
  },

  async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM books');
    return rows[0].total;
  },

  async clear() {
    await pool.execute('DELETE FROM books');
  },
});
