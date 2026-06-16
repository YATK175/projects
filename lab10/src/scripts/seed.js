import { createItemsRepository } from '#repositories/items.repository';
import { initialBooks } from './initial-books.js';

const force = process.argv.includes('--force');
const repository = createItemsRepository();

if (force) {
  await repository.clear();
}

const currentCount = await repository.count();

if (currentCount === 0) {
  for (const book of initialBooks) {
    await repository.create(book);
  }

  console.log(`Seeded ${initialBooks.length} books to local JSON storage`);
} else {
  console.log(
    `Local storage already contains ${currentCount} books. Use npm run seed:force to reseed.`,
  );
}
