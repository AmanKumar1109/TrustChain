const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const config = require('./env');

class BlockchainConfig {
  constructor() {
    this.provider = null;
    this.relayerWallet = null;
    this.registryContract = null;
    this.pointsContract = null;
    this.addresses = {};
    this.abis = {};
    this.isReady = false;

    this._initialize();
  }

  _loadDeployments() {
    try {
      let deploymentPath = config.deploymentsPath;
      if (!fs.existsSync(deploymentPath)) {
        // Fallback to hardhat.json if localhost.json is not present
        const hardhatPath = path.join(path.dirname(deploymentPath), 'hardhat.json');
        if (fs.existsSync(hardhatPath)) {
          deploymentPath = hardhatPath;
        } else {
          console.warn(`[Blockchain Warning] Deployments file not found at ${config.deploymentsPath} or ${hardhatPath}`);
          return;
        }
      }

      const raw = fs.readFileSync(deploymentPath, 'utf8');
      const data = JSON.parse(raw);
      this.addresses = data.contracts || {};
      console.log(`[Blockchain] Loaded deployed contract addresses from: ${path.basename(deploymentPath)}`);
    } catch (err) {
      console.warn(`[Blockchain Warning] Failed to load deployment addresses: ${err.message}`);
    }
  }

  _loadAbis() {
    const contractsToLoad = ['TrustChainRegistry', 'TrustPoints', 'TrustChain'];
    for (const name of contractsToLoad) {
      const abiPath = path.join(config.abiDirPath, `${name}.json`);
      if (fs.existsSync(abiPath)) {
        try {
          const raw = fs.readFileSync(abiPath, 'utf8');
          this.abis[name] = JSON.parse(raw);
        } catch (err) {
          console.warn(`[Blockchain Warning] Failed to parse ABI for ${name}: ${err.message}`);
        }
      }
    }
  }

  _initialize() {
    this._loadDeployments();
    this._loadAbis();

    try {
      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
      this.relayerWallet = new ethers.Wallet(config.relayerPrivateKey, this.provider);

      if (this.addresses.TrustChainRegistry && this.abis.TrustChainRegistry) {
        this.registryContract = new ethers.Contract(
          this.addresses.TrustChainRegistry,
          this.abis.TrustChainRegistry,
          this.relayerWallet
        );
      }

      if (this.addresses.TrustPoints && this.abis.TrustPoints) {
        this.pointsContract = new ethers.Contract(
          this.addresses.TrustPoints,
          this.abis.TrustPoints,
          this.relayerWallet
        );
      }

      this.isReady = Boolean(this.registryContract && this.pointsContract);
      if (this.isReady) {
        console.log(`[Blockchain] Relayer Wallet: ${this.relayerWallet.address}`);
        console.log(`[Blockchain] Registry Contract: ${this.addresses.TrustChainRegistry}`);
        console.log(`[Blockchain] TrustPoints Contract: ${this.addresses.TrustPoints}`);
      }
    } catch (err) {
      console.warn(`[Blockchain Warning] Initialization deferred: ${err.message}`);
    }
  }

  async checkConnectivity() {
    try {
      if (!this.provider) return false;
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.relayerWallet.address);
      console.log(`[Blockchain] Connected to Chain ID ${network.chainId}. Relayer balance: ${ethers.formatEther(balance)} ETH`);
      return true;
    } catch (err) {
      console.warn(`[Blockchain] Local Ethereum RPC node at ${config.rpcUrl} is not currently responding. (Start with 'npm run node' in contracts-project)`);
      return false;
    }
  }
}

const blockchainConfig = new BlockchainConfig();
module.exports = blockchainConfig;
