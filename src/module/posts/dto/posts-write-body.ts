import { IsString } from 'class-validator';

export class PostBody {
  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsString()
  thumbnail: string;
}
