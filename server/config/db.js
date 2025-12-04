import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'rating_app',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
