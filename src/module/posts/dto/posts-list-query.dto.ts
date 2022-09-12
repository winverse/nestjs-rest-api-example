import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PostsListQueryDto {
  @ApiProperty({
    example: 'Typescript',
  })
  @IsString()
  @IsOptional()
  keyword?: string | undefined;

  @ApiProperty({
    example: '1',
  })
  @IsInt()
  page: number;

  @ApiProperty({
    example: '10',
  })
  @IsInt()
  limit: number;
}
