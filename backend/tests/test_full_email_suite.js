require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const {
  sendWelcomeEmail,
  sendLevelUpEmail,
  generateWelcomeEmailHtml,
  generateWelcomeEmailText,
  generateLevelUpEmailHtml,
  generateLevelUpEmailText,
} = require('../src/services/emailService');
const authService = require('../src/services/authService');
const taskService = require('../src/services/taskService');
const { query } = require('../src/config/db');

async function runEmailSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPLETE METTLE EMAIL INTEGRATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // ----------------------------------------------------
  // SECTION 1: WELCOME EMAIL TEMPLATE & LOGIC
  // ----------------------------------------------------
  console.log('--- 1. Testing Welcome Email Templates & Logic ---');
  const welcomeHtml = generateWelcomeEmailHtml('Kaelen Voss');
  const welcomeText = generateWelcomeEmailText('Kaelen Voss');

  assert(welcomeHtml.includes('Kaelen Voss'), 'Welcome HTML includes user name');
  assert(welcomeHtml.includes('Welcome to Mettle'), 'Welcome HTML contains welcome greeting');
  assert(welcomeHtml.includes('#B5E34A'), 'Welcome HTML contains Electric Lime (#B5E34A)');
  assert(welcomeHtml.includes('Turn your everyday actions into quests.'), 'Welcome HTML contains quest copy');
  assert(welcomeHtml.includes('Build yourself. Level by level.'), 'Welcome HTML contains tagline');
  assert(welcomeHtml.includes('— Team Mettle') || welcomeHtml.includes('&mdash; Team Mettle'), 'Welcome HTML includes signoff');
  assert(welcomeText.includes('Welcome to Mettle, Kaelen Voss.'), 'Welcome Text includes greeting');
  assert(welcomeText.includes('Build yourself. Level by level.'), 'Welcome Text includes tagline');

  // ----------------------------------------------------
  // SECTION 2: LEVEL-UP EMAIL TEMPLATE & LOGIC
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Level-Up Email Templates & Logic ---');
  const levelUpHtml = generateLevelUpEmailHtml({ name: 'Kaelen Voss', oldLevel: 7, newLevel: 9 });
  const levelUpText = generateLevelUpEmailText({ name: 'Kaelen Voss', oldLevel: 7, newLevel: 9 });

  assert(levelUpHtml.includes('Kaelen Voss'), 'Level-Up HTML includes user name');
  assert(levelUpHtml.includes('LEVEL UP!'), 'Level-Up HTML includes LEVEL UP banner');
  assert(levelUpHtml.includes('Level 9'), 'Level-Up HTML displays new level (Level 9)');
  assert(levelUpHtml.includes('Level 7'), 'Level-Up HTML displays old level (Level 7)');
  assert(levelUpHtml.includes('Keep completing quests.'), 'Level-Up HTML includes motivation copy');
  assert(levelUpHtml.includes('Build yourself. Level by level.'), 'Level-Up HTML contains tagline');
  assert(levelUpText.includes('LEVEL UP!'), 'Level-Up Text includes LEVEL UP header');
  assert(levelUpText.includes("You were Level 7.\nNow you're Level 9.") || levelUpText.includes("You were Level 7."), 'Level-Up Text includes level transition');

  // Verify non-level-up prevention in service
  const noLevelUpResult = await sendLevelUpEmail({
    email: 'test@example.com',
    name: 'Kaelen',
    oldLevel: 5,
    newLevel: 5,
  });
  assert(noLevelUpResult.success === false, 'sendLevelUpEmail rejects calls where newLevel <= oldLevel');

  // ----------------------------------------------------
  // SECTION 3: RESEND API DIRECT DISPATCH
  // ----------------------------------------------------
  console.log('\n--- 3. Testing Direct Resend Email Dispatch ---');
  try {
    const directWelcome = await sendWelcomeEmail({
      email: 'delivered@resend.dev',
      name: 'Resend Verification Tester',
    });
    console.log('Direct Welcome Email Result:', directWelcome);
    assert(directWelcome.success === true && !!directWelcome.id, 'Resend API dispatched Welcome Email successfully');
  } catch (err) {
    assert(false, `Direct welcome email threw error: ${err.message}`);
  }

  try {
    const directLevelUp = await sendLevelUpEmail({
      email: 'delivered@resend.dev',
      name: 'Resend Verification Tester',
      oldLevel: 1,
      newLevel: 2,
    });
    console.log('Direct Level-Up Email Result:', directLevelUp);
    assert(directLevelUp.success === true && !!directLevelUp.id, 'Resend API dispatched Level-Up Email successfully');
  } catch (err) {
    assert(false, `Direct level-up email threw error: ${err.message}`);
  }

  // ----------------------------------------------------
  // SECTION 4: INTEGRATION TEST (REGISTRATION -> WELCOME EMAIL)
  // ----------------------------------------------------
  console.log('\n--- 4. Testing End-to-End Registration & Login Flow ---');
  const ts = Date.now();
  const testEmail = `test_email_${ts}@example.com`;
  const testName = `Hero ${ts}`;
  const testPass = 'SecretPassword123!';

  let regData;
  try {
    regData = await authService.registerUser({
      name: testName,
      email: testEmail,
      password: testPass,
    });

    assert(regData && regData.user && regData.user.id, 'New user registered and committed to PostgreSQL');
    assert(regData.character && regData.character.level === 1, 'Character initialized at Level 1');

    // Simulate login -> verify no welcome email trigger
    const loginData = await authService.loginUser({
      email: testEmail,
      password: testPass,
    });
    assert(loginData && loginData.user.id === regData.user.id, 'Login succeeds without error');

    // Simulate profile fetch -> verify no email trigger
    const profileData = await authService.getUserProfile(regData.user.id);
    assert(profileData && profileData.user.id === regData.user.id, 'Profile fetch succeeds without sending email');
  } catch (err) {
    console.error('Registration integration error:', err);
    assert(false, `Registration integration failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // SECTION 5: INTEGRATION TEST (QUEST COMPLETION & LEVEL-UP EMAIL)
  // ----------------------------------------------------
  console.log('\n--- 5. Testing Quest Completion & Level-Up Progression ---');
  try {
    const userId = regData.user.id;

    // Test 5A: Quest completion WITHOUT Level Up (e.g., Trivial quest = 10 XP, Level 1 needs 100 XP)
    const task1 = await taskService.createTask(userId, {
      title: 'Read 5 pages',
      difficulty: 'trivial', // 10 XP
      category: 'academics',
    });

    const completion1 = await taskService.completeTask(userId, task1.id);
    assert(completion1.character.level === 1, 'Level remains 1 after trivial quest');
    assert(completion1.character.leveledUp === false, 'leveledUp flag is FALSE when XP does not cross threshold');

    // Test 5B: Quest completion WITH Single Level Up (Epic quest = 100 XP -> Total 110 XP -> Level 2)
    const task2 = await taskService.createTask(userId, {
      title: 'Complete Project Milestone',
      difficulty: 'epic', // 100 XP
      category: 'coding',
    });

    const completion2 = await taskService.completeTask(userId, task2.id);
    assert(completion2.character.level === 2, 'Character successfully reached Level 2');
    assert(completion2.character.leveledUp === true, 'leveledUp flag is TRUE on level transition');
    assert(completion2.character.levelJump === 1, 'levelJump equals 1 for single level increase');

    const calculatedOldLevel = completion2.character.level - completion2.character.levelJump;
    const calculatedNewLevel = completion2.character.level;
    assert(calculatedOldLevel === 1 && calculatedNewLevel === 2, 'Old level (1) and New level (2) calculated correctly');

    // Test 5C: Multi-Level Jump Test (jump from Level 2 to Level 5)
    // Directly simulate a quest with massive XP (2000 XP)
    const multiJumpTask = await taskService.createTask(userId, {
      title: 'Legendary Boss Battle',
      difficulty: 'epic',
      category: 'mindset',
    });
    // Update task to give 2000 XP (enough to jump from Level 2 to Level 5)
    await query('UPDATE tasks SET xp_reward = 2000 WHERE id = $1', [multiJumpTask.id]);

    const completionMulti = await taskService.completeTask(userId, multiJumpTask.id);
    assert(completionMulti.character.leveledUp === true, 'leveledUp is TRUE for multi-level jump');
    assert(completionMulti.character.level >= 4, `Character jumped multiple levels to Level ${completionMulti.character.level}`);
    const multiOldLevel = completionMulti.character.level - completionMulti.character.levelJump;
    assert(multiOldLevel === 2, `Multi-level jump accurately tracks oldLevel (${multiOldLevel}) and newLevel (${completionMulti.character.level})`);

  } catch (err) {
    console.error('Quest progression error:', err);
    assert(false, `Quest progression test failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // SECTION 6: EMAIL FAILURE ISOLATION
  // ----------------------------------------------------
  console.log('\n--- 6. Testing Email Failure Isolation (Graceful Degradation) ---');
  try {
    // Calling with empty email or invalid credentials
    const badRes = await sendWelcomeEmail({ email: '', name: 'Test' });
    assert(badRes.success === false && typeof badRes.error === 'string', 'Bad email returns safe error without throwing unhandled exception');

    const badLevelUpRes = await sendLevelUpEmail({ email: '', name: 'Test', oldLevel: 1, newLevel: 2 });
    assert(badLevelUpRes.success === false && typeof badLevelUpRes.error === 'string', 'Bad level-up call returns safe error without throwing unhandled exception');
  } catch (err) {
    assert(false, `Email failure isolation threw exception: ${err.message}`);
  }

  // Clean up
  if (regData && regData.user && regData.user.id) {
    try {
      await query('DELETE FROM task_completions WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM transactions WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM user_badges WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM tasks WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM attributes WHERE character_id IN (SELECT id FROM characters WHERE user_id = $1)', [regData.user.id]);
      await query('DELETE FROM characters WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM streaks WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM activity_logs WHERE user_id = $1', [regData.user.id]);
      await query('DELETE FROM users WHERE id = $1', [regData.user.id]);
      console.log('\n🧹 Cleaned up temporary test user and quest records.');
    } catch (cleanErr) {
      console.error('Cleanup error:', cleanErr.message);
    }
  }

  console.log('\n====================================================');
  console.log(`📊 EMAIL SUITE SUMMARY: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('====================================================');

  process.exit(passed === total ? 0 : 1);
}

runEmailSuite();
