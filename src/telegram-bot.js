import TelegramBot from 'node-telegram-bot-api';
import { NewsCrawler } from './news-crawler.js';
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
      const newsList = await NewsCrawler.crawlNewsNow();
      for (const news of newsList) {
        await bot.sendMessage(msg.chat.id, news);
      }
      break;
    case '/publish':
      const news = await NewsCrawler.publishToWebsite(msg)
      await bot.sendMessage(msg.chat.id, news);
      break;
    default:
      await bot.sendMessage(msg.chat.id, 'Invalid command');
  }
});
