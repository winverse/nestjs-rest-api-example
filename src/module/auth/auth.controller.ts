import { AuthService } from '@module/auth/auth.service';
import { AuthLoginBodyDto, AuthRegisterBodyDto } from '@module/auth/dto';
import { UsersService } from '@module/users/users.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Controller({
  path: '/auth',
  version: ['1'],
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('/register')
  async register(
    @Body() body: AuthRegisterBodyDto,
    @Res() reply: FastifyReply,
  ) {
    const loggedUserData = await this.authService.register(body);
    await this.usersService.setJwtToken(reply, loggedUserData);
    reply.status(HttpStatus.CREATED).send('Created');
  }
  @Post('/login')
  async login(@Body() body: AuthLoginBodyDto, @Res() reply: FastifyReply) {
    const loggedUserData = await this.authService.login(body);
    await this.usersService.setJwtToken(reply, loggedUserData);
    reply.status(HttpStatus.OK).send('Ok');
  }
}
