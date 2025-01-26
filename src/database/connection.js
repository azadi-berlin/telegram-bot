import mysql from 'mysql2/promise';
import { config } from '../config.js';

const connection = await mysql.createConnection({
  host: config.database.host,
  port: config.database.port,
  password: config.database.password,
  user: config.database.user,
  database: config.database.database,
});

await connection.connect();

process.on('SIGINT', () => {
  connection.end();
});

export default connection;
