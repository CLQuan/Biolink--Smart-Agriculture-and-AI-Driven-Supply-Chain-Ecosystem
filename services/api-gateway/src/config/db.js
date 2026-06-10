// PostgreSQL connection pool. Lazily created so the app can boot without a DB
// (e.g. in CI smoke tests that only hit /health).
const { Pool } = require("pg");

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || "biolink",
      password: process.env.POSTGRES_PASSWORD || "biolink",
      database: process.env.POSTGRES_DB || "biolink",
    });
  }
  return pool;
}

module.exports = { getPool };
