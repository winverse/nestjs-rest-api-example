import { Module } from '@nestjs/common';
import { ConfigModule } from '@provider/config';
import { CookieModule } from '@provider/cookie';
import { JwtModule } from '@provider/jwt';
import { PrismaModule } from '@provider/prisma';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule, JwtModule, CookieModule, PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
