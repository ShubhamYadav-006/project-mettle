require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { registerUser, loginUser, getUserProfile } = require('../src/services/authService');
const { createTask, getUserTasks, completeTask, getTaskHistory } = require('../src/services/taskService');
const { getRewardsCatalog, getUserInventory, purchaseReward, equipItem } = require('../src/services/rewardService');
const { getUserBadges } = require('../src/services/badgeService');
const { getUserActivityLogs } = require('../src/services/activityService');
const assert = require('assert');

async function runFullIntegrationTest() {
  console.log('==================================================');
  console.log('🧪 RUNNING FULL INTEGRATION & PERSISTENCE TEST');
  console.log('==================================================');

  const testEmail = `judge_test_${Date.now()}@mettle.app`;
  const testPassword = 'Password123!';
  const testName = 'Alex Judge';

  // STEP 1: Registration
  console.log('1. Testing User Registration & RPG Initialization...');
  const regResult = await registerUser({ name: testName, email: testEmail, password: testPassword });
  const userId = regResult.user.id;
  assert.ok(userId, 'User ID must be generated');
  assert.strictEqual(regResult.character.level, 1, 'Initial level must be 1');
  assert.strictEqual(regResult.character.totalXp, 0, 'Initial XP must be 0');
  console.log('✓ Registered test user:', testEmail, 'User ID:', userId);

  // STEP 2: Initial State Verification (Clean Slate, Day 1 Streak)
  console.log('2. Verifying Clean Slate Quests & Day 1 Streak...');
  assert.strictEqual(regResult.character.streaks.currentStreak, 1, 'Initial Day 1 streak must be 1');
  const initialTasks = await getUserTasks(userId, 'pending');
  assert.strictEqual(initialTasks.length, 0, 'No auto-suggested starter quests (clean slate)');
  console.log('✓ Clean slate verified: 0 auto quests, Streak = 1 Day');

  // STEP 3: Create Custom Quest
  console.log('3. Testing Quest Creation (Medium & Epic Tiers)...');
  const quest1 = await createTask(userId, {
    title: 'Daily Deep Focus Session',
    description: 'Solve problems and build project.',
    category: 'academics',
    difficulty: 'medium',
    attributeType: 'intellect',
  });
  const createdQuest = await createTask(userId, {
    title: 'Complete Hackathon Full Implementation',
    description: 'Implement frontend, backend, database, and game engine.',
    category: 'coding',
    difficulty: 'epic',
    attributeType: 'intellect',
  });
  assert.strictEqual(createdQuest.xp_reward, 250, 'Epic quest must award 250 XP');
  assert.strictEqual(createdQuest.gold_reward, 100, 'Epic quest must award 100 Gold');
  console.log('✓ Custom quests created successfully.');

  // STEP 4: Complete Quest 1
  console.log('4. Completing Quest 1 (Medium - 60 XP, 20 Gold)...');
  const comp1 = await completeTask(userId, quest1.id);
  assert.strictEqual(comp1.character.totalXp, 60, 'Total XP should be 60');
  assert.strictEqual(comp1.character.gold, 20, 'Gold should be 20');
  assert.strictEqual(comp1.character.streaks.currentStreak, 1, 'Streak should remain 1 on Day 1');
  console.log('✓ Quest 1 completed. Total XP:', comp1.character.totalXp, 'Gold:', comp1.character.gold);

  // STEP 5: Complete Epic Quest -> Trigger Non-linear Level-Up
  console.log('5. Completing Epic Quest (250 XP) -> Should Level Up from 1 to 2/3...');
  const comp2 = await completeTask(userId, createdQuest.id);
  assert.strictEqual(comp2.character.totalXp, 310, 'Total XP should be 60 + 250 = 310');
  assert.ok(comp2.character.leveledUp, 'Should detect level-up');
  assert.ok(comp2.character.level >= 2, 'Level should be at least 2');
  console.log('✓ Level Up detected! New Level:', comp2.character.level, 'Title:', comp2.character.title, 'Total XP:', comp2.character.totalXp, 'Gold (incl. Bonus):', comp2.character.gold);

  // STEP 6: Anti-Cheat Check - Duplicate completion rejection
  console.log('6. Anti-Cheat Check: Attempting to complete already completed quest...');
  try {
    await completeTask(userId, createdQuest.id);
    assert.fail('Duplicate completion must be rejected');
  } catch (err) {
    assert.strictEqual(err.statusCode, 400, 'Must return 400 Bad Request');
    console.log('✓ Duplicate completion correctly rejected with 400 error:', err.message);
  }

  // STEP 7: Rewards Catalog & Purchase
  console.log('7. Testing Reward Bazaar Catalog & Item Purchase...');
  const catalog = await getRewardsCatalog(userId);
  assert.ok(catalog.length > 0, 'Catalog must contain items');
  console.log('✓ Catalog items available:', catalog.length);

  const streakShield = catalog.find(i => i.id === 'item_streak_freeze');
  assert.ok(streakShield, 'Streak freeze shield item must exist');
  
  const currentGoldBeforeBuy = comp2.character.gold;
  const buyRes = await purchaseReward(userId, streakShield.id);
  assert.strictEqual(buyRes.remainingGold, currentGoldBeforeBuy - streakShield.cost, 'Gold must be accurately deducted');
  console.log('✓ Purchased Streak Freeze Shield. Remaining Gold:', buyRes.remainingGold);

  // STEP 8: Inventory Verification
  console.log('8. Verifying Inventory Ownership...');
  const inv = await getUserInventory(userId);
  assert.ok(inv.length > 0, 'Inventory must contain purchased item');
  console.log('✓ Inventory contains:', inv.map(i => `${i.name} (Qty: ${i.quantity})`));

  // STEP 9: Session Restoration & Persistence Verification
  console.log('9. Verifying Database Persistence across simulated session restore (/api/auth/me)...');
  const profile = await getUserProfile(userId);
  assert.strictEqual(profile.character.totalXp, 310, 'Persisted Total XP must be 310');
  assert.strictEqual(profile.character.level, comp2.character.level, 'Persisted Level must match');
  assert.strictEqual(profile.character.gold, buyRes.remainingGold, 'Persisted Gold must match');
  assert.strictEqual(profile.character.streaks.freezeCount, 1, 'Persisted Freeze Count must be 1');
  console.log('✓ Character profile fully restored from PostgreSQL database without any state loss');

  // STEP 10: Badges & Live Activity Audit Log
  console.log('10. Verifying Badge Unlocks & Live Audit Logs...');
  const badges = await getUserBadges(userId);
  const unlockedBadges = badges.filter(b => b.is_unlocked);
  const activities = await getUserActivityLogs(userId);
  console.log('✓ Badges unlocked:', unlockedBadges.map(b => b.name));
  console.log('✓ Activity logs recorded:', activities.length, 'events');

  console.log('==================================================');
  console.log('🎉 ALL FULL-STACK INTEGRATION TESTS PASSED 100%!');
  console.log('==================================================');
  process.exit(0);
}

runFullIntegrationTest().catch(err => {
  console.error('❌ Integration test failed:', err);
  process.exit(1);
});
