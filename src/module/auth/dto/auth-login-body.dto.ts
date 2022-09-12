import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginBodyDto {
  @ApiProperty({
    example: 'public.winverse@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'enterThePassword',
  })
  @IsString()
  password: string;
}
