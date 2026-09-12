/**
 * Frontend Level Progression Utility
 * Level 1 to 2: 100 XP, then doubles each level
 */

export const getXpForLevel = (level) => {
  if (level <= 1) return 0;
  return 100 * Math.pow(2, level - 2);
};

export const calculateLevel = (totalXp) => {
  if (!totalXp || totalXp <= 0) return 1;
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
};

export const getLevelProgress = (totalXp) => {
  const currentXp = Number(totalXp) || 0;
  const currentLevel = calculateLevel(currentXp);
  const currentLevelBaseXp = getXpForLevel(currentLevel);
  const nextLevelBaseXp = getXpForLevel(currentLevel + 1);
  
  const xpInCurrentTier = Math.max(0, currentXp - currentLevelBaseXp);
  const xpRequiredForNextLevel = Math.max(1, nextLevelBaseXp - currentLevelBaseXp);
  const xpRemaining = Math.max(0, nextLevelBaseXp - currentXp);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentTier / xpRequiredForNextLevel) * 100)));

  return {
    currentLevel,
    currentLevelBaseXp,
    nextLevelBaseXp,
    xpInCurrentTier,
    xpRequiredForNextLevel,
    xpRemaining,
    progressPercent,
  };
};
