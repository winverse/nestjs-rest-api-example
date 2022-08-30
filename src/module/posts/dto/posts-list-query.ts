import { IsInt, IsOptional, IsString } from 'class-validator';

export class PostsListQuery {
  @IsString()
  @IsOptional()
  keyword?: string | undefined;

  @IsInt()
  page: number;

  @IsInt()
  limit: number;
}
