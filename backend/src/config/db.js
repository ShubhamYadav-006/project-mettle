const { Pool } = require('pg');
require('dotenv').config({ quiet: true });

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ FATAL ERROR: DATABASE_URL environment variable is missing.');
  process.exit(1);
}

// Normalize SSL and connection params for pg driver with Neon serverless PostgreSQL
if (connectionString.includes('sslmode=require')) {
  connectionString = connectionString.replace('sslmode=require', 'sslmode=verify-full');
}
// Strip channel_binding parameter as pg driver does not support SCRAM channel binding on Node
connectionString = connectionString.replace(/[?&]channel_binding=[^&]+/g, (match) => match.startsWith('?') ? '?' : '');
if (connectionString.endsWith('?') || connectionString.endsWith('&')) {
  connectionString = connectionString.slice(0, -1);
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
    if (err.message && (err.message.includes('Connection terminated') || err.message.includes('connection timeout'))) {
      // Allow brief backoff for Neon serverless pool reconnection
      await new Promise((resolve) => setTimeout(resolve, 200));
      return await pool.query(text, params);
    }
    throw err;
  }
};

module.exports = {
  pool,
  query,
};
