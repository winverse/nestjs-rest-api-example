import { LoggedUserData } from '@module/users/users.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: LoggedUserData;
  }
}
