import { Module } from '@nestjs/common';
import { ConfigService } from '@provider/config';
import { UtilsService } from '@provider/utils/utils.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [ConfigService, UtilsService],
  exports: [CookieService],
  providers: [CookieService],
})
export class CookieModule {}
