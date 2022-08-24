import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BotService } from '@provider/bot';
import { LoggerService } from '@provider/logger';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly bot: BotService,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // basic
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const message = exception.message;
      const statusCode = exception.getStatus();

      const user = request.user;
      const log = `
        from: nestjs-rest-api
        user_info: ${
          user ? `userId: ${user.id}, name: ${user.username}` : `NOT_LOGGED`
        }
        method: ${request.method}
        url: ${request.url}
        statusCode: ${statusCode}
        message: ${message}
        body: ${JSON.stringify(request.body, null, 4) || {}}
        params: ${JSON.stringify(request.params, null, 4)}
        query: ${JSON.stringify(Object.assign({}, request.query), null, 4)}
      `;

      this.bot.telegramSendMessage('error', log);
    }

    console.log((exception as any)?.message);
    this.logger.error(exception);

    reply
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send('INTERNAL_SERVER_ERROR');
  }
}
