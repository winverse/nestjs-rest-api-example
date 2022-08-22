import { IsEmail, IsString } from 'class-validator';

export class AuthLoginBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
