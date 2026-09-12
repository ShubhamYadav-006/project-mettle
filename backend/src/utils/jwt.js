const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {object} payload - User object payload (e.g. { id, email })
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify JWT token
 * @param {string} token - Token string
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

/**
 * Set HTTP-Only Cookie containing JWT token
 * @param {object} res - Express response object
 * @param {string} token - Signed JWT token
 */
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear JWT Cookie on logout
 * @param {object} res - Express response object
 */
const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
};

module.exports = {
  generateToken,
  verifyToken,
  setTokenCookie,
  clearTokenCookie,
};
