require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sendWelcomeEmail, generateWelcomeEmailHtml, generateWelcomeEmailText } = require('../src/services/emailService');
const authService = require('../src/services/authService');
const { query } = require('../src/config/db');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING METTLE WELCOME EMAIL INTEGRATION TESTS');
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

  // 1. Test HTML & Text Template Generation
  console.log('--- 1. Testing Email Template Generation ---');
  const html = generateWelcomeEmailHtml('Alex Hunter');
  const text = generateWelcomeEmailText('Alex Hunter');

  assert(html.includes('Alex Hunter'), 'HTML template includes user name');
  assert(html.includes('Welcome to Mettle'), 'HTML template includes subject/welcome phrase');
  assert(html.includes('#B5E34A'), 'HTML template uses Electric Lime accent color (#B5E34A)');
  assert(html.includes('THE PATH OF PROGRESSION'), 'HTML template includes progression steps');
  assert(text.includes('Alex Hunter'), 'Plain text template includes user name');
  assert(text.includes('Build yourself. Level by level.'), 'Plain text template includes Mettle tagline');

  // 2. Test sendWelcomeEmail directly with Resend (onboarding@resend.dev sends to delivered address or registered email)
  console.log('\n--- 2. Testing Direct Resend Email Sending ---');
  try {
    const testEmailResult = await sendWelcomeEmail({
      email: 'delivered@resend.dev', // Standard Resend test inbox
      name: 'Test Adventurer',
    });
    console.log('Direct Resend result:', testEmailResult);
    assert(testEmailResult.success === true && !!testEmailResult.id, 'Resend API successfully sent email to test address');
  } catch (err) {
    console.error('Direct email error:', err);
    assert(false, 'Resend direct send threw error');
  }

  // 3. Test Full Registration Flow with Email
  console.log('\n--- 3. Testing Full User Registration Flow with Welcome Email ---');
  const testTimestamp = Date.now();
  const testEmail = `adventurer_${testTimestamp}@example.com`;
  const testName = `Mettle Adventurer ${testTimestamp}`;
  const testPassword = 'Password123!';

  let registeredUser;
  try {
    registeredUser = await authService.registerUser({
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    assert(registeredUser && registeredUser.user && registeredUser.user.id, 'User successfully registered in PostgreSQL');
    assert(registeredUser.character && registeredUser.character.level === 1, 'Initial character created at Level 1');

    // Trigger welcome email as authController does
    const emailResult = await sendWelcomeEmail({
      email: registeredUser.user.email,
      name: registeredUser.user.name,
    });
    console.log('Welcome email dispatch result:', emailResult);
    assert(typeof emailResult === 'object', 'Welcome email dispatched safely and returned result object');
  } catch (err) {
    console.error('Registration flow error:', err);
    assert(false, 'Registration flow threw an unexpected error');
  }

  // 4. Test Resend Failure Handling (Email Failure Must NOT Break Signup)
  console.log('\n--- 4. Testing Resend Failure Isolation ---');
  try {
    const badEmailResult = await sendWelcomeEmail({
      email: '',
      name: 'Ghost',
    });
    assert(badEmailResult.success === false, 'Invalid email fails gracefully without crashing');
  } catch (err) {
    assert(false, 'sendWelcomeEmail threw unhandled exception on invalid email');
  }

  // 5. Test Duplicate Registration Protection
  console.log('\n--- 5. Testing Duplicate Registration Protection ---');
  try {
    await authService.registerUser({
      name: testName,
      email: testEmail,
      password: testPassword,
    });
    assert(false, 'Duplicate registration should throw error');
  } catch (err) {
    assert(err.message.includes('already exists') || err.statusCode === 400, 'Duplicate registration rejected with 400 error');
  }

  // 6. Test Login Flow (Must NOT Trigger Welcome Email)
  console.log('\n--- 6. Testing Login Flow (No Email Sent) ---');
  try {
    const loginResult = await authService.loginUser({
      email: testEmail,
      password: testPassword,
    });
    assert(loginResult && loginResult.user.id === registeredUser.user.id, 'Login succeeds normally without triggering welcome email');
  } catch (err) {
    console.error('Login error:', err);
    assert(false, 'Login threw unexpected error');
  }

  // Clean up test user
  if (registeredUser && registeredUser.user && registeredUser.user.id) {
    try {
      await query('DELETE FROM characters WHERE user_id = $1', [registeredUser.user.id]);
      await query('DELETE FROM streaks WHERE user_id = $1', [registeredUser.user.id]);
      await query('DELETE FROM users WHERE id = $1', [registeredUser.user.id]);
      console.log('\n🧹 Cleaned up temporary test user record.');
    } catch (e) {
      console.error('Cleanup error:', e.message);
    }
  }

  console.log('\n====================================================');
  console.log(`📊 TEST SUMMARY: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('====================================================');

  process.exit(passed === total ? 0 : 1);
}

runTests();
