import { AuthGuard } from '@common/guards';
import { LOGIN_INFORMATION_NOT_MATCH } from '@constants/errors/errors.constants';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';

@ApiTags('auth')
@Controller({
  path: '/auth',
  version: ['1'],
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register for new user',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  @Post('/register')
  async register(
    @Body() body: AuthRegisterBodyDto,
    @Res() reply: FastifyReply,
  ) {
    await this.authService.register(body, reply);
    reply.status(HttpStatus.CREATED).send('Created');
  }

  @ApiOperation({
    summary: 'Login for site member',
  })
  @ApiResponse({ status: 409, description: LOGIN_INFORMATION_NOT_MATCH })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Post('/login')
  async login(@Body() body: AuthLoginBodyDto, @Res() reply: FastifyReply) {
    await this.authService.login(body, reply);
    reply.status(HttpStatus.OK).send('Ok');
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Res() reply: FastifyReply) {
    await this.authService.logout(reply);
    reply.status(HttpStatus.OK).send('Ok');
  }
}
