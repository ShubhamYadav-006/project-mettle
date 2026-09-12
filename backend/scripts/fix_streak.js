require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { query, pool } = require('../src/config/db');

async function checkAndFixStreaks() {
  console.log('🔍 Checking streaks in database...');
  try {
    const res = await query(`
      SELECT u.id, u.name, u.email, u.created_at, 
             s.current_streak, s.longest_streak, s.last_activity_date, s.freeze_count,
             (SELECT COUNT(*) FROM task_completions tc WHERE tc.user_id = u.id) as total_completions,
             (SELECT COUNT(DISTINCT DATE(tc.completed_at)) FROM task_completions tc WHERE tc.user_id = u.id) as active_days
      FROM users u
      LEFT JOIN streaks s ON s.user_id = u.id
      ORDER BY u.created_at DESC;
    `);

    console.log('Users & Streaks:');
    for (const row of res.rows) {
      console.log(`User: ${row.name} (${row.email}) | current_streak: ${row.current_streak} | active_days: ${row.active_days} | total_completions: ${row.total_completions} | created: ${row.created_at}`);

      // If active_days <= 1, streak should accurately be 1 (or 0 if no completions)
      const correctStreak = Math.max(1, Number(row.active_days) || 1);
      if (row.current_streak > correctStreak) {
        console.log(`🔧 Correcting user ${row.name} streak from ${row.current_streak} to ${correctStreak}`);
        await query(
          `UPDATE streaks SET current_streak = $1, longest_streak = $1 WHERE user_id = $2`,
          [correctStreak, row.id]
        );
      }
    }

    console.log('✅ Streak audit and correction completed.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkAndFixStreaks();
