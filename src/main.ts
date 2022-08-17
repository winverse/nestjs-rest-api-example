import { CorsPlugin } from '@common/plugins';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const fastify = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  fastify.register(CorsPlugin);

  fastify.setGlobalPrefix('/api');
  fastify.enableVersioning({
    type: VersioningType.URI,
  });

  await fastify.listen(3000);
}

bootstrap();
