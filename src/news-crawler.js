import puppeteer from 'puppeteer';
import { getLinkPreview } from 'link-preview-js';
import { NewsDb } from './database/news.db.js';

export class NewsCrawler {
  static async crawlNewsNow() {
    console.log('crawling newsnow.co.uk...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();
    await page.goto('https://www.newsnow.co.uk/h/World+News/Middle+East/Iran?type=ln');

    const newsList = await page.$$eval('a', as => as
      .filter(elem => elem.href?.startsWith('https://c.newsnow.co.uk/A/'))
      .map(elem => ({
        title: elem.innerText,
        link: elem.href,
      })),
    );
    await browser.close();

    const newsListPopulated = await Promise.all(newsList.map(async (news) => {
      const preview = await getLinkPreview(news.link);
      return {
        ...news,
        summary: preview.description,
        image: preview.images[0],
        date: new Date().toISOString(),
      };
    }));

    const formattedNews = newsListPopulated.map(NewsCrawler.formatNews);

    return formattedNews.slice(0, 5);
  }

  static async publishToWebsite(message) {
    if (message.reply_to_message == null) {
      return 'reply to a news message';
    }

    console.log('publishing news...');
    console.log(message.reply_to_message.text);
    const news = NewsCrawler.parseNews(message.reply_to_message.text);

    await NewsDb.saveNews(news).catch(console.error);

    return ['Saving news to the database...', NewsCrawler.formatNews(news)].join('\n');
  }

  static formatNews(news) {
    return JSON.stringify(news);
  }

  static parseNews(text) {
    return JSON.parse(text);
  }
}

