import Fastify from 'fastify';
import { config } from '../config.js';
import routes from './routes.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(routes)

const start = async () => {
  try {
    await fastify.listen({ port: config.api.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();