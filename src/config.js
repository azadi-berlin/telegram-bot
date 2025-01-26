import 'dotenv/config';

export const config = {
  puppeteer: {
    headless: process.env.PUPPETEER_HEADLESS === 'true',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN
  },
  database: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE
  }
}