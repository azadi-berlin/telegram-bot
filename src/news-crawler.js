import puppeteer from 'puppeteer';
import { getLinkPreview } from 'link-preview-js';

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
        image: preview.images[0],
      };
    }));

    const formattedNews = newsListPopulated.map((news) => [
      `title: ${news.title}`,
      `link: ${news.link}`,
      `image: ${news.image}`,
      `date: ${new Date().toDateString()}`,
    ].join('\n'));

    return formattedNews.slice(0, 5);
  }

  static async publishToWebsite(message) {
    if (message.reply_to_message == null) {
      return 'reply to a news message';
    }

    console.log('publishing news...');
    console.log(message.reply_to_message.text);
    const [title, link, image, date] = message.reply_to_message.text.split('\n');


    return ['Publishing to the website... [Dry]', title, link, image, date].join('\n');
  }
}

