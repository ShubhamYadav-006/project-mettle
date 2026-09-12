const { pool, query } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { getLevelProgress } = require('../utils/levelMath');

/**
 * Register a new user and automatically initialize their RPG character, attributes, streak, and starter quests.
 * Executed inside a PostgreSQL database transaction to guarantee data consistency.
 */
const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUserCheck = await query(
    'SELECT id FROM users WHERE LOWER(email) = $1',
    [normalizedEmail]
  );

  if (existingUserCheck.rows.length > 0) {
    const error = new Error('User with this email already exists.');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Begin PostgreSQL Transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Generate unique default username
    let baseUsername = normalizedEmail.split('@')[0].replace(/[^a-z0-9_]/g, '_').slice(0, 25);
    if (!baseUsername || baseUsername.length < 3) {
      baseUsername = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 25) || 'player';
    }
    let uniqueUsername = baseUsername;
    let uCheck = await client.query('SELECT id FROM users WHERE LOWER(username) = $1', [uniqueUsername.toLowerCase()]);
    let counter = 1;
    while (uCheck.rows.length > 0) {
      uniqueUsername = `${baseUsername}_${counter++}`;
      uCheck = await client.query('SELECT id FROM users WHERE LOWER(username) = $1', [uniqueUsername.toLowerCase()]);
    }

    // Insert User
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, username, bio, avatar_url)
       VALUES ($1, $2, $3, $4, '', '')
       RETURNING id, name, username, email, bio, avatar_url, created_at`,
      [name.trim(), normalizedEmail, hashedPassword, uniqueUsername]
    );

    const user = userResult.rows[0];

    // 2. Insert RPG Character
    const characterResult = await client.query(
      `INSERT INTO characters (user_id, title, level, total_xp, gold, mettle_score)
       VALUES ($1, 'Novice Scholar', 1, 0, 0, 0)
       RETURNING id, title, level, total_xp, gold, mettle_score`,
      [user.id]
    );

    const character = characterResult.rows[0];

    // 3. Insert RPG Attributes (Default 10 for all stats)
    const attributeResult = await client.query(
      `INSERT INTO attributes (character_id, strength, intellect, discipline, creativity, consistency)
       VALUES ($1, 10, 10, 10, 10, 10)
       RETURNING strength, intellect, discipline, creativity, consistency`,
      [character.id]
    );

    const attributes = attributeResult.rows[0];

    // 4. Insert Initial Streaks Record with freeze_count = 0
    const streakResult = await client.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_count)
       VALUES ($1, 0, 0, 0)
       RETURNING current_streak, longest_streak, last_activity_date, freeze_count`,
      [user.id]
    );

    const streaks = streakResult.rows[0];

    // 5. Insert 2 Curated Starter Quests to eliminate blank canvas
    await client.query(
      `INSERT INTO tasks (user_id, title, description, category, difficulty, xp_reward, gold_reward, attribute_type, status)
       VALUES 
       ($1, 'Complete 45-min Deep Focus Session', 'Review syllabus concepts and solve practical problems.', 'academics', 'medium', 60, 20, 'intellect', 'pending'),
       ($1, 'Morning Planning & Routine Adherence', 'Organize daily priorities and set today goals.', 'routine', 'easy', 30, 10, 'discipline', 'pending')`,
      [user.id]
    );

    await client.query('COMMIT');

    const totalXp = Number(character.total_xp);
    const progress = getLevelProgress(totalXp);

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        avatarUrl: user.avatar_url || '',
        createdAt: user.created_at,
      },
      character: {
        id: character.id,
        title: character.title,
        level: progress.currentLevel,
        totalXp,
        gold: character.gold,
        mettleScore: character.mettle_score,
        progress,
        attributes: {
          strength: attributes.strength,
          intellect: attributes.intellect,
          discipline: attributes.discipline,
          creativity: attributes.creativity,
          consistency: attributes.consistency,
        },
        streaks: {
          currentStreak: streaks.current_streak,
          longestStreak: streaks.longest_streak,
          lastActivityDate: streaks.last_activity_date,
          freezeCount: streaks.freeze_count,
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
 * Authenticate existing user by email and password
 */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user by email
  const userResult = await query(
    `SELECT u.id, u.name, u.username, u.email, u.bio, u.avatar_url, u.password_hash, u.created_at,
            c.id AS character_id, c.title, c.level, c.total_xp, c.gold, c.mettle_score,
            a.strength, a.intellect, a.discipline, a.creativity, a.consistency,
            s.current_streak, s.longest_streak, s.last_activity_date, COALESCE(s.freeze_count, 0) AS freeze_count
     FROM users u
     LEFT JOIN characters c ON c.user_id = u.id
     LEFT JOIN attributes a ON a.character_id = c.id
     LEFT JOIN streaks s ON s.user_id = u.id
     WHERE LOWER(u.email) = $1`,
    [normalizedEmail]
  );

  if (userResult.rows.length === 0) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const row = userResult.rows[0];

  // Compare Password
  const isMatch = await comparePassword(password, row.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const totalXp = Number(row.total_xp || 0);
  const progress = getLevelProgress(totalXp);

  return {
    user: {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      bio: row.bio || '',
      avatarUrl: row.avatar_url || '',
      createdAt: row.created_at,
    },
    character: {
      id: row.character_id,
      title: row.title,
      level: progress.currentLevel,
      totalXp,
      gold: row.gold,
      mettleScore: row.mettle_score,
      progress,
      attributes: {
        strength: row.strength,
        intellect: row.intellect,
        discipline: row.discipline,
        creativity: row.creativity,
        consistency: row.consistency,
      },
      streaks: {
        currentStreak: row.current_streak,
        longestStreak: row.longest_streak,
        lastActivityDate: row.last_activity_date,
        freezeCount: row.freeze_count,
      },
    },
  };
};

/**
 * Fetch full profile for currently authenticated user
 */
const getUserProfile = async (userId) => {
  const result = await query(
    `SELECT u.id, u.name, u.username, u.email, u.bio, u.avatar_url, u.created_at,
            c.id AS character_id, c.title, c.level, c.total_xp, c.gold, c.mettle_score,
            a.strength, a.intellect, a.discipline, a.creativity, a.consistency,
            s.current_streak, s.longest_streak, s.last_activity_date, COALESCE(s.freeze_count, 0) AS freeze_count
     FROM users u
     LEFT JOIN characters c ON c.user_id = u.id
     LEFT JOIN attributes a ON a.character_id = c.id
     LEFT JOIN streaks s ON s.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const row = result.rows[0];
  const totalXp = Number(row.total_xp || 0);
  const progress = getLevelProgress(totalXp);

  return {
    user: {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      bio: row.bio || '',
      avatarUrl: row.avatar_url || '',
      createdAt: row.created_at,
    },
    character: {
      id: row.character_id,
      title: row.title,
      level: progress.currentLevel,
      totalXp,
      gold: row.gold,
      mettleScore: row.mettle_score,
      progress,
      attributes: {
        strength: row.strength,
        intellect: row.intellect,
        discipline: row.discipline,
        creativity: row.creativity,
        consistency: row.consistency,
      },
      streaks: {
        currentStreak: row.current_streak,
        longestStreak: row.longest_streak,
        lastActivityDate: row.last_activity_date,
        freezeCount: row.freeze_count,
      },
    },
  };
};

/**
 * Generate Google OAuth 2.0 Authorization URL
 */
const getGoogleAuthUrl = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is missing.');
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

/**
 * Exchange Google OAuth code for tokens & process user login / registration
 */
const handleGoogleAuthCallback = async (code) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials are not properly configured.');
  }

  // 1. Exchange authorization code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    const errorMsg = tokenData.error_description || tokenData.error || 'Failed to exchange Google OAuth code';
    const error = new Error(errorMsg);
    error.statusCode = 400;
    throw error;
  }

  // 2. Fetch Google User Profile Information
  const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const googleProfile = await userinfoResponse.json();

  if (!userinfoResponse.ok || !googleProfile.email) {
    const error = new Error('Failed to retrieve user profile from Google.');
    error.statusCode = 400;
    throw error;
  }

  const googleId = googleProfile.sub;
  const normalizedEmail = googleProfile.email.toLowerCase().trim();
  const name = googleProfile.name || googleProfile.given_name || 'Mettle User';

  // 3. Find user by google_id OR by email
  const existingUserResult = await query(
    `SELECT id, email, google_id FROM users WHERE google_id = $1 OR LOWER(email) = $2`,
    [googleId, normalizedEmail]
  );

  let userId;

  if (existingUserResult.rows.length > 0) {
    const existing = existingUserResult.rows[0];
    userId = existing.id;

    // Link Google ID if not yet linked
    if (!existing.google_id) {
      await query(`UPDATE users SET google_id = $1 WHERE id = $2`, [googleId, userId]);
    }
  } else {
    // 4. Create new user + character inside a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const userResult = await client.query(
        `INSERT INTO users (name, email, google_id)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name.trim(), normalizedEmail, googleId]
      );

      const newUser = userResult.rows[0];
      userId = newUser.id;

      // Create RPG Character
      const characterResult = await client.query(
        `INSERT INTO characters (user_id, title, level, total_xp, gold, mettle_score)
         VALUES ($1, 'Novice Scholar', 1, 0, 0, 0)
         RETURNING id`,
        [userId]
      );
      const characterId = characterResult.rows[0].id;

      // Create RPG Attributes
      await client.query(
        `INSERT INTO attributes (character_id, strength, intellect, discipline, creativity, consistency)
         VALUES ($1, 10, 10, 10, 10, 10)`,
        [characterId]
      );

      // Create Streaks Record
      await client.query(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, freeze_count)
         VALUES ($1, 0, 0, 0)`,
        [userId]
      );

      // Insert Starter Quests
      await client.query(
        `INSERT INTO tasks (user_id, title, description, category, difficulty, xp_reward, gold_reward, attribute_type, status)
         VALUES 
         ($1, 'Complete 45-min Deep Focus Session', 'Review syllabus concepts and solve practical problems.', 'academics', 'medium', 60, 20, 'intellect', 'pending'),
         ($1, 'Morning Planning & Routine Adherence', 'Organize daily priorities and set today goals.', 'routine', 'easy', 30, 10, 'discipline', 'pending')`,
        [userId]
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // 5. Fetch full profile and return
  return await getUserProfile(userId);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getGoogleAuthUrl,
  handleGoogleAuthCallback,
};
