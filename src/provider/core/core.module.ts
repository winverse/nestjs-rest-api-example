import { UsersModule } from '@module/users';
import { Module } from '@nestjs/common';
import { CookieModule } from '@provider/cookie';
import { JwtModule } from '@provider/jwt';
import { CoreService } from './core.service';

@Module({
  imports: [UsersModule, CookieModule, JwtModule],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
