import { AuthGuard } from '@common/guards';
import { NOT_FOUND_POST } from '@constants/errors/errors.constants';
import { PostsWriteBodyDto, PostsListQueryDto } from '@module/posts/dto';
import { PostsService } from '@module/posts/posts.service';
import { postsFindManySchema, postsFindOneSchema } from '@module/posts/schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

@ApiTags('posts')
@Controller({
  path: '/posts',
  version: ['1'],
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Create new Post',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  @UseGuards(AuthGuard)
  @Post('/')
  async write(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() body: PostsWriteBodyDto,
  ) {
    const userId = request.user.id;
    await this.postsService.create(body, userId);
    reply.status(HttpStatus.CREATED).send('Created');
  }

  @ApiOperation({
    summary: 'Get posts list',
  })
  @ApiResponse({ status: 200, description: 'Ok', schema: postsFindManySchema })
  @Get('/')
  async list(@Res() reply: FastifyReply, @Query() query: PostsListQueryDto) {
    const list = await this.postsService.findMany(query);
    reply.status(HttpStatus.OK).send(list);
  }

  @ApiOperation({
    summary: 'Read a post detail',
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_POST })
  @ApiResponse({ status: 200, description: 'Ok', schema: postsFindOneSchema })
  @Get('/:postId')
  async read(@Res() reply: FastifyReply, @Param('postId') postId: string) {
    const post = await this.postsService.findOne(postId);
    reply.status(HttpStatus.OK).send(post);
  }

  @ApiOperation({
    summary: 'Update a post',
  })
  @ApiResponse({ status: 404, description: NOT_FOUND_POST })
  @ApiResponse({ status: 200, description: 'Ok' })
  @UseGuards(AuthGuard)
  @Patch('/:postId')
  async update(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() body: PostsWriteBodyDto,
    @Param('postId') postId: string,
  ) {
    const userId = request.user.id;
    await this.postsService.update(body, userId, postId);
    reply.status(HttpStatus.OK).send('Ok');
  }

  @ApiOperation({
    summary: 'Delete a post',
  })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Delete('/:postId')
  async delete(@Res() reply: FastifyReply, @Param('postId') postId: string) {
    await this.postsService.delete(postId);
    reply.status(HttpStatus.OK).send('OK');
  }
}
