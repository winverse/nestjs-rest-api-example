import { format } from 'date-fns';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const callback: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get('/ping', options, (request, reply) => {
    const now = new Date();
    const formatedTime = format(now, 'yy년 MM월 dd일 HH시 mm분 ss초');
    reply.send(formatedTime);
  });
  done();
};

export const PingPlugin = fp(callback, { name: 'PingPlugin' });
