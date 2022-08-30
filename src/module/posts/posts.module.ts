import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '@provider/prisma';
import { FuseModule } from '@provider/fuse';

@Module({
  imports: [PrismaModule, FuseModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
