require('dotenv').config();
const { query } = require('../src/config/db');

async function cleanTestData() {
  console.log('Cleaning test users and associated test data...');
  
  const testEmails = [
    'judge_%',
    'proxy_%',
    'user_%',
    'google_user_%',
    'link_test_%',
    '%@mettle.app'
  ];
  
  const conditions = testEmails.map((_, i) => `email LIKE $${i + 1}`).join(' OR ');
  const deleteResult = await query(
    `DELETE FROM users WHERE ${conditions} RETURNING id, email, name;`,
    testEmails
  );
  
  console.log(`Successfully deleted ${deleteResult.rowCount} test accounts:`);
  console.table(deleteResult.rows);

  const remaining = await query('SELECT id, email, name, google_id, created_at FROM users;');
  console.log('Remaining active users in database:');
  console.table(remaining.rows);

  process.exit(0);
}

cleanTestData().catch(err => {
  console.error('Failed to clean test data:', err);
  process.exit(1);
});
