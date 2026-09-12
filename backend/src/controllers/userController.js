const userService = require('../services/userService');

/**
 * @desc    Get profile for currently authenticated user
 * @route   GET /api/profile or GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Update profile for currently authenticated user
 * @route   PUT /api/profile or PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, username, bio, avatarUrl } = req.body;
    const updatedUser = await userService.updateProfile(req.user.id, {
      name,
      username,
      bio,
      avatarUrl,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: { user: updatedUser },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
