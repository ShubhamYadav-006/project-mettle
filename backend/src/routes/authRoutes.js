const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser, googleAuth, googleCallback, getStats } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', getStats);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

// Google OAuth 2.0 routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;
