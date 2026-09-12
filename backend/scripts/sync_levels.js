require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { pool } = require('../src/config/db');
const { calculateLevel, getTitleForLevel } = require('../src/utils/levelMath');

async function syncAllLevels() {
  console.log('🔄 Recalculating character levels with updated progression curve...');
  const res = await pool.query('SELECT u.name, c.id, c.total_xp, c.level FROM characters c JOIN users u ON u.id = c.user_id');
  
  for (const c of res.rows) {
    const totalXp = Number(c.total_xp || 0);
    const newLevel = calculateLevel(totalXp);
    const newTitle = getTitleForLevel(newLevel);
    await pool.query(
      'UPDATE characters SET level = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newLevel, newTitle, c.id]
    );
    console.log(`User: ${c.name} | Total XP: ${totalXp} | Old Level: ${c.level} -> New Level: ${newLevel} (${newTitle})`);
  }

  console.log('✅ All character levels successfully synchronized!');
  await pool.end();
}

syncAllLevels().catch(err => {
  console.error('Error syncing levels:', err);
  process.exit(1);
});
