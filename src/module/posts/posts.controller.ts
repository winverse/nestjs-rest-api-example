import { AuthGuard } from '@common/guards';
import type { PostWriteBodyDto, PostsListQueryDto } from '@module/posts/dto';
import { PostsService } from '@module/posts/posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

@ApiTags('posts')
@Controller({
  path: '/posts',
  version: ['1'],
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async write(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() body: PostWriteBodyDto,
  ) {
    const userId = request.user.id;
    await this.postsService.create(body, userId);
    reply.status(HttpStatus.CREATED).send('Ok');
  }

  @Get('/')
  async list(@Res() reply: FastifyReply, @Query() query: PostsListQueryDto) {
    const list = await this.postsService.findMany(query);
    reply.status(HttpStatus.OK).send(list);
  }

  @Get('/:postId')
  async read(@Res() reply: FastifyReply, @Param('postId') postId: string) {
    const post = await this.postsService.findOne(postId);
    reply.status(HttpStatus.OK).send(post);
  }

  @UseGuards(AuthGuard)
  @Post('/:postId')
  async update(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() body: PostWriteBodyDto,
    @Param('postId') postId: string,
  ) {
    const userId = request.user.id;
    const post = await this.postsService.update(body, userId, postId);
    reply.status(HttpStatus.OK).send(post);
  }

  @Delete('/:postId')
  async delete(@Res() reply: FastifyReply, @Param('postId') postId: string) {
    await this.postsService.delete(postId);
    reply.status(HttpStatus.OK).send('OK');
  }
}
