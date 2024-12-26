import TelegramBot from 'node-telegram-bot-api';
import { NewsNowCrawler } from './news-now.crawler.js';
import { config } from "./config.js";

const bot = new TelegramBot(config.telegram.botToken, { polling: true });

bot.on('message', async (msg, meta) => {
  console.log(msg.text, meta);
  if (!msg.text.startsWith('/')) return;

  switch (msg.text.toLowerCase()) {
    case '/start':
      await bot.sendMessage(msg.chat.id, '✌');
      break;
    case '/newsnow':
      const newsLinks = await NewsNowCrawler.crawl()
      newsLinks.forEach(newsLink => {
        bot.sendMessage(msg.chat.id, `${newsLink.text}\n${newsLink.href}`);
      });
      break;
    case '/publish':
      console.log(msg, meta)
      break;
    default:
      await bot.sendMessage(msg.chat.id, 'Invalid command');
  }
});
