import Fastify, { FastifyLogFn } from 'fastify';

declare module 'fastify' {
  interface FastifyBaseLogger {
    http: FastifyLogFn;
  }
}

(async () => {
  try {
    const server = Fastify({
      logger: {
        customLevels: { http: 55 },
        formatters: {
          level: (label: string) => {
            return { level: label };
          },
        },
      },
    });

    server.addHook('onRequest', (req, _res, done) => {
      req.log.http({ req }, 'Incoming http request');
      done();
    });

    server.get('/', (_request, reply) => {
      reply.send({ hello: 'world' });
    });

    await server.listen({ host: '0.0.0.0', port: 3000 });
  } catch (error) {
    process.exit(1);
  }
})();
