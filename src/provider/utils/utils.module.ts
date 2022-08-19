import { Module } from '@nestjs/common';
import { bcryptProvider } from '@provider/utils/utils.provider';
import { UtilsService } from './utils.service';

@Module({
  providers: [...bcryptProvider, UtilsService],
  exports: [...bcryptProvider, UtilsService],
})
export class UtilsModule {}
