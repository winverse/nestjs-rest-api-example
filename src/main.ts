import path from 'path';
import { CorsPlugin, MultipartPlugin, PingPlugin } from '@common/plugins';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { swagger } from './swagger';

async function bootstrap() {
  const fastify = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  fastify.register(CorsPlugin);
  fastify.register(fastifyStatic, {
    root: path.resolve(process.cwd(), 'assets'),
    prefix: '/',
  });
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  fastify.register(MultipartPlugin);
  fastify.register(PingPlugin);

  fastify.setGlobalPrefix('/api');
  fastify.enableVersioning({
    type: VersioningType.URI,
  });

  fastify.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
    }),
  );

  swagger(fastify);

  const PORT = process.env.PORT;
  const DATABASE_URL = process.env.DATABASE_URL;

  await fastify.listen(PORT, (err, address) => {
    console.log(`Server is Running: ${address}`);
    console.log(`Swagger: ${address}/api/documentation`);
    console.log(`Database URL: ${DATABASE_URL}`);
  });
}

bootstrap();
