import { randomUUID } from 'node:crypto';
import { REDIS_KEYS } from '#constants/redis-keys';

const ACCESS_TTL = '15m';
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

export const authController = {
  async register(request, reply) {
    const user = await request.server.authService.register(request.body);
    if (!user) throw reply.badRequest('User with this email already exists');
    return reply.code(201).send({ message: 'User registered', user });
  },

  async login(request, reply) {
    const user = await request.server.authService.verifyCredentials(request.body);
    if (!user) return reply.code(401).send({ error: 'Invalid email or password' });

    const accessToken = await reply.jwtSign(
      { sub: user.id, email: user.email, jti: randomUUID() },
      { expiresIn: ACCESS_TTL },
    );
    const refreshToken = await reply.jwtSign(
      { sub: user.id, type: 'refresh', jti: randomUUID() },
      { expiresIn: '7d' },
    );

    await request.server.redis.set(
      REDIS_KEYS.refreshToken(user.id),
      refreshToken,
      'EX',
      REFRESH_TTL_SECONDS,
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: request.server.config.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
      })
      .send({ message: 'Logged in', accessToken, user });
  },

  async refresh(request, reply) {
    const token = request.cookies.refreshToken;
    if (!token) return reply.code(401).send({ error: 'Refresh token is missing' });

    let payload;
    try {
      payload = await request.server.jwt.verify(token);
    } catch {
      return reply.code(401).send({ error: 'Invalid refresh token' });
    }

    const saved = await request.server.redis.get(REDIS_KEYS.refreshToken(payload.sub));
    if (saved !== token) return reply.code(401).send({ error: 'Refresh token was revoked' });

    const user = await request.server.authService.findById(payload.sub);
    const accessToken = await reply.jwtSign(
      { sub: user.id, email: user.email, jti: randomUUID() },
      { expiresIn: ACCESS_TTL },
    );
    return { accessToken };
  },

  async logout(request, reply) {
    const { jti, exp, sub } = request.user;
    const now = Math.floor(Date.now() / 1000);
    if (jti && exp && exp > now) {
      await request.server.redis.set(REDIS_KEYS.tokenBlacklist(jti), '1', 'EX', exp - now);
    }
    if (sub) await request.server.redis.del(REDIS_KEYS.refreshToken(sub));
    return reply.clearCookie('refreshToken', { path: '/auth/refresh' }).code(204).send();
  },
};
