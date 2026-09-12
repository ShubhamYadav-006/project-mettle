const badgeService = require('../services/badgeService');

const getBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.getUserBadges(req.user.id);
    res.status(200).json({ success: true, count: badges.length, data: badges });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBadges,
};
