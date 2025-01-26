import { NewsDb } from '../database/news.db.js';

async function routes(fastify, options) {
  fastify.get('/news', async () => {
    const news = await NewsDb.getNews(25);
    return { news };
  });
}

export default routes;
