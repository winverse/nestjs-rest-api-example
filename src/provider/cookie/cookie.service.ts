import { Injectable } from '@nestjs/common';

import { ConfigService } from '@provider/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { parseDomain, ParseResultType } from 'parse-domain';
import { UtilsService } from '@provider/utils/utils.service';

@Injectable()
export class CookieService {
  constructor(
    private readonly config: ConfigService,
    private readonly utils: UtilsService,
  ) {}
  setCookie(
    reply: FastifyReply,
    name: string,
    payload: any,
    options?: CookieSerializeOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const { isProd, isDev } = this.utils.mode();
        const clientHost = this.config.get('app.clientHost');
        let domain = undefined;
        if (isProd) {
          const parseResult = parseDomain(clientHost.replace('https://', ''));

          if (parseResult.type === ParseResultType.Listed) {
            const { domain: secondLevelDomain, topLevelDomains } = parseResult;
            domain = `.${secondLevelDomain}.${topLevelDomains.join('.')}`;
          }
        }

        const stringifyPayload = JSON.stringify(payload);

        reply.setCookie(name, stringifyPayload, {
          ...options,
          httpOnly: true,
          secure: !isDev,
          domain,
          path: '/',
          sameSite: isProd ? 'strict' : undefined,
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getCookie(
    request: FastifyRequest,
    name: string,
  ): Promise<string | undefined> {
    return new Promise((resolve) => {
      const value: string | undefined = request.cookies[name];
      if (!value) {
        resolve(undefined);
        return;
      }
      resolve(value);
    });
  }

  async clearCookie(reply: FastifyReply, name: string): Promise<void> {
    try {
      this.setCookie(reply, name, '', { maxAge: 0 });
    } catch (error) {
      throw new Error(error);
    }
  }
}
