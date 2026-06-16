export const authController = {
  async register(request, reply) {
    const user = await request.server.authService.register(request.body);
    if (!user) throw reply.badRequest('User with this email already exists');
    return reply.code(201).send({ message: 'User registered', user });
  },

  async login(request, reply) {
    const user = await request.server.authService.verifyCredentials(request.body);
    if (!user) return reply.code(401).send({ error: 'Invalid email or password' });
    request.session.userId = user.id;
    return { message: 'Logged in', user };
  },

  async logout(request, reply) {
    await request.session.destroy();
    return reply.code(204).send();
  },
};
