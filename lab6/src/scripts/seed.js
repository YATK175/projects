import fs from 'fs/promises';
import { runMigration } from '#migrations/migrate';
import { ITEMS_DIR, getItemFilePath } from '#utils/paths';
import { ensureDir, writeJsonAtomic } from '#utils/file';

const initialBooks = [
  {
    id: 1,
    title: 'Kobzar',
    author: 'Shevchenko',
    year: 1840,
    genre: 'poetry',
    image: null,
  },
  {
    id: 2,
    title: 'Lisova Pisnia',
    author: 'Lesya Ukrainka',
    year: 1911,
    genre: 'drama',
    image: null,
  },
  {
    id: 3,
    title: 'Zahar Berkut',
    author: 'Ivan Franko',
    year: 1883,
    genre: 'historical novel',
    image: null,
  },
];

const seed = async () => {
  await fs.rm(ITEMS_DIR, { recursive: true, force: true });
  await ensureDir(ITEMS_DIR);

  for (const book of initialBooks) {
    await writeJsonAtomic(getItemFilePath(book.id), book);
  }

  await runMigration();
  console.log(`Seed completed. Created books: ${initialBooks.length}`);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
