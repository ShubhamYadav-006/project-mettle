const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function runMigrations() {
  console.log('🔄 Executing PostgreSQL Database Migrations...');
  const schemaPath = path.join(__dirname, '../../schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Migration file not found at: ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');

  const client = await pool.connect();
  try {
    console.log('📡 Connected to Neon PostgreSQL.');
    await client.query(sql);
    console.log('✅ PostgreSQL Schema & Seed Data successfully applied!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
