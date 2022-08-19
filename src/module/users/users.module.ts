import { Module } from '@nestjs/common';
import { ConfigService } from '@provider/config';
import { CookieService } from '@provider/cookie';
import { JwtService } from '@provider/jwt';
import { PrismaService } from '@provider/prisma';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigService, JwtService, CookieService, PrismaService],
  providers: [UsersService],
})
export class UsersModule {}
