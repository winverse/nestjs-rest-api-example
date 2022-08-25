import { FastifyPluginCallback } from 'fastify';
import multipartPlugin from '@fastify/multipart';
import fp from 'fastify-plugin';

const callback: FastifyPluginCallback = (fastify, options, done) => {
  fastify.register(multipartPlugin, {
    throwFileSizeLimit: true,
    limits: {
      fileSize: 1024 * 1024 * 50, // 50MB
    },
  });
  done();
};

export const MultipartPlugin = fp(callback, { name: 'MultipartPlugin' });
