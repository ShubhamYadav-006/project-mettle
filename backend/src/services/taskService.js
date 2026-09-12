const { pool, query } = require('../config/db');
const { DIFFICULTY_REWARDS, calculateLevel, getLevelProgress, getTitleForLevel } = require('../utils/levelMath');
const { logActivity } = require('./activityService');
const { evaluateBadges } = require('./badgeService');

/**
 * Create a new Quest / Task
 */
const createTask = async (userId, data) => {
  const {
    title,
    description = '',
    category = 'academics',
    difficulty = 'medium',
    attributeType = 'intellect',
    dueDate = null,
    isRecurring = false,
    recurrencePattern = null,
  } = data;

  if (!title || !title.trim()) {
    const error = new Error('Quest title is required.');
    error.statusCode = 400;
    throw error;
  }

  const cleanTitle = title.trim();
  if (cleanTitle.length > 255) {
    const error = new Error('Quest title must not exceed 255 characters.');
    error.statusCode = 400;
    throw error;
  }

  const cleanDescription = (description || '').trim();
  if (cleanDescription.length > 2000) {
    const error = new Error('Quest description must not exceed 2000 characters.');
    error.statusCode = 400;
    throw error;
  }

  // Validate allowed enums
  const allowedCategories = ['academics', 'coding', 'fitness', 'routine', 'mindset'];
  const allowedDifficulties = ['trivial', 'easy', 'medium', 'hard', 'epic'];
  const allowedAttributes = ['strength', 'intellect', 'discipline', 'creativity', 'consistency'];

  const cleanCategory = allowedCategories.includes(category) ? category : 'academics';
  const cleanDifficulty = allowedDifficulties.includes(difficulty) ? difficulty : 'medium';
  const cleanAttribute = allowedAttributes.includes(attributeType) ? attributeType : 'intellect';

  // Calculate authoritative reward numbers server-side
  const rewards = DIFFICULTY_REWARDS[cleanDifficulty] || DIFFICULTY_REWARDS.medium;

  const result = await query(
    `INSERT INTO tasks (
      user_id, title, description, category, difficulty,
      xp_reward, gold_reward, attribute_type, due_date,
      status, is_recurring, recurrence_pattern
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, $11)
    RETURNING *`,
    [
      userId,
      cleanTitle,
      cleanDescription,
      cleanCategory,
      cleanDifficulty,
      rewards.xp,
      rewards.gold,
      cleanAttribute,
      dueDate ? new Date(dueDate) : null,
      Boolean(isRecurring),
      isRecurring ? recurrencePattern : null,
    ]
  );

  const task = result.rows[0];

  // Log activity
  await logActivity(null, {
    userId,
    eventType: 'QUEST_CREATED',
    sourceId: task.id,
    metadata: { title: task.title, category: task.category, difficulty: task.difficulty },
  });

  return task;
};

/**
 * Get all tasks for a specific user with optional status filter
 */
const getUserTasks = async (userId, statusFilter = null) => {
  let sql = `SELECT * FROM tasks WHERE user_id = $1`;
  const params = [userId];

  if (statusFilter && ['pending', 'completed', 'archived'].includes(statusFilter)) {
    sql += ` AND status = $2`;
    params.push(statusFilter);
  }

  sql += ` ORDER BY created_at DESC`;

  const result = await query(sql, params);
  return result.rows;
};

/**
 * Get single task by ID with strict ownership validation
 */
const getTaskById = async (userId, taskId) => {
  const result = await query(
    `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
    [taskId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Quest not found or unauthorized.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * Update an existing task
 */
const updateTask = async (userId, taskId, data) => {
  const {
    title,
    description,
    category,
    difficulty,
    attributeType,
    dueDate,
    status,
    isRecurring,
    recurrencePattern,
  } = data;

  if (title !== undefined && (!title || !title.trim())) {
    const error = new Error('Quest title cannot be empty.');
    error.statusCode = 400;
    throw error;
  }

  // Calculate updated rewards if difficulty changed
  const rewards = difficulty ? DIFFICULTY_REWARDS[difficulty] : null;

  const result = await query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         category = COALESCE($3, category),
         difficulty = COALESCE($4, difficulty),
         xp_reward = CASE WHEN $4 IS NOT NULL THEN $5 ELSE xp_reward END,
         gold_reward = CASE WHEN $4 IS NOT NULL THEN $6 ELSE gold_reward END,
         attribute_type = COALESCE($7, attribute_type),
         due_date = COALESCE($8, due_date),
         status = COALESCE($9, status),
         is_recurring = COALESCE($10, is_recurring),
         recurrence_pattern = COALESCE($11, recurrence_pattern),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $12 AND user_id = $13
     RETURNING *`,
    [
      title ? title.trim() : null,
      description !== undefined ? description.trim() : null,
      category || null,
      difficulty || null,
      rewards ? rewards.xp : null,
      rewards ? rewards.gold : null,
      attributeType || null,
      dueDate ? new Date(dueDate) : null,
      status || null,
      isRecurring !== undefined ? Boolean(isRecurring) : null,
      recurrencePattern || null,
      taskId,
      userId,
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Quest not found or unauthorized.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * Delete a task
 */
const deleteTask = async (userId, taskId) => {
  const result = await query(
    `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
    [taskId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Quest not found or unauthorized.');
    error.statusCode = 404;
    throw error;
  }

  return { id: taskId, message: 'Quest deleted successfully.' };
};

/**
 * Complete a Task and atomically distribute RPG rewards (XP, Gold, Attributes, Streak, History Log)
 * Strictly idempotent, race-condition protected via database transactions.
 */
const completeTask = async (userId, taskId, notes = '') => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Fetch and Lock the Task (Ensure status == 'pending' and owned by userId)
    const taskResult = await client.query(
      `UPDATE tasks
       SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND status = 'pending'
       RETURNING *`,
      [taskId, userId]
    );

    if (taskResult.rows.length === 0) {
      const error = new Error('Quest is already completed or does not exist.');
      error.statusCode = 400;
      throw error;
    }

    const task = taskResult.rows[0];
    const xpReward = task.xp_reward;
    const goldReward = task.gold_reward;
    const attributeType = task.attribute_type;
    const attributePoints = (DIFFICULTY_REWARDS[task.difficulty] && DIFFICULTY_REWARDS[task.difficulty].attributePoints) || 1;
    const mettleScoreGain = Math.round(xpReward / 5) + 5;

    // 2. Fetch Current Character stats with FOR UPDATE lock
    const charResult = await client.query(
      `SELECT id, total_xp, gold, level, mettle_score FROM characters WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    if (charResult.rows.length === 0) {
      const error = new Error('Character not found.');
      error.statusCode = 404;
      throw error;
    }

    const character = charResult.rows[0];
    const currentTotalXp = Number(character.total_xp || 0);
    const newTotalXp = currentTotalXp + xpReward;
    const oldLevel = character.level;
    const levelProg = getLevelProgress(newTotalXp);
    const newLevel = levelProg.currentLevel;
    const leveledUp = newLevel > oldLevel;
    const levelJump = newLevel - oldLevel;
    const newTitle = levelProg.title;

    // Apply level up bonus gold if leveled up (10 gold per level gained)
    const levelBonusGold = leveledUp ? levelJump * 10 : 0;
    const finalGold = character.gold + goldReward + levelBonusGold;
    const newMettleScore = character.mettle_score + mettleScoreGain + (leveledUp ? levelJump * 25 : 0);

    // 3. Update Character table
    await client.query(
      `UPDATE characters
       SET total_xp = $1, gold = $2, level = $3, mettle_score = $4, title = $5, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6`,
      [newTotalXp, finalGold, newLevel, newMettleScore, newTitle, userId]
    );

    // 4. Update Attribute Stat
    const validAttributes = ['strength', 'intellect', 'discipline', 'creativity', 'consistency'];
    const targetAttribute = validAttributes.includes(attributeType) ? attributeType : 'intellect';

    const attrResult = await client.query(
      `UPDATE attributes
       SET ${targetAttribute} = ${targetAttribute} + $1, updated_at = CURRENT_TIMESTAMP
       WHERE character_id = $2
       RETURNING *`,
      [attributePoints, character.id]
    );

    const updatedAttributes = attrResult.rows[0];

    // 5. Update Streak logic safely with Shield Support & zero timezone skew
    const streakQuery = await client.query(
      `SELECT s.*,
              (s.last_activity_date = CURRENT_DATE) AS is_today,
              (s.last_activity_date = CURRENT_DATE - 1) AS is_yesterday
       FROM streaks s 
       WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    let currentStreak = 1;
    let longestStreak = 1;
    let freezeCount = 0;
    let shieldUsed = false;

    if (streakQuery.rows.length > 0) {
      const s = streakQuery.rows[0];
      freezeCount = s.freeze_count || 0;
      const isToday = Boolean(s.is_today);
      const isYesterday = Boolean(s.is_yesterday);

      if (isToday) {
        // Already completed a quest today -> streak remains intact, never falsely increments on subsequent quests today
        currentStreak = Math.max(1, s.current_streak || 1);
        longestStreak = Math.max(s.longest_streak || 0, currentStreak);
      } else if (isYesterday) {
        // Consecutive day
        currentStreak = (s.current_streak || 0) + 1;
        longestStreak = Math.max(s.longest_streak || 0, currentStreak);
      } else if (s.last_activity_date && freezeCount > 0) {
        // Missed day but protected by Streak Shield!
        freezeCount = freezeCount - 1;
        currentStreak = (s.current_streak || 0) + 1;
        longestStreak = Math.max(s.longest_streak || 0, currentStreak);
        shieldUsed = true;
      } else {
        // First activity ever or streak reset
        currentStreak = 1;
        longestStreak = Math.max(s.longest_streak || 0, 1);
      }

      await client.query(
        `UPDATE streaks
         SET current_streak = $1, longest_streak = $2, freeze_count = $3, last_activity_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4`,
        [currentStreak, longestStreak, freezeCount, userId]
      );
    }

    // 6. Record Currency Transaction
    await client.query(
      `INSERT INTO transactions (user_id, amount, balance_after, type, description)
       VALUES ($1, $2, $3, 'quest_reward', $4)`,
      [userId, goldReward + levelBonusGold, finalGold, `Bounty earned from quest: ${task.title}${leveledUp ? ` (+${levelBonusGold} Level Up Bonus)` : ''}`]
    );

    // 7. Log in Task Completions history
    const completionResult = await client.query(
      `INSERT INTO task_completions (
        user_id, task_id, task_title, xp_earned, gold_earned,
        attribute_gained, attribute_points, mettle_score_earned, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        task.id,
        task.title,
        xpReward,
        goldReward + levelBonusGold,
        targetAttribute,
        attributePoints,
        mettleScoreGain,
        notes,
      ]
    );

    // 8. Log Activity Events
    await logActivity(client, {
      userId,
      eventType: 'QUEST_COMPLETED',
      sourceId: task.id,
      amount: xpReward,
      metadata: { title: task.title, xp: xpReward, gold: goldReward, attribute: targetAttribute },
    });

    if (shieldUsed) {
      await logActivity(client, {
        userId,
        eventType: 'STREAK_SHIELD_ACTIVATED',
        amount: 1,
        metadata: { remainingShields: freezeCount, preservedStreak: currentStreak },
      });
    }

    if (leveledUp) {
      await logActivity(client, {
        userId,
        eventType: 'LEVEL_UP',
        amount: newLevel,
        metadata: { oldLevel, newLevel, newTitle, bonusGold: levelBonusGold },
      });
    }

    // 9. Count total completed quests for badge evaluation
    const countResult = await client.query(
      `SELECT COUNT(*) FROM task_completions WHERE user_id = $1`,
      [userId]
    );
    const totalCompletions = parseInt(countResult.rows[0].count, 10);

    // 10. Evaluate Badges
    const unlockedBadges = await evaluateBadges(client, userId, {
      totalQuestsCompleted: totalCompletions,
      level: newLevel,
      currentStreak,
    });

    await client.query('COMMIT');

    return {
      task,
      completion: completionResult.rows[0],
      unlockedBadges,
      shieldUsed,
      rewards: {
        xpGained: xpReward,
        goldGained: goldReward + levelBonusGold,
        attributeGained: targetAttribute,
        attributePointsGained: attributePoints,
        mettleScoreGained: mettleScoreGain,
      },
      character: {
        level: newLevel,
        totalXp: newTotalXp,
        gold: finalGold,
        mettleScore: newMettleScore,
        title: newTitle,
        leveledUp,
        levelJump,
        progress: levelProg,
        attributes: updatedAttributes,
        streaks: {
          currentStreak,
          longestStreak,
          freezeCount,
          lastActivityDate: new Date().toISOString().split('T')[0],
        },
      },
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get Task Completion History for Analytics
 */
const getTaskHistory = async (userId) => {
  const result = await query(
    `SELECT * FROM task_completions WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 50`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  getTaskHistory,
};
