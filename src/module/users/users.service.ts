import { LoggedUserData } from '@module/users/users.interface';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@provider/config';
import { CookieService } from '@provider/cookie';
import { JwtService } from '@provider/jwt/jwt.service';
import { PrismaService } from '@provider/prisma';
import { FastifyReply } from 'fastify';

@Injectable()
export class UsersService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly cookie: CookieService,
    private readonly prisma: PrismaService,
  ) {}
  async setJwtToken(
    reply: FastifyReply,
    LoggedUserData: LoggedUserData,
  ): Promise<void> {
    try {
      const jwtConfig = this.config.get('jwt');
      const { accessTokenMaxAge, refreshTokenMaxAge } = jwtConfig;

      const accessToken = this.jwt.signToken(
        { user: LoggedUserData },
        {
          expiresIn: accessTokenMaxAge,
        },
      );

      const refreshToken = this.jwt.signToken(
        { userId: LoggedUserData.id },
        {
          expiresIn: refreshTokenMaxAge,
        },
      );

      await this.cookie.setCookie(reply, 'access_token', accessToken, {
        maxAge: accessTokenMaxAge / 1000, // max age base on 1ms
      });

      await this.cookie.setCookie(reply, 'refresh_token', refreshToken, {
        maxAge: refreshTokenMaxAge / 1000, // max age base on 1ms
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getLoggedUserData(userId: string): Promise<LoggedUserData> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Not found user');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async createUser(username: string, email: string, password: string) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password,
        },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
