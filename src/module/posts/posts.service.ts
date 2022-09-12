import { NOT_FOUND_POST } from '@constants/errors/errors.constants';
import { PostsWriteBodyDto } from '@module/posts/dto';
import { PostsListQueryDto } from '@module/posts/dto/posts-list-query.dto';
import { PostListType } from '@module/posts/posts.interface';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FuseService } from '@provider/fuse';
import { PrismaService } from '@provider/prisma';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fuse: FuseService,
  ) {}
  async create(body: PostsWriteBodyDto, userId: string) {
    try {
      const { title, contents, thumbnail } = body;
      await this.prisma.post.create({
        data: {
          title,
          contents,
          thumbnail,
          fkUserId: userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findOne(postId: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          id: true,
          title: true,
          contents: true,
          thumbnail: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });

      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findMany(query: PostsListQueryDto) {
    try {
      const { page, limit, keyword } = query;

      const posts = await this.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          contents: true,
          thumbnail: true,
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      let list: PostListType[] | null = null;
      if (keyword) {
        list = await this.fuse
          .searchEngine({
            list: posts,
            keys: [
              {
                name: 'title',
                weight: 0.1,
              },
              { name: 'contents', weight: 0.3 },
            ],
            keyword,
          })
          .map((result) => result.item);
      } else {
        list = posts;
      }

      const count = posts.length;
      const offset = limit * (page - 1);
      const result = list.slice(offset, offset + limit);

      return { list: result, count };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(body: PostsWriteBodyDto, userId: string, postId: string) {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
          fkUserId: userId,
        },
      });

      if (!post) {
        throw new NotFoundException(NOT_FOUND_POST);
      }

      await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          ...body,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delete(postId: string) {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new NotFoundException(NOT_FOUND_POST);
      }

      await this.prisma.post.delete({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
