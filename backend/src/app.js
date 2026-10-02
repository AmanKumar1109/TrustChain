const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('./config/db');
const path = require('path');
const config = require('./config/env');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimit');
const { errorResponse } = require('./utils/response');

const app = express();

// 1. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 2. Static Assets (Uploads directory for KYB docs & Product images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 3. Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-simulate-city', 'x-city', 'x-forwarded-city'],
  })
);

// 3. Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Request Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// 5. Global API Rate Limiting
app.use('/api', apiLimiter);

// 6. Mount Base API Routes (/api/v1) and root aliases
app.use('/verify', require('./routes/verify.routes'));
app.use('/api/v1', apiRoutes);
app.use(apiRoutes); // Enables root /sell, /claim, /health shortcuts

// 7. Catch-all 404 handler
app.use('*', (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found on this server.`, 404, 'NOT_FOUND');
});

// 8. Central Error Handler
app.use(errorHandler);

module.exports = app;
