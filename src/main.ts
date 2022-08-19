import path from 'path';
import { CorsPlugin } from '@common/plugins';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';

async function bootstrap() {
  const fastify = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  fastify.register(CorsPlugin);
  fastify.register(fastifyStatic, {
    root: path.resolve(process.cwd(), 'assets'),
    prefix: '/',
  });
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

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

  const PORT = process.env.PORT;

  await fastify.listen(PORT);
}

bootstrap();
