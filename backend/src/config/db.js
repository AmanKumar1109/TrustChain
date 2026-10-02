const mongoose = require('mongoose');
const config = require('./env');

// Set buffer timeout so operations fail fast with informative message if MongoDB is unreachable
mongoose.set('bufferTimeoutMS', 3000);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${config.mongoUri}.`);
    console.warn(`[MongoDB Warning] Error: ${error.message}`);
    console.warn(`[MongoDB Note] If running locally, ensure MongoDB service is active or set MONGO_URI in backend/.env.`);
    return null;
  }
};

module.exports = connectDB;
