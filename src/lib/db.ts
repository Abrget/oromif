import mysql, { Pool } from "mysql2/promise";

let pool: Pool | null = null;

export function getDb() {
  if (!pool) {
    const {
      MYSQL_HOST = "localhost",
      MYSQL_PORT = "3306",
      MYSQL_USER = "root",
      MYSQL_PASSWORD = "",
      MYSQL_DATABASE = "react_duolingo",
    } = process.env;

    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: Number(MYSQL_PORT),
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }
  return pool;
}

export async function ensureSchema() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      provider VARCHAR(20) NOT NULL DEFAULT 'local',
      provider_id VARCHAR(255) NULL,
      email VARCHAR(255) NULL UNIQUE,
      username VARCHAR(255) NULL UNIQUE,
      name VARCHAR(255) NULL,
      password_hash VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_provider_provider_id (provider, provider_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}
