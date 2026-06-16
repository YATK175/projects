import fp from 'fastify-plugin';
import { books, users } from './schema.js';
import { createItemsRepository } from '#repositories/items.repository';
import { USERS_FILE } from '#utils/paths';
import { pathExists, writeJsonAtomic } from '#utils/file';

const createLocalDrizzleFacade = () => {
  const itemsRepository = createItemsRepository();

  return {
    async delete(table) {
      if (table === books) {
        await itemsRepository.clear();
        return;
      }

      if (table === users) {
        await writeJsonAtomic(USERS_FILE, []);
      }
    },
  };
};

async function databasePluginImpl(fastify) {
  if (!(await pathExists(USERS_FILE))) {
    await writeJsonAtomic(USERS_FILE, []);
  }

  const localDrizzle = createLocalDrizzleFacade();
  fastify.decorate('dbMode', 'file-json');
  fastify.decorate('db', localDrizzle);
  fastify.decorate('drizzle', localDrizzle);
  fastify.log.info(
    'Database plugin started in file-json fallback mode. MySQL and Docker are not required.',
  );
}

export const databasePlugin = fp(databasePluginImpl, { name: 'database-plugin' });
