import type { LoggedUserData } from '@module/users';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const user: LoggedUserData | null = request?.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
