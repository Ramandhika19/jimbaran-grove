require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const pool = require("./src/config/db");
const api = require("./src/routes/api");

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.APP_URL || "http://localhost:3000").split(",").map(value => value.trim()).filter(Boolean);
app.use(cors({
  exposedHeaders: ["X-Data-Source"],
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

// Deployment health check: verifies the API process and MySQL connection.
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected", dataSource: "mysql", fallback: false });
  } catch (_err) {
    // Keep the Node.js API available; public GET endpoints serve hardcoded data.
    res.status(200).json({ status: "degraded", database: "disconnected", dataSource: "hardcode", fallback: true });
  }
});

app.use("/api", api);
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const port = Number(process.env.PORT || 3000);
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL connected");
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    console.log("Hardcoded fallback data is active for public read endpoints.");
  }
  app.listen(port, () => console.log(`Jimbaran Grove running on port ${port}`));
})();
