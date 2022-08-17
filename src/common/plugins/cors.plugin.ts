import { mode } from '@common/helpers';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const callback: FastifyPluginCallback = async (fastify, options, next) => {
  fastify.addHook('onRequest', (request, reply, done) => {
    const origin = request.headers.origin || request.headers.host;

    const regex = /^(?:(.+).)?(winverse\.com|winverse\.io)$/i;

    const allowed = mode.isDev || regex.test(origin);

    if (allowed) {
      reply.header('Access-Control-Allow-Origin', origin);
    }

    reply.header(
      'Access-Control-Allow-Methods',
      'POST, PUT, GET, DELETE, PATCH, OPTIONS',
    );
    reply.header(
      'Access-Control-Allow-Headers',
      'Content-Type, X-Requested-With',
    );
    reply.header('Access-Control-Allow-Credentials', true);

    if (request.method === 'OPTIONS') {
      reply.status(200).send('Ok');
    } else {
      done();
    }
  });
  next();
};

export const CorsPlugin = fp(callback, { name: 'CorsPlugin' });
