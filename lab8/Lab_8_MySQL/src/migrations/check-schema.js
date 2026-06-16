import crypto from 'crypto';
import fs from 'fs/promises';
import mysql from 'mysql2/promise';

const schemaSql = await fs.readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const hash = crypto.createHash('md5').update(schemaSql).digest('hex');

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'password',
  database: process.env.MYSQL_DB ?? 'books_lab8',
  multipleStatements: true,
});

await connection.query(await fs.readFile(new URL('../db/schema.sql', import.meta.url), 'utf8'));
const [rows] = await connection.execute('SELECT hash FROM migrations ORDER BY id DESC LIMIT 1');

if (rows.length === 0 || rows[0].hash !== hash) {
  await connection.execute('INSERT INTO migrations (hash) VALUES (?)', [hash]);
  console.warn('Schema hash changed. Migration record was updated.');
} else {
  console.log('Schema hash is actual. Migration is not needed.');
}

await connection.end();
