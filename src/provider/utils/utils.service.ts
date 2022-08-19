import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HASH_SALT_OR_ROUND } from '@provider/utils/utils.constants';
import bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor(@Inject(HASH_SALT_OR_ROUND) private readonly hashSalt: number) {}
  mode() {
    const isDev = process.env.NODE_ENV !== 'production';
    return {
      isDev,
      isProd: !isDev,
    };
  }
  async hashGenerate(str: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.hashSalt);
      const hash = await bcrypt.hash(str, salt);

      return hash;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async hashCompare(plain: string, hashed: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plain, hashed);
      return isMatch;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
