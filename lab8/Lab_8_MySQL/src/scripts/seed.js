import mysql from 'mysql2/promise';
import { initialBooks } from './initial-books.js';

const force = process.argv.includes('--force');
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'password',
  database: process.env.MYSQL_DB ?? 'books_lab8',
});

if (force) {
  await pool.execute('DELETE FROM books');
}

const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM books');
if (total === 0) {
  for (const book of initialBooks) {
    await pool.execute('INSERT INTO books (title, author, year, genre, image) VALUES (?, ?, ?, ?, ?)', [
      book.title,
      book.author,
      book.year,
      book.genre,
      book.image,
    ]);
  }
  console.log(`Seeded ${initialBooks.length} books to MySQL`);
} else {
  console.log(`MySQL already contains ${total} books. Use npm run seed:force to reseed.`);
}

await pool.end();
