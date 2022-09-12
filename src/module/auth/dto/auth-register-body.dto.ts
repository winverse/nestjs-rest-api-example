import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthRegisterBodyDto {
  @ApiProperty({
    example: 'public.winverse@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'winverse',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'enterThePassword',
  })
  @IsString()
  password: string;
}
