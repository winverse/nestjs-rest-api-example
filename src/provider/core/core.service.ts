import { UsersService } from '@module/users/users.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CookieService } from '@provider/cookie';
import { JwtService } from '@provider/jwt';
import type {
  AccessTokenDecoded,
  RefreshTokenDecoded,
} from '@provider/jwt/jwt.interface';
import { FastifyInstance } from 'fastify';

@Injectable()
export class CoreService implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly cookie: CookieService,
  ) {}
  onModuleInit(): void {
    const fastify: FastifyInstance = this.adapterHost.httpAdapter.getInstance();

    fastify.decorateRequest('user', null);
    fastify.addHook('preHandler', async (request, reply) => {
      const accessToken = request.cookies?.access_token;
      const refreshToken = request.cookies?.refresh_token;

      try {
        if (accessToken) {
          const decoded = await this.jwt.decodeToken<AccessTokenDecoded>(
            accessToken,
          );

          request.user = decoded.user;
        } else if (refreshToken) {
          const decoded = await this.jwt.decodeToken<RefreshTokenDecoded>(
            refreshToken,
          );

          const loggedUserData = await this.usersService.getLoggedUserData(
            decoded.userId,
          );

          await this.usersService.setJwtToken(reply, loggedUserData);
          request.user = loggedUserData;

          const diff = decoded.exp * 1000 - new Date().getTime();
          // less 30min
          if (diff < 1000 * 60 * 30) {
            this.usersService.setJwtToken(reply, loggedUserData);
          }
        }

        // Add something
      } catch (error) {
        // Not caught in an exception filter
        console.error('Processing token error');
        this.cookie.clearCookie(reply, 'access_token');
        this.cookie.clearCookie(reply, 'refresh_token');
      }
    });
  }
}
