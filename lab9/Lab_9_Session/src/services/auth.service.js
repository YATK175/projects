import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { users } from '#db/schema';

const publicUser = (user) => (user ? { id: user.id, email: user.email } : null);

export const createAuthService = ({ db }) => ({
  async findByEmail(email) {
    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return rows[0] ?? null;
  },

  async findById(id) {
    const rows = await db.select().from(users).where(eq(users.id, Number(id))).limit(1);
    return publicUser(rows[0]);
  },

  async register({ email, password }) {
    const existing = await this.findByEmail(email);
    if (existing) return null;

    const hash = await argon2.hash(password);
    const result = await db.insert(users).values({ email, password: hash });
    const id = result[0]?.insertId;
    return { id, email };
  },

  async verifyCredentials({ email, password }) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) return null;

    return publicUser(user);
  },
});
