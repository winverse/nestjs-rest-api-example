import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule, configuration } from './provider/config';
import { PrismaModule } from './provider/prisma/prisma.module';
import { JwtModule } from './provider/jwt/jwt.module';
import { CookieModule } from './provider/cookie/cookie.module';
import { UtilsModule } from './provider/utils/utils.module';
import { LoggerModule } from './provider/logger/logger.module';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { BotModule } from './provider/bot/bot.module';
import { HttpExceptionFilter } from '@common/filters';
import { APP_FILTER } from '@nestjs/core';
import { CoreModule } from './provider/core/core.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    PrismaModule,
    JwtModule,
    CookieModule,
    UtilsModule,
    LoggerModule,
    UsersModule,
    AuthModule,
    BotModule,
    CoreModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
