const mysql = require("mysql2/promise");

function getDatabaseConfig() {
  // Hosted providers may supply a mysql:// connection URL. Parse it so TLS
  // can be enabled explicitly without storing credentials in source control.
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

  const useSsl = process.env.DB_SSL === "true";
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "jimbaran_hub",
    // Enzonic requires TLS; local XAMPP can continue using DB_SSL=false.
    ssl: useSsl ? { minVersion: "TLSv1.2" } : undefined
  };
}

const pool = mysql.createPool({
  ...getDatabaseConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z"
});

module.exports = pool;
