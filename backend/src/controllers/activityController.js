const activityService = require('../services/activityService');

const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await activityService.getUserActivityLogs(req.user.id);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
};
