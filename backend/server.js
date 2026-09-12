require('dotenv').config({ quiet: true });
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Start local HTTP server when executed directly (node server.js, nodemon, npm start, npm run dev)
if (require.main === module && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down server gracefully...', err);
    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app;

