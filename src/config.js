import 'dotenv/config';

export const config = {
  puppeteer: {
    headless: process.env.PUPPETEER_HEADLESS === 'true',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN
  }
}