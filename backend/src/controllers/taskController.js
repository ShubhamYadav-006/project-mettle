const taskService = require('../services/taskService');
const { sendLevelUpEmail } = require('../services/emailService');
const { query } = require('../config/db');

/**
 * @desc    Get all quests for logged in user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const tasks = await taskService.getUserTasks(req.user.id, status);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single quest by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Create a new quest
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Quest title is required.' });
    }

    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Quest created successfully!', data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing quest
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Quest updated successfully!', data: task });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Delete a quest
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: result.message, id: result.id });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Complete a quest and receive RPG rewards
 * @route   POST /api/tasks/:id/complete
 * @access  Private
 */
const completeTask = async (req, res, next) => {
  try {
    const notes = req.body?.notes || '';
    const result = await taskService.completeTask(req.user.id, req.params.id, notes);

    // If character leveled up, dispatch level-up email in the background without blocking
    if (result.character?.leveledUp) {
      const newLevel = result.character.level;
      const oldLevel = result.character.level - (result.character.levelJump || 1);

      (async () => {
        try {
          let email = req.user.email;
          let name = req.user.name;

          if (!name || !email) {
            const userQuery = await query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
            if (userQuery.rows.length > 0) {
              name = name || userQuery.rows[0].name;
              email = email || userQuery.rows[0].email;
            }
          }

          if (email) {
            await sendLevelUpEmail({
              email,
              name: name || 'Player',
              oldLevel,
              newLevel,
            });
          }
        } catch (emailErr) {
          console.error('[TaskController] Level-up email background dispatch error:', emailErr?.message || emailErr);
        }
      })();
    }

    res.status(200).json({
      success: true,
      message: result.character.leveledUp
        ? `🎉 Level Up! You reached Level ${result.character.level}!`
        : `⚔️ Quest Completed! +${result.rewards.xpGained} XP, +${result.rewards.goldGained} Gold`,
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Get quest completion history
 * @route   GET /api/tasks/history
 * @access  Private
 */
const getTaskHistory = async (req, res, next) => {
  try {
    const history = await taskService.getTaskHistory(req.user.id);
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getTaskHistory,
};
