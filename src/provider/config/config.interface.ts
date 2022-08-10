export interface AppConfig {
  readonly environment: 'development' | 'production';
  readonly port: number;
  readonly apiHost: string;
}

export interface DatabaseConfig {
  readonly provider:
    | 'postgresql'
    | 'cockroachdb'
    | 'mongodb'
    | 'mysql'
    | 'sqlite';
  readonly host: string;
  readonly database: string;
  readonly port: number;
  readonly userName: string;
  readonly password: string;
}

export interface TokenConfig {
  readonly jwtSecret: string;
  readonly cookieSecret: string;
  readonly accessTokenMaxAge: number;
  readonly refreshTokenMaxAge: number;
}

export interface ThrottleConfig {
  readonly ttl: number;
  readonly limit: number;
}

export type ConfigKey = 'app' | 'database' | 'token' | 'throttle';

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  token: TokenConfig;
  throttle: ThrottleConfig;
}
