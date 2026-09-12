const { query } = require('../config/db');

/**
 * Get profile data for the authenticated user
 */
const getProfile = async (userId) => {
  const result = await query(
    `SELECT id, name, username, email, bio, avatar_url, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const user = result.rows[0];
  return {
    id: user.id,
    name: user.name,
    username: user.username || '',
    email: user.email,
    bio: user.bio || '',
    avatarUrl: user.avatar_url || '',
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

/**
 * Update profile data for the authenticated user
 * Note: Never modifies email, password, or any RPG progression/game stats.
 */
const updateProfile = async (userId, { name, username, bio, avatarUrl }) => {
  // 1. Validate Name
  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Full Name is required.');
    error.statusCode = 400;
    throw error;
  }
  const cleanName = name.trim().slice(0, 100);

  // 2. Validate Username
  if (!username || typeof username !== 'string' || !username.trim()) {
    const error = new Error('Username is required.');
    error.statusCode = 400;
    throw error;
  }
  const cleanUsername = username.trim().toLowerCase();

  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    const error = new Error('Username must be between 3 and 30 characters.');
    error.statusCode = 400;
    throw error;
  }

  const usernameRegex = /^[a-z0-9_]+$/;
  if (!usernameRegex.test(cleanUsername)) {
    const error = new Error('Username can only contain letters, numbers, and underscores.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Check for Duplicate Username
  const duplicateCheck = await query(
    `SELECT id FROM users WHERE LOWER(username) = $1 AND id != $2`,
    [cleanUsername, userId]
  );

  if (duplicateCheck.rows.length > 0) {
    const error = new Error('Username is already taken. Please choose another username.');
    error.statusCode = 400;
    throw error;
  }

  // 4. Clean Bio & Avatar URL
  const cleanBio = typeof bio === 'string' ? bio.trim().slice(0, 500) : '';
  const cleanAvatarUrl = typeof avatarUrl === 'string' ? avatarUrl.trim().slice(0, 3000000) : '';

  // 5. Update Database Record
  const result = await query(
    `UPDATE users
     SET name = $1, username = $2, bio = $3, avatar_url = $4
     WHERE id = $5
     RETURNING id, name, username, email, bio, avatar_url, created_at, updated_at`,
    [cleanName, cleanUsername, cleanBio, cleanAvatarUrl, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedUser = result.rows[0];
  return {
    id: updatedUser.id,
    name: updatedUser.name,
    username: updatedUser.username,
    email: updatedUser.email,
    bio: updatedUser.bio || '',
    avatarUrl: updatedUser.avatar_url || '',
    createdAt: updatedUser.created_at,
    updatedAt: updatedUser.updated_at,
  };
};

module.exports = {
  getProfile,
  updateProfile,
};
