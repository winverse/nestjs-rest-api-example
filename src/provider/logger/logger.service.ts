import path from 'path';
import fs from 'fs';

import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import WinstonDaily from 'winston-daily-rotate-file';
import winston from 'winston';
import { format } from 'date-fns';
import { UtilsService } from '@provider/utils';

@Injectable()
export class LoggerService implements NestLogger {
  private logger: winston.Logger;
  private logDir: string;
  constructor(private readonly utils: UtilsService) {
    const { combine, colorize, errors } = winston.format;

    const logDirPath = path.resolve(process.cwd(), 'logs');

    if (!fs.existsSync(logDirPath)) {
      fs.mkdirSync(logDirPath);
    }

    this.logDir = logDirPath;

    const levels = {
      errors: 0,
      wanr: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    const { isDev } = this.utils.mode();

    const level = isDev ? 'debug' : 'http';
    const format = this.createLogFormat();

    const consoleOpts = {
      handleExceptions: true,
      level: isDev ? 'debug' : 'error',
      format: combine(colorize(), errors({ stack: true })),
    };

    const transports = [
      // 콘솔로그찍을 때만 색넣자.
      new winston.transports.Console(consoleOpts),
      // error 레벨 로그를 저장할 파일 설정
      new WinstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(logDirPath, '/error'),
        filename: '%DATE%.log',
        maxFiles: 30,
        zippedArchive: true,
        json: true,
      }),
      // 모든 레벨 로그를 저장할 파일 설정
      new WinstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(logDirPath, '/all'),
        filename: '%DATE%.log',
        maxFiles: 30,
        zippedArchive: true,
      }),
    ];

    this.logger = winston.createLogger({
      level,
      levels,
      format,
      transports,
    });
  }
  private createLogFormat() {
    const { combine, timestamp, printf } = winston.format;

    const format = combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf((info) => {
        const message = `[${info.level.toUpperCase()}] ${info.timestamp}: ${
          info.message
        }`;

        if (info.stack) {
          message +
            `Error Stack: ${info.stack}
          `;
        }

        return message;
      }),
    );

    return format;
  }

  write(log: string) {
    try {
      const dir = this.logDir;
      const now = format(new Date(), 'yyyy-MM-dd');
      const filePath = `${dir}/error/${now}.log`;
      fs.appendFileSync(filePath, `${log}\n`, 'utf8');
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 4));
    }
  }
  log(message: string) {
    this.logger.info(message);
  }
  error(error: any) {
    const time = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    this.write(`[${time}]`);
    if (typeof error === 'string') {
      this.write(`${error}\n`);
      return;
    }

    Object.entries(error).map(([key, value]) => {
      if (typeof error[key] === 'object') {
        const line = `[${[key]}]: ${JSON.stringify(value)}`;
        this.write(line);
      } else {
        const line = `[${[key]}]: ${value}`;
        this.write(line);
      }
    });
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
}
