import { Module } from '@nestjs/common';
import { UtilsService } from '@provider/utils';
import { LoggerService } from './logger.service';

@Module({
  imports: [UtilsService],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
