import { Module } from '@nestjs/common';
import { FuseService } from './fuse.service';

@Module({
  providers: [FuseService],
  exports: [FuseService],
})
export class FuseModule {}
