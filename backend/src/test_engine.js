const { calculateLevel, getXpForLevel, getLevelProgress, getTitleForLevel, DIFFICULTY_REWARDS } = require('./utils/levelMath');
const assert = require('assert');

console.log('=== TEST 1: NON-LINEAR LEVELING MATH ===');

// Check Level thresholds
const lvl1Base = getXpForLevel(1); // 0
const lvl2Base = getXpForLevel(2); // 250
const lvl3Base = getXpForLevel(3); // 707
const lvl4Base = getXpForLevel(4); // 1299
const lvl5Base = getXpForLevel(5); // 2000
const lvl10Base = getXpForLevel(10); // 6750

assert.strictEqual(lvl1Base, 0, 'Level 1 Base XP must be 0');
assert.strictEqual(lvl2Base, 250, 'Level 2 Base XP must be 250');
assert.strictEqual(lvl3Base, 707, 'Level 3 Base XP must be 707');
assert.strictEqual(lvl4Base, 1299, 'Level 4 Base XP must be 1299');
assert.strictEqual(lvl5Base, 2000, 'Level 5 Base XP must be 2000');
assert.strictEqual(lvl10Base, 6750, 'Level 10 Base XP must be 6750');

console.log('✓ getXpForLevel thresholds verified');

// Test calculateLevel mapping
assert.strictEqual(calculateLevel(0), 1);
assert.strictEqual(calculateLevel(50), 1);
assert.strictEqual(calculateLevel(249), 1);
assert.strictEqual(calculateLevel(250), 2);
assert.strictEqual(calculateLevel(400), 2);
assert.strictEqual(calculateLevel(706), 2);
assert.strictEqual(calculateLevel(707), 3);
assert.strictEqual(calculateLevel(1298), 3);
assert.strictEqual(calculateLevel(1299), 4);
assert.strictEqual(calculateLevel(2000), 5);
assert.strictEqual(calculateLevel(6750), 10);

console.log('✓ calculateLevel verified for all boundary values without float drift');

// Test Level Progress Object
const p1 = getLevelProgress(300);
assert.strictEqual(p1.currentLevel, 2);
assert.strictEqual(p1.currentLevelBaseXp, 250);
assert.strictEqual(p1.nextLevelBaseXp, 707);
assert.strictEqual(p1.xpInCurrentTier, 50);
assert.strictEqual(p1.xpRequiredForNextLevel, 457);
assert.strictEqual(p1.progressPercent, Math.round((50 / 457) * 100));

console.log('✓ getLevelProgress calculation verified:', p1);

// Test Difficulty Rewards
assert.strictEqual(DIFFICULTY_REWARDS.trivial.xp, 15);
assert.strictEqual(DIFFICULTY_REWARDS.easy.xp, 30);
assert.strictEqual(DIFFICULTY_REWARDS.medium.xp, 60);
assert.strictEqual(DIFFICULTY_REWARDS.hard.xp, 120);
assert.strictEqual(DIFFICULTY_REWARDS.epic.xp, 250);

console.log('✓ DIFFICULTY_REWARDS verified');

console.log('=== ALL PROGRESSION ENGINE UNIT TESTS PASSED ===');
