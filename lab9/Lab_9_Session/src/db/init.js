import fs from 'fs/promises';
import mysql from 'mysql2/promise';

const sql = await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf8');
const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'password',
  database: process.env.MYSQL_DB ?? 'books_lab8',
  multipleStatements: true,
});

await connection.query(sql);
await connection.end();
console.log('MySQL schema initialized');
