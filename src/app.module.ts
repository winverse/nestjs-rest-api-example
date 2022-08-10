import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService, ConfigModule, configuration } from './provider/config';
import { PrismaModule } from './provider/prisma/prisma.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ load: [configuration] }),
    ConfigModule,
    PrismaModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
