import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService, ConfigModule, configuration } from './provider/config';

@Module({
  imports: [NestConfigModule.forRoot({ load: [configuration] }), ConfigModule],
  providers: [ConfigService],
})
export class AppModule {}
