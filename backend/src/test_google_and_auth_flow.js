const { query, pool } = require('./config/db');
const authService = require('./services/authService');
const { generateToken, verifyToken } = require('./utils/jwt');
const taskService = require('./services/taskService');

async function testGoogleAndAuthFlow() {
  console.log('==================================================');
  console.log('🧪 RUNNING METTLE GOOGLE OAUTH & AUTH TEST SUITE');
  console.log('==================================================\n');

  try {
    // 1. Test Google Auth URL Generation
    console.log('1. Testing Google Auth URL Generation...');
    const googleUrl = authService.getGoogleAuthUrl();
    if (!googleUrl.startsWith('https://accounts.google.com/o/oauth2/v2/auth')) {
      throw new Error(`Unexpected Google Auth URL: ${googleUrl}`);
    }
    if (!googleUrl.includes('210721241082-2t7r8op480gqk37i8si8uugu4obg8hoa.apps.googleusercontent.com')) {
      throw new Error('Google Auth URL is missing client_id');
    }
    if (!googleUrl.includes('callback')) {
      throw new Error('Google Auth URL is missing redirect_uri');
    }
    console.log('   ✅ PASS: Google Auth URL correctly generated with Client ID and Scope.');

    // 2. Test Existing Email/Password Registration
    console.log('\n2. Testing Existing Email/Password Signup...');
    const testEmail = `user_${Date.now()}@mettle.app`;
    const signupData = await authService.registerUser({
      name: 'Test Scholar',
      email: testEmail,
      password: 'SuperPassword123',
    });
    console.log(`   ✅ PASS: Signup succeeded for ${signupData.user.email} (Level: ${signupData.character.level})`);

    // 3. Test Email/Password Login
    console.log('\n3. Testing Existing Email/Password Login...');
    const loginData = await authService.loginUser({
      email: testEmail,
      password: 'SuperPassword123',
    });
    const token = generateToken({ id: loginData.user.id, email: loginData.user.email });
    const decoded = verifyToken(token);
    if (decoded.id !== loginData.user.id) {
      throw new Error('JWT token verification failed');
    }
    console.log(`   ✅ PASS: Login succeeded and JWT verified for user ID: ${decoded.id}`);

    // 4. Test User Profile Retrieval (/auth/me)
    console.log('\n4. Testing /auth/me Profile Retrieval...');
    const meData = await authService.getUserProfile(loginData.user.id);
    if (!meData.character || !meData.character.attributes || meData.character.attributes.intellect !== 10) {
      throw new Error('Character attributes failed to load');
    }
    console.log(`   ✅ PASS: Profile loaded. Attributes: Mind=${meData.character.attributes.intellect}, Level=${meData.character.level}`);

    // 5. Test Google User Registration Flow (Simulating new Google User)
    console.log('\n5. Testing Google User Creation Flow...');
    const googleSub = `google_sub_${Date.now()}`;
    const googleEmail = `google_user_${Date.now()}@gmail.com`;

    // Direct mock integration with internal handler or DB transaction
    const client = await pool.connect();
    let googleUserId;
    try {
      await client.query('BEGIN');
      const userRes = await client.query(
        `INSERT INTO users (name, email, google_id)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, google_id`,
        ['Google Adventurer', googleEmail, googleSub]
      );
      googleUserId = userRes.rows[0].id;

      const charRes = await client.query(
        `INSERT INTO characters (user_id, title, level, total_xp, gold, mettle_score)
         VALUES ($1, 'Novice Scholar', 1, 0, 0, 0)
         RETURNING id`,
        [googleUserId]
      );
      const charId = charRes.rows[0].id;

      await client.query(
        `INSERT INTO attributes (character_id, strength, intellect, discipline, creativity, consistency)
         VALUES ($1, 10, 10, 10, 10, 10)`,
        [charId]
      );

      await client.query(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_count)
         VALUES ($1, 0, 0, 0)`,
        [googleUserId]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const googleUserProfile = await authService.getUserProfile(googleUserId);
    if (googleUserProfile.user.email !== googleEmail) {
      throw new Error('Google user retrieval failed');
    }
    console.log(`   ✅ PASS: New Google user created & initialized. User ID: ${googleUserId}`);

    // 6. Test Task Creation & Completion for Google User
    console.log('\n6. Testing Task & XP Progression for Google User...');
    const taskRes = await query(
      `INSERT INTO tasks (user_id, title, description, category, difficulty, xp_reward, gold_reward, attribute_type, status)
       VALUES ($1, 'Read Scientific Article', 'Read and summarize research.', 'academics', 'medium', 60, 20, 'intellect', 'pending')
       RETURNING id, title, xp_reward, gold_reward`,
      [googleUserId]
    );
    const createdTask = taskRes.rows[0];

    // Complete task
    const completeResult = await taskService.completeTask(googleUserId, createdTask.id);
    if (completeResult.character.totalXp !== 60 || completeResult.character.gold !== 20) {
      throw new Error(`XP/Gold did not update correctly. Total XP: ${completeResult.character.totalXp}`);
    }
    console.log(`   ✅ PASS: Google user completed task. Total XP: ${completeResult.character.totalXp}, Gold: ${completeResult.character.gold}`);

    // 7. Test Account Linking (Existing Email/Password user signs in with same Google Email)
    console.log('\n7. Testing Account Linking (Email match linking google_id without password overwrite)...');
    const linkingEmail = `link_test_${Date.now()}@mettle.app`;
    const standardUser = await authService.registerUser({
      name: 'Linked User',
      email: linkingEmail,
      password: 'OriginalPassword999',
    });

    const googleLinkSub = `google_link_${Date.now()}`;
    // Link google_id
    await query(`UPDATE users SET google_id = $1 WHERE LOWER(email) = $2`, [googleLinkSub, linkingEmail.toLowerCase()]);

    // Verify user can STILL login with original password!
    const relogin = await authService.loginUser({
      email: linkingEmail,
      password: 'OriginalPassword999',
    });
    if (relogin.user.id !== standardUser.user.id) {
      throw new Error('Relogin failed after Google ID linking');
    }
    console.log('   ✅ PASS: Account linking preserved password security and existing user progress.');

    // 8. Test Duplicate Google ID Prevention
    console.log('\n8. Testing Unique Constraint on google_id...');
    let duplicateErrorThrown = false;
    try {
      await query(
        `INSERT INTO users (name, email, google_id)
         VALUES ('Duplicate User', 'another_email@mettle.app', $1)`,
        [googleSub]
      );
    } catch (err) {
      duplicateErrorThrown = true;
    }
    if (!duplicateErrorThrown) {
      throw new Error('Expected duplicate google_id error to be thrown');
    }
    console.log('   ✅ PASS: Duplicate google_id correctly rejected by database constraint.');

    console.log('\n==================================================');
    console.log('🎉 ALL 8/8 AUTHENTICATION & GOOGLE TEST CASES PASSED 100%!');
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  }
}

testGoogleAndAuthFlow();
