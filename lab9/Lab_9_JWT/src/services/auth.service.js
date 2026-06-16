import argon2 from 'argon2';
import path from 'path';
import { USERS_FILE } from '#utils/paths';
import { ensureDir, pathExists, readJsonFile, writeJsonAtomic } from '#utils/file';

const publicUser = (user) => (user ? { id: Number(user.id), email: user.email } : null);

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const readUsers = async () => {
  await ensureDir(path.dirname(USERS_FILE));

  if (!(await pathExists(USERS_FILE))) {
    await writeJsonAtomic(USERS_FILE, []);
    return [];
  }

  const users = await readJsonFile(USERS_FILE);
  return Array.isArray(users) ? users : [];
};

const writeUsers = async (users) => {
  await writeJsonAtomic(USERS_FILE, users);
};

const nextId = (users) => users.reduce((max, user) => Math.max(max, Number(user.id)), 0) + 1;

export const createAuthService = () => ({
  async findByEmail(email) {
    const users = await readUsers();
    return users.find((user) => user.email === normalizeEmail(email)) ?? null;
  },

  async findById(id) {
    const users = await readUsers();
    const user = users.find((item) => Number(item.id) === Number(id));
    return publicUser(user);
  },

  async register({ email, password }) {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);
    const existing = users.find((user) => user.email === normalizedEmail);

    if (existing) {
      return null;
    }

    const user = {
      id: nextId(users),
      email: normalizedEmail,
      password: await argon2.hash(password),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);
    return publicUser(user);
  },

  async verifyCredentials({ email, password }) {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return null;
    }

    return publicUser(user);
  },
});
