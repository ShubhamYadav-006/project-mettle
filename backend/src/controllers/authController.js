const authService = require('../services/authService');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/jwt');

/**
 * Helper to validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * @desc    Register a new user & create RPG profile
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Input Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Service Call
    const data = await authService.registerUser({ name, email, password });

    // Generate JWT & Set HTTP-Only Cookie
    const token = generateToken({ id: data.user.id, email: data.user.email });
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Mettle RPG.',
      data: {
        token,
        user: data.user,
        character: data.character,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Authenticate user & set token cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const data = await authService.loginUser({ email, password });

    // Generate JWT & Set HTTP-Only Cookie
    const token = generateToken({ id: data.user.id, email: data.user.email });
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      data: {
        token,
        user: data.user,
        character: data.character,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Log out user & clear HTTP-only cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * @desc    Get currently authenticated user profile & RPG character
 * @route   GET /api/auth/me
 * @access  Private (Protected)
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const data = await authService.getUserProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        user: data.user,
        character: data.character,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Redirect user to Google OAuth consent screen
 * @route   GET /api/auth/google
 * @access  Public
 */
const googleAuth = (req, res) => {
  try {
    const url = authService.getGoogleAuthUrl();
    res.redirect(url);
  } catch (error) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * @desc    Handle Google OAuth callback, authenticate, and redirect to frontend
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = async (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${clientUrl}/?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${clientUrl}/?error=${encodeURIComponent('No authorization code received from Google')}`);
    }

    const data = await authService.handleGoogleAuthCallback(code);

    // Generate JWT token & set HTTP-only cookie
    const token = generateToken({ id: data.user.id, email: data.user.email });
    setTokenCookie(res, token);

    // Redirect to frontend dashboard with token parameter for immediate local storage sync
    res.redirect(`${clientUrl}/?token=${token}&auth_success=true`);
  } catch (err) {
    res.redirect(`${clientUrl}/?error=${encodeURIComponent(err.message || 'Google authentication failed')}`);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  googleAuth,
  googleCallback,
};
