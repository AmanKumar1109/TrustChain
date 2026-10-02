const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');
const blockchainConfig = require('./config/blockchain');
const listenerService = require('./services/listener.service');

const startServer = async () => {
  console.log('\n======================================================');
  console.log('🛡️  TrustChain Backend API & Relayer Server Starting...');
  console.log('======================================================');

  // 1. Connect to MongoDB
  await connectDB();

  // 2. Check local blockchain RPC node connectivity
  await blockchainConfig.checkConnectivity();

  // 3. Start Smart Contract Event Listener & Reconciliation Service
  try {
    await listenerService.start();
  } catch (err) {
    console.error('⚠️ Could not initialize live event listener:', err.message);
  }

  // 4. Start Express HTTP Server
  const server = app.listen(config.port, () => {
    console.log(`\n🚀 Server listening at http://localhost:${config.port}`);
    console.log(`🌐 Base API endpoint: http://localhost:${config.port}/api/v1`);
    console.log(`🏥 Health check:     http://localhost:${config.port}/api/v1/health`);
    console.log(`🔑 Relayer Address:  ${blockchainConfig.relayerWallet?.address || 'Not Configured'}`);
    console.log('======================================================\n');
  });

  // Graceful shutdown handling
  const handleExit = () => {
    console.log('\nGracefully shutting down TrustChain backend...');
    listenerService.stop();
    server.close(() => {
      console.log('Server terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
};

startServer().catch(err => {
  console.error('Fatal error during backend startup:', err);
  process.exit(1);
});
