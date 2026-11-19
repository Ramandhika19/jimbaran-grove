const mysql = require("mysql2/promise");

// MySQL is optional during the demo phase. If no connection environment
// variables are supplied, do not attempt localhost or a remote connection;
// public read endpoints will use src/data/fallback.js instead.
const databaseConfigured = Boolean(process.env.DATABASE_URL || process.env.DB_HOST);

function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    if (url.protocol !== "mysql:") {
      throw new Error("DATABASE_URL must use the mysql:// protocol");
    }
    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.replace(/^\//, "")) || "main",
      ssl: { minVersion: "TLSv1.2" }
    };
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "main",
    ssl: process.env.DB_SSL === "true" ? { minVersion: "TLSv1.2" } : undefined
  };
}

const pool = databaseConfigured
  ? mysql.createPool({
      ...getDatabaseConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: "Z"
    })
  : {
      async query() {
        const error = new Error("Database is not configured; using hardcoded demo data.");
        error.code = "DB_NOT_CONFIGURED";
        throw error;
      }
    };

module.exports = pool;
