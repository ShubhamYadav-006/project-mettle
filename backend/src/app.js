const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Payload Size Limiting (Allows safe Avatar Image Uploads)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Handle Browser Favicon Requests cleanly without 404 logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/quests', taskRoutes); // Alias for quest terminology
app.use('/api/rewards', rewardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/activity', activityRoutes);

// Root Health & API Blueprint Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Mettle Life RPG API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      quests: '/api/tasks',
      rewards: '/api/rewards',
      badges: '/api/badges',
      activity: '/api/activity',
    },
  });
});

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
