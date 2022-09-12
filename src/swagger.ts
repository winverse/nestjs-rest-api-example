import path from 'path';
import fs from 'fs';

import { mode } from './common/helpers';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { FastifySwaggerOptions } from '@fastify/swagger';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

function capitalize(str: string) {
  return str
    .split('')
    .map((s, index) => (index === 0 ? s.toUpperCase() : s))
    .join('');
}

async function getModules(defaultPath: string, exclude = []) {
  const moduleDirPath = path.resolve(process.cwd(), defaultPath);

  const modules = await Promise.all(
    fs.readdirSync(moduleDirPath).map(async (file) => {
      if (exclude.includes(file)) return; // Add the path you want to be removed from swagger
      const moduleInfo = await import(
        `${moduleDirPath}/${file}/${file}.module.js`
      );

      const module = moduleInfo[`${capitalize(file)}Module`];

      return module;
    }),
  );

  return modules;
}

export async function swagger(fastify: NestFastifyApplication) {
  if (mode.isProd) return;

  const options: FastifySwaggerOptions = {
    transformStaticCSP: (header) => header,
    uiConfig: {
      docExpansion: 'none', // full, list, none
      deepLinking: false,
    },
    staticCSP: true,
  };

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nestjs rest api example')
    .setDescription('The rest api descrition')
    .setVersion('1.0')
    // .setExternalDoc(""); // Add anything
    .build();

  const modules = await getModules('./dist/src/module/');
  const document = SwaggerModule.createDocument(fastify, swaggerConfig, {
    include: modules,
  });

  SwaggerModule.setup('/api/documentation', fastify, document, options);
}
