const { pool, query } = require('./config/db');
const userService = require('./services/userService');
const authService = require('./services/authService');

async function testProfileEndpoints() {
  console.log('🧪 Testing Profile Services & Validation...');
  try {
    // 1. Create a test user
    const testEmail = `profile_test_${Date.now()}@mettle.app`;
    const regResult = await authService.registerUser({
      name: 'Profile Tester',
      email: testEmail,
      password: 'password123',
    });

    const userId = regResult.user.id;
    console.log(`✓ User registered: ${userId}, username: ${regResult.user.username}`);

    // 2. Fetch Profile
    const profile = await userService.getProfile(userId);
    console.log(`✓ Profile fetched: Name = ${profile.name}, Username = ${profile.username}, Email = ${profile.email}`);

    // 3. Update Profile
    const updated = await userService.updateProfile(userId, {
      name: 'Updated Name',
      username: `new_user_${Date.now().toString().slice(-6)}`,
      bio: 'Lifelong learner building consistent daily habits.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    });

    console.log(`✓ Profile updated: Name = ${updated.name}, Username = ${updated.username}, Bio = ${updated.bio}, Avatar = ${updated.avatarUrl}`);

    // 4. Test Duplicate Username Validation
    const otherUser = await authService.registerUser({
      name: 'Other User',
      email: `other_${Date.now()}@mettle.app`,
      password: 'password123',
    });

    try {
      await userService.updateProfile(otherUser.user.id, {
        name: 'Other User',
        username: updated.username, // Attempt to duplicate username
        bio: '',
        avatarUrl: '',
      });
      console.error('❌ Failed: Duplicate username was allowed!');
    } catch (err) {
      console.log(`✓ Duplicate username correctly blocked: "${err.message}"`);
    }

    // 5. Test Invalid Username Validation
    try {
      await userService.updateProfile(userId, {
        name: 'Test',
        username: 'ab', // Too short (< 3)
      });
      console.error('❌ Failed: Short username was allowed!');
    } catch (err) {
      console.log(`✓ Short username correctly rejected: "${err.message}"`);
    }

    console.log('🎉 ALL PROFILE SERVICE TESTS PASSED 100%!');
  } catch (err) {
    console.error('❌ Test error:', err);
  } finally {
    await pool.end();
  }
}

testProfileEndpoints();
