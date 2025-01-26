import db from './connection.js';

export class NewsDb {
  static async getNews(limit) {
    const [rows] = await db.query(
      'SELECT * FROM news WHERE deleted_at IS NULL ORDER BY date DESC LIMIT ?',
      [limit],
    );

    return rows.map((row) => ({
      title: row.title,
      link: row.link,
      summary: row.summary,
      image: row.image,
      date: row.date,
    }));
  }

  static async saveNews(news) {
    console.log('saving news...', news);
    await db.query(
      'INSERT INTO news (title, link, summary, image, date) VALUES (?, ?, ?, ?, ?)',
      [news.title, news.link, news.summary, news.image, new Date(news.date)],
    );
  }

  static async archiveNews(link) {
    console.log('archiving news...', link);
    await db.query('UPDATE news SET deleted_at = CURRENT_TIMESTAMP WHERE link = ?', [link]);
  }
}
