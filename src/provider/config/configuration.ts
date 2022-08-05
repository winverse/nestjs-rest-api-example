import path from 'path';
import fs from 'fs';

import { Config } from '@provider/config/config.interface';
import Joi from 'joi';

const validate = (config: Config): void => {
  const schema = Joi.object().keys({
    app: Joi.object().keys({
      environment: Joi.string().valid('development', 'production').required(),
      port: Joi.number().required(),
    }),
    token: Joi.object().keys({
      jwtSecret: Joi.string().required(),
      cookieSecret: Joi.string().required(),
      accessTokenMaxAge: Joi.number().integer().required(),
      refreshTokenMaxAge: Joi.number().integer().required(),
    }),
    throttle: Joi.object().keys({
      ttl: Joi.number().integer().required(),
      limit: Joi.number().integer().required(),
    }),
  });

  const { error } = schema.validate(config);

  if (error) {
    throw new Error(`config validate failed, message: ${error.message}`);
  }
};

export const configuration = async (): Promise<Config> => {
  const fileName = process.env.NODE_ENV || 'development';
  const filePath = path.resolve(process.cwd(), `config/${fileName}.ts`);
  const exists = await fs.existsSync(filePath);

  if (!exists) {
    throw new Error(`Missing ${fileName} env file`);
  }

  const { config }: { config: Config } = await import(
    `../../../config/${fileName}`
  );

  validate(config);

  return config;
};
