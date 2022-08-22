import { IsEmail, IsString } from 'class-validator';

export class AuthRegisterBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
