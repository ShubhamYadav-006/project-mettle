const { query } = require('../config/db');

/**
 * Log an Activity Event into the immutable activity_logs table
 */
const logActivity = async (clientOrPool, { userId, eventType, sourceId = null, amount = null, metadata = {} }) => {
  const runner = clientOrPool || { query };
  try {
    await runner.query(
      `INSERT INTO activity_logs (user_id, event_type, source_id, amount, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, eventType, sourceId, amount, JSON.stringify(metadata)]
    );
  } catch (err) {
    console.error('Failed to log activity event:', err.message);
  }
};

/**
 * Get Activity Logs for User
 */
const getUserActivityLogs = async (userId, limit = 50) => {
  const result = await query(
    `SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

module.exports = {
  logActivity,
  getUserActivityLogs,
};
