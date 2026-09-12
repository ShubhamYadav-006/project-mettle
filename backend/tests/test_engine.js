const { calculateLevel, getXpForLevel, getLevelProgress, getTitleForLevel, DIFFICULTY_REWARDS } = require('../src/utils/levelMath');
const assert = require('assert');

console.log('=== TEST 1: NON-LINEAR LEVELING MATH ===');

// Check Level thresholds
const lvl1Base = getXpForLevel(1); // 0
const lvl2Base = getXpForLevel(2); // 100
const lvl3Base = getXpForLevel(3); // 200
const lvl4Base = getXpForLevel(4); // 400
const lvl5Base = getXpForLevel(5); // 800
const lvl10Base = getXpForLevel(10); // 25600

assert.strictEqual(lvl1Base, 0, 'Level 1 Base XP must be 0');
assert.strictEqual(lvl2Base, 100, 'Level 2 Base XP must be 100');
assert.strictEqual(lvl3Base, 200, 'Level 3 Base XP must be 200');
assert.strictEqual(lvl4Base, 400, 'Level 4 Base XP must be 400');
assert.strictEqual(lvl5Base, 800, 'Level 5 Base XP must be 800');
assert.strictEqual(lvl10Base, 25600, 'Level 10 Base XP must be 25600');

console.log('✓ getXpForLevel thresholds verified');

// Test calculateLevel mapping
assert.strictEqual(calculateLevel(0), 1);
assert.strictEqual(calculateLevel(50), 1);
assert.strictEqual(calculateLevel(99), 1);
assert.strictEqual(calculateLevel(100), 2);
assert.strictEqual(calculateLevel(150), 2);
assert.strictEqual(calculateLevel(199), 2);
assert.strictEqual(calculateLevel(200), 3);
assert.strictEqual(calculateLevel(399), 3);
assert.strictEqual(calculateLevel(400), 4);
assert.strictEqual(calculateLevel(800), 5);
assert.strictEqual(calculateLevel(25600), 10);

console.log('✓ calculateLevel verified for all boundary values without float drift');

// Test Level Progress Object
const p1 = getLevelProgress(150);
assert.strictEqual(p1.currentLevel, 2);
assert.strictEqual(p1.currentLevelBaseXp, 100);
assert.strictEqual(p1.nextLevelBaseXp, 200);
assert.strictEqual(p1.xpInCurrentTier, 50);
assert.strictEqual(p1.xpRequiredForNextLevel, 100);
assert.strictEqual(p1.progressPercent, 50);

console.log('✓ getLevelProgress calculation verified:', p1);

// Test Difficulty Rewards
assert.strictEqual(DIFFICULTY_REWARDS.trivial.xp, 15);
assert.strictEqual(DIFFICULTY_REWARDS.easy.xp, 30);
assert.strictEqual(DIFFICULTY_REWARDS.medium.xp, 60);
assert.strictEqual(DIFFICULTY_REWARDS.hard.xp, 120);
assert.strictEqual(DIFFICULTY_REWARDS.epic.xp, 250);

console.log('✓ DIFFICULTY_REWARDS verified');

console.log('=== ALL PROGRESSION ENGINE UNIT TESTS PASSED ===');
