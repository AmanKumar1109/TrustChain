const mongoose = require('mongoose');
const { successResponse } = require('../utils/response');
const blockchainConfig = require('../config/blockchain');
const config = require('../config/env');

/**
 * Health check controller
 * @route GET /api/v1/health
 */
const getHealth = async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';

  return successResponse(res, {
    service: 'TrustChain API Backend & Relayer',
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'trustchain',
    },
    blockchain: {
      rpcUrl: config.rpcUrl,
      relayerAddress: blockchainConfig.relayerWallet?.address || 'NOT_CONFIGURED',
      registryAddress: blockchainConfig.addresses?.TrustChainRegistry || 'UNAVAILABLE',
      trustPointsAddress: blockchainConfig.addresses?.TrustPoints || 'UNAVAILABLE',
    },
    version: '1.0.0',
  });
};

module.exports = {
  getHealth,
};
