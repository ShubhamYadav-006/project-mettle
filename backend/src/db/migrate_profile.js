const { pool } = require('../config/db');

async function migrateProfileColumns() {
  console.log('🔄 Applying Profile Columns Migration to Neon PostgreSQL...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Add columns if not exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username VARCHAR(50),
      ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
    `);

    // 2. Set default usernames for any users without one (based on email or name)
    const usersWithoutUsername = await client.query(`
      SELECT id, name, email FROM users WHERE username IS NULL OR username = '';
    `);

    for (const u of usersWithoutUsername.rows) {
      let baseUsername = (u.email ? u.email.split('@')[0] : u.name)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 30);
      
      if (!baseUsername || baseUsername.length < 3) {
        baseUsername = `user_${u.id.slice(0, 6)}`;
      }

      // Ensure uniqueness
      let candidate = baseUsername;
      let counter = 1;
      while (true) {
        const check = await client.query(
          `SELECT id FROM users WHERE LOWER(username) = $1 AND id != $2`,
          [candidate.toLowerCase(), u.id]
        );
        if (check.rows.length === 0) {
          break;
        }
        candidate = `${baseUsername}_${counter++}`;
      }

      await client.query(
        `UPDATE users SET username = $1 WHERE id = $2`,
        [candidate, u.id]
      );
    }

    // 3. Create Unique Index on lower(username)
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower 
      ON users (LOWER(username)) 
      WHERE username IS NOT NULL;
    `);

    await client.query('COMMIT');
    console.log('✅ Profile Columns Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateProfileColumns();
