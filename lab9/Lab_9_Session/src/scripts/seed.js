import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { initialBooks } from './initial-books.js';
import { books } from '../db/schema.js';

const force = process.argv.includes('--force');
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'password',
  database: process.env.MYSQL_DB ?? 'books_lab8',
});
const db = drizzle(pool, { mode: 'default' });

if (force) {
  await db.delete(books);
}

const current = await db.select().from(books);
if (current.length === 0) {
  await db.insert(books).values(initialBooks);
  console.log(`Seeded ${initialBooks.length} books with Drizzle`);
} else {
  console.log(`Database already contains ${current.length} books. Use npm run seed:force to reseed.`);
}

await pool.end();
