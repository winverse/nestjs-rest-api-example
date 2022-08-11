import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  mode() {
    const isDev = process.env.NODE_ENV !== 'production';
    return {
      isDev,
      isProd: !isDev,
    };
  }
}
