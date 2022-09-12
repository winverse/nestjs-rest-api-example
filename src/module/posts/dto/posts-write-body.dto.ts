import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostsWriteBodyDto {
  @ApiProperty({
    example: 'What is the type level system?',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'I want talk to type level system, this is the powerful for mordern application...',
  })
  @IsString()
  contents: string;

  @ApiProperty({
    example: 'https://aws.s3.northeast.s...',
  })
  @IsString()
  thumbnail: string;
}
