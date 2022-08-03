import { Module } from '@nestjs/common';
import { ConfigService } from './provider/config/config.service';
import { ConfigModule } from './provider/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
})
export class AppModule {}
