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
const rawAllowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const allowedOrigins = Array.from(new Set([...rawAllowedOrigins, ...defaultAllowedOrigins]));

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (mobile, server-to-server, curl)
  const normalizedOrigin = origin.trim().replace(/\/+$/, '');
  if (allowedOrigins.includes(normalizedOrigin)) return true;
  if (
    process.env.NODE_ENV !== 'production' &&
    (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1'))
  ) {
    return true;
  }
  // Allow authorized hosting platforms (Vercel, Netlify, Render)
  if (
    normalizedOrigin.endsWith('.vercel.app') ||
    normalizedOrigin.endsWith('.netlify.app') ||
    normalizedOrigin.endsWith('.onrender.com')
  ) {
    return true;
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    // Deny CORS without throwing 500 error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
