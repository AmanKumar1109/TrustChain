const path = require('path');
const fs = require('fs');
const net = require('net');

let mongodInstance = null;

function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const client = new net.Socket();
    client.setTimeout(1200);
    client.once('connect', () => {
      client.destroy();
      resolve(true);
    });
    client.once('timeout', () => {
      client.destroy();
      resolve(false);
    });
    client.once('error', () => {
      client.destroy();
      resolve(false);
    });
    client.connect(port, host);
  });
}

async function ensureMongoServer(mongoUri) {
  // If remote cloud DB (e.g. MongoDB Atlas), skip embedded runner
  if (mongoUri && !mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost')) {
    return null;
  }

  // Check if MongoDB is already running on port 27017
  const isRunning = await checkPort(27017);
  if (isRunning) {
    return null;
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = path.join(__dirname, '../../.mongo-data');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    console.log('[MongoDB] Starting zero-config embedded MongoDB server on port 27017...');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbPath,
        storageEngine: 'wiredTiger',
        dbName: 'trustchain'
      }
    });

    console.log(`[MongoDB] ✅ Embedded MongoDB active: ${mongodInstance.getUri()}`);
    return mongodInstance;
  } catch (err) {
    console.warn('[MongoDB] Embedded MongoDB start warning:', err.message);
    return null;
  }
}

async function stopEmbeddedMongo() {
  if (mongodInstance) {
    try {
      await mongodInstance.stop();
    } catch (_) {}
    mongodInstance = null;
  }
}

module.exports = {
  ensureMongoServer,
  stopEmbeddedMongo
};
