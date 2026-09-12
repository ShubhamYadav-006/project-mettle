/**
 * Level Progression Utility
 * Level 1 to 2: 100 XP (Shorter baseline)
 * Then doubles every level:
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 200 XP
 * Level 4: 400 XP
 * Level 5: 800 XP
 * Level 6: 1600 XP
 * Level 7: 3200 XP
 * Level 8: 6400 XP
 * Level 9: 12800 XP
 * Level 10: 25600 XP
 */

/**
 * Calculate Cumulative XP Required to Reach a Specific Level
 * @param {number} level - Target level (>= 1)
 * @returns {number} Total cumulative XP required
 */
const getXpForLevel = (level) => {
  if (level <= 1) return 0;
  return 100 * Math.pow(2, level - 2);
};

/**
 * Calculate Character Level from Cumulative Total XP
 * Monotonically matches getXpForLevel without floating point precision drift.
 * @param {number} totalXp - Cumulative Total XP
 * @returns {number} Current level (1+)
 */
const calculateLevel = (totalXp) => {
  if (!totalXp || totalXp <= 0) return 1;
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
};

/**
 * Get Level Progress details (current level, progress %, XP in current tier, XP needed for next level)
 * @param {number} totalXp - Cumulative Total XP
 */
const getLevelProgress = (totalXp) => {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelBaseXp = getXpForLevel(currentLevel);
  const nextLevelBaseXp = getXpForLevel(currentLevel + 1);
  
  const xpInCurrentTier = Math.max(0, totalXp - currentLevelBaseXp);
  const xpRequiredForNextLevel = Math.max(1, nextLevelBaseXp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentTier / xpRequiredForNextLevel) * 100)));

  return {
    currentLevel,
    currentLevelBaseXp,
    nextLevelBaseXp,
    xpInCurrentTier,
    xpRequiredForNextLevel,
    progressPercent,
    title: getTitleForLevel(currentLevel),
  };
};

/**
 * Assign Character Titles based on level milestones
 * @param {number} level - Current character level
 * @returns {string} RPG Title
 */
const getTitleForLevel = (level) => {
  if (level >= 20) return 'Grandmaster of Mettle';
  if (level >= 15) return 'Master Paragon';
  if (level >= 10) return 'Elite Vanguard';
  if (level >= 7)  return 'Adept Knight';
  if (level >= 5)  return 'Disciplined Practitioner';
  if (level >= 3)  return 'Apprentice Scholar';
  return 'Novice Scholar';
};

/**
 * Base Rewards Mapping by Difficulty Tier
 */
const DIFFICULTY_REWARDS = {
  trivial: { xp: 15, gold: 5, attributePoints: 1 },
  easy:    { xp: 30, gold: 10, attributePoints: 1 },
  medium:  { xp: 60, gold: 20, attributePoints: 1 },
  hard:    { xp: 120, gold: 45, attributePoints: 2 },
  epic:    { xp: 250, gold: 100, attributePoints: 3 },
};

module.exports = {
  calculateLevel,
  getXpForLevel,
  getLevelProgress,
  getTitleForLevel,
  DIFFICULTY_REWARDS,
};
