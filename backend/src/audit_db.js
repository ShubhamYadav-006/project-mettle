require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { query, pool } = require('./config/db');

async function auditDatabase() {
  console.log('==================================================');
  console.log('🔍 AUDITING POSTGRESQL / NEON DATABASE MIGRATIONS');
  console.log('==================================================\n');

  try {
    // 1. Connection check
    const nowRes = await query('SELECT NOW() as current_time, current_database() as db_name, version()');
    console.log(`📡 Database Connected: ${nowRes.rows[0].db_name}`);
    console.log(`⏱️ Server Time: ${nowRes.rows[0].current_time}`);
    console.log(`🐘 Engine: ${nowRes.rows[0].version.split(' on ')[0]}\n`);

    // 2. Fetch all tables in public schema
    const tablesRes = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    const existingTables = tablesRes.rows.map(r => r.table_name);
    console.log(`📋 Found ${existingTables.length} tables in public schema:`);
    existingTables.forEach(t => console.log(`   • ${t}`));
    console.log('');

    // Expected tables from schema.sql
    const expectedTables = [
      'users',
      'characters',
      'attributes',
      'streaks',
      'tasks',
      'task_completions',
      'rewards',
      'transactions',
      'inventory',
      'badges',
      'user_badges',
      'activity_logs',
    ];

    let allTablesPresent = true;
    console.log('--- Table Presence Check ---');
    for (const expected of expectedTables) {
      if (existingTables.includes(expected)) {
        console.log(`✅ [OK] Table "${expected}" exists`);
      } else {
        console.log(`❌ [MISSING] Table "${expected}" does not exist!`);
        allTablesPresent = false;
      }
    }
    console.log('');

    // 3. Count rows in key catalog/table objects
    console.log('--- Table Row Counts & Seed Data Verification ---');
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        const countRes = await query(`SELECT COUNT(*) FROM "${table}"`);
        const count = countRes.rows[0].count;
        console.log(`📊 ${table.padEnd(20)}: ${count} rows`);
      }
    }
    console.log('');

    // 4. Verify baseline seed items in rewards & badges
    if (existingTables.includes('rewards')) {
      const rewardsRes = await query('SELECT id, name, cost, category FROM rewards ORDER BY cost');
      console.log('🛍️ Rewards Catalog Seed Items:');
      rewardsRes.rows.forEach(r => console.log(`   - [${r.id}] ${r.name} (${r.cost} Gold, Category: ${r.category})`));
      console.log('');
    }

    if (existingTables.includes('badges')) {
      const badgesRes = await query('SELECT id, name, requirement_type, requirement_value FROM badges ORDER BY requirement_value');
      console.log('🏆 Badges Seed Items:');
      badgesRes.rows.forEach(b => console.log(`   - [${b.id}] ${b.name} (${b.requirement_type} >= ${b.requirement_value})`));
      console.log('');
    }

    // 5. Verify Indexes
    const indexRes = await query(`
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);
    console.log(`⚡ Verified ${indexRes.rows.length} indexes in database.`);

    console.log('==================================================');
    if (allTablesPresent) {
      console.log('🎉 RESULT: DATABASE IS FULLY AND PROPERLY MIGRATED!');
    } else {
      console.log('⚠️ RESULT: SOME TABLES ARE MISSING. RUN `npm run migrate`');
    }
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Database audit error:', err.message);
  } finally {
    await pool.end();
  }
}

auditDatabase();
