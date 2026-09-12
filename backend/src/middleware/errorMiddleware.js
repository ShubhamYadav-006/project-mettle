/**
 * Handle 404 - Resource Not Found Route Handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
  
  if (statusCode === 404) {
    console.warn(`[WARN 404] ${req.method} ${req.originalUrl}: ${err.message}`);
  } else {
    console.error(`[ERROR ${statusCode}] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
