import { LoggedUserData } from '@module/users/users.interface';

type JwtDefault = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
};

export type AccessTokenDecoded = { user: LoggedUserData } & JwtDefault;
export type RefreshTokenDecoded = { userId: string } & JwtDefault;
