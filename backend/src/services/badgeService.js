const { query } = require('../config/db');
const { logActivity } = require('./activityService');

/**
 * Check and unlock any eligible badges for the user
 */
const evaluateBadges = async (client, userId, stats) => {
  const { totalQuestsCompleted, level, currentStreak } = stats;

  // 1. Fetch unearned badges
  const unearnedResult = await client.query(
    `SELECT b.* FROM badges b
     WHERE b.id NOT IN (
       SELECT ub.badge_id FROM user_badges ub WHERE ub.user_id = $1
     )`,
    [userId]
  );

  const unearned = unearnedResult.rows;
  const newlyUnlocked = [];

  for (const badge of unearned) {
    let qualifies = false;

    if (badge.requirement_type === 'quests_completed' && totalQuestsCompleted >= badge.requirement_value) {
      qualifies = true;
    } else if (badge.requirement_type === 'level_reached' && level >= badge.requirement_value) {
      qualifies = true;
    } else if (badge.requirement_type === 'streak_days' && currentStreak >= badge.requirement_value) {
      qualifies = true;
    }

    if (qualifies) {
      await client.query(
        `INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [userId, badge.id]
      );
      newlyUnlocked.push(badge);

      // Log badge unlock activity
      await logActivity(client, {
        userId,
        eventType: 'BADGE_UNLOCKED',
        sourceId: badge.id,
        metadata: { badgeName: badge.name, description: badge.description },
      });
    }
  }

  return newlyUnlocked;
};

/**
 * Get all badges with unlocked status for a user
 */
const getUserBadges = async (userId) => {
  const result = await query(
    `SELECT b.*, 
            ub.unlocked_at,
            CASE WHEN ub.id IS NOT NULL THEN true ELSE false END AS is_unlocked
     FROM badges b
     LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = $1
     ORDER BY b.requirement_value ASC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  evaluateBadges,
  getUserBadges,
};
