import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService, ConfigModule, configuration } from './provider/config';
import { PrismaModule } from './provider/prisma/prisma.module';
import { JwtModule } from './provider/jwt/jwt.module';
import { CookieModule } from './provider/cookie/cookie.module';
import { UtilsModule } from './provider/utils/utils.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    PrismaModule,
    JwtModule,
    CookieModule,
    UtilsModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
