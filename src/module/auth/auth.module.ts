import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '@module/users/users.service';

@Module({
  imports: [UsersService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
