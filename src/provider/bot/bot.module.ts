import { Module } from '@nestjs/common';
import { ConfigModule } from '@provider/config';
import { BotService } from './bot.service';

@Module({
  imports: [ConfigModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
