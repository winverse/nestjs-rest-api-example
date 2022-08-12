import { Module } from '@nestjs/common';
import { ConfigModule } from '@provider/config';
import { UtilsModule } from '@provider/utils';

import { CookieService } from './cookie.service';

@Module({
  imports: [ConfigModule, UtilsModule],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
