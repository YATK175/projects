import mongoose from 'mongoose';
import { initialBooks } from './initial-books.js';
import { Book } from '../db/models/book.model.js';

const force = process.argv.includes('--force');
const mongoUrl = process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGO_DB_NAME ?? 'books_lab8';

await mongoose.connect(mongoUrl, { dbName });

if (force) {
  await Book.deleteMany({});
}

const count = await Book.countDocuments();
if (count === 0) {
  await Book.insertMany(initialBooks);
  console.log(`Seeded ${initialBooks.length} books to MongoDB`);
} else {
  console.log(`MongoDB already contains ${count} books. Use npm run seed:force to reseed.`);
}

await mongoose.connection.close();
