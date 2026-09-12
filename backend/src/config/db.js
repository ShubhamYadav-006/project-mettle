const { Pool } = require('pg');
require('dotenv').config({ quiet: true });

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ FATAL ERROR: DATABASE_URL environment variable is missing.');
  process.exit(1);
}

// Normalize SSL query params for pg driver to avoid Node pg deprecation warnings
if (connectionString.includes('sslmode=require')) {
  connectionString = connectionString.replace('sslmode=require', 'sslmode=verify-full');
}

// Configure PostgreSQL connection pool for Neon serverless PostgreSQL
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.warn('⚠️ Idle PostgreSQL client notice:', err.message);
});

/**
 * Executes a parameterized query using pool with auto-retry for transient drops
 * @param {string} text - SQL Query string
 * @param {Array} params - Array of parameter values
 */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    if (err.message && err.message.includes('Connection terminated')) {
      return await pool.query(text, params);
    }
    throw err;
  }
};

module.exports = {
  pool,
  query,
};
