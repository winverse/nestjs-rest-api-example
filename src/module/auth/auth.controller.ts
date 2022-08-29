import { AuthGuard } from '@common/guards';
import { AuthService } from '@module/auth/auth.service';
import { AuthLoginBodyDto, AuthRegisterBodyDto } from '@module/auth/dto';

import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Controller({
  path: '/auth',
  version: ['1'],
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(
    @Body() body: AuthRegisterBodyDto,
    @Res() reply: FastifyReply,
  ) {
    await this.authService.register(body, reply);
    reply.status(HttpStatus.CREATED).send('Created');
  }
  @Post('/login')
  async login(@Body() body: AuthLoginBodyDto, @Res() reply: FastifyReply) {
    await this.authService.login(body, reply);
    reply.status(HttpStatus.OK).send('Ok');
  }
  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Res() reply: FastifyReply) {
    await this.authService.logout(reply);
    reply.status(HttpStatus.OK).send('Ok');
  }
}
