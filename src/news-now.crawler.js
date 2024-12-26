import puppeteer from 'puppeteer';

export class NewsNowCrawler {
  static async crawl() {
    console.log('crawling newsnow.co.uk...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto('https://www.newsnow.co.uk/h/World+News/Middle+East/Iran?type=ln');

    const links = await page.$$eval('a', as => as.map(a => ({
      link: a.href,
      title: a.innerText
    })));
    const news = links.filter(link => link.href?.startsWith('https://c.newsnow.co.uk/A/'))

    await browser.close();

    return news.slice(0, 3);
  }
}

