import { Module } from '@nestjs/common';
import { UtilsModule } from '@provider/utils';
import { LoggerService } from './logger.service';

@Module({
  imports: [UtilsModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
