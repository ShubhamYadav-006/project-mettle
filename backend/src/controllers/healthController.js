const db = require('../config/db');

/**
 * @desc    Health Check Endpoint (Server & DB Connectivity)
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = async (req, res, next) => {
  try {
    const dbStartTime = Date.now();
    const result = await db.query('SELECT NOW() AS server_time, current_database() AS db_name');
    const dbLatency = Date.now() - dbStartTime;

    res.status(200).json({
      success: true,
      message: 'Mettle Backend API is healthy and connected to PostgreSQL!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'CONNECTED',
        databaseName: result.rows[0].db_name,
        serverTime: result.rows[0].server_time,
        latencyMs: `${dbLatency}ms`,
      },
    });
  } catch (error) {
    console.error('❌ Health Check Database Connection Failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Backend server running, but PostgreSQL connection failed.',
      error: error.message,
    });
  }
};

module.exports = {
  getHealthStatus,
};
