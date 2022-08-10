import { Config } from '@provider/config';

export const config: Config = {
  app: {
    environment: 'development',
    port: 8080,
    apiHost: 'http://localhost:8080',
  },
  database: {
    provider: 'postgresql',
    host: '',
    database: '',
    port: 5432,
    userName: '',
    password: '',
  },
  token: {
    // Using openssl rand -hex 32
    jwtSecret: '',
    cookieSecret: '',
    accessTokenMaxAge: 60 * 5, // 5 minute, max age base on 1ms
    refreshTokenMaxAge: 60 * 60 * 24 * 7, // 7days
  },
  throttle: {
    ttl: 1000 * 60, // the number of seconds that each request will last in storage
    limit: 100, // the maximum number of requests within the TTL limit
  },
};
