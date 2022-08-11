import { Injectable } from '@nestjs/common';
import { ConfigService } from '@provider/config';
import jwt, { SignOptions } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}
  signToken(payload: any, options?: SignOptions): Promise<string> {
    const apiHost = this.config.get('app.apiHost');
    const jwtSecretKey = this.config.get('jwt.jwtSecretKey');

    const jwtOptions: SignOptions = {
      issuer: apiHost,
      ...options,
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecretKey, jwtOptions, (error, token) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(token);
      });
    });
  }

  decodeToken<T>(token: string): Promise<T> {
    const jwtSecretKey = this.config.get('jwt.jwtSecretKey');
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecretKey, (error, decoded) => {
        if (error) {
          reject(error);
          return;
        }
        if (!decoded) {
          throw new Error('Decoded data is undefined');
        }
        resolve(decoded as T);
      });
    });
  }
}
