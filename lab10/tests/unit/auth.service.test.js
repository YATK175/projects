import { beforeEach, describe, expect, it, vi } from 'vitest';
import argon2 from 'argon2';
import { createAuthService } from '#services/auth.service';

vi.mock('argon2', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    verify: vi.fn().mockResolvedValue(true),
  },
}));

const createDb = ({ existingUser = null } = {}) => {
  const selectChain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(existingUser ? [existingUser] : []),
  };
  const insertChain = {
    values: vi.fn().mockResolvedValue([{ insertId: 7 }]),
  };
  return {
    select: vi.fn(() => selectChain),
    insert: vi.fn(() => insertChain),
    _selectChain: selectChain,
    _insertChain: insertChain,
  };
};

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a new user and does not expose password', async () => {
    const db = createDb();
    const service = createAuthService({ db });
    const result = await service.register({ email: 'user@example.com', password: 'secret123' });
    expect(result).toEqual({ id: 7, email: 'user@example.com' });
    expect(argon2.hash).toHaveBeenCalledWith('secret123');
  });

  it('returns null when email already exists', async () => {
    const db = createDb({ existingUser: { id: 1, email: 'user@example.com', password: 'hash' } });
    const service = createAuthService({ db });
    const result = await service.register({ email: 'user@example.com', password: 'secret123' });
    expect(result).toBeNull();
  });

  it('verifies valid credentials', async () => {
    const db = createDb({ existingUser: { id: 1, email: 'user@example.com', password: 'hash' } });
    const service = createAuthService({ db });
    const result = await service.verifyCredentials({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result).toEqual({ id: 1, email: 'user@example.com' });
    expect(argon2.verify).toHaveBeenCalled();
  });

  it('returns null for invalid credentials', async () => {
    argon2.verify.mockResolvedValueOnce(false);
    const db = createDb({ existingUser: { id: 1, email: 'user@example.com', password: 'hash' } });
    const service = createAuthService({ db });
    await expect(
      service.verifyCredentials({ email: 'user@example.com', password: 'wrong' }),
    ).resolves.toBeNull();
  });
});
