import { Config } from '@provider/config';

export const config: Config = {
  app: {
    environment: 'development',
    port: 8080,
    clientHost: 'http://localhost:3000',
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
  jwt: {
    // Using openssl rand -hex 32
    jwtSecretKey: '',
    cookieSecretKey: '',
    accessTokenMaxAge: 1000 * 60 * 5, // 5 minute, jwt token max age base on 1000ms
    refreshTokenMaxAge: 1000 * 60 * 60 * 24 * 7, // 7days, jwt token max age base on 1000ms
  },
  throttle: {
    ttl: 1000 * 60, // the number of seconds that each request will last in storage
    limit: 100, // the maximum number of requests within the TTL limit
  },
};
