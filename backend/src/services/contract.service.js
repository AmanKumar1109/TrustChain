const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const config = require('../config/env');

/**
 * Contract Service
 * Loads smart contract ABIs and deployment addresses, and connects to RPC with the relayer wallet.
 */
class ContractService {
  constructor() {
    this.provider = null;
    this.relayerWallet = null;
    this.addresses = {};
    this.abis = {};
    this.contracts = {};
    this.isInitialized = false;

    this.init();
  }

  loadDeployments() {
    try {
      let deploymentPath = config.deploymentsPath;
      if (!fs.existsSync(deploymentPath)) {
        const hardhatPath = path.join(path.dirname(deploymentPath), 'hardhat.json');
        if (fs.existsSync(hardhatPath)) {
          deploymentPath = hardhatPath;
        } else {
          console.warn(`[ContractService Warning] Deployments file not found at ${config.deploymentsPath} or ${hardhatPath}`);
          return;
        }
      }

      const raw = fs.readFileSync(deploymentPath, 'utf8');
      const data = JSON.parse(raw);
      this.addresses = data.contracts || {};
      console.log(`[ContractService] Loaded addresses from: ${path.basename(deploymentPath)}`);
    } catch (err) {
      console.warn(`[ContractService Warning] Failed to load deployments: ${err.message}`);
    }
  }

  loadAbis() {
    const contractsToLoad = ['TrustChainRegistry', 'TrustPoints', 'TrustChain'];
    for (const name of contractsToLoad) {
      const abiPath = path.join(config.abiDirPath, `${name}.json`);
      if (fs.existsSync(abiPath)) {
        try {
          const raw = fs.readFileSync(abiPath, 'utf8');
          this.abis[name] = JSON.parse(raw);
        } catch (err) {
          console.warn(`[ContractService Warning] Failed to parse ABI for ${name}: ${err.message}`);
        }
      }
    }
  }

  init() {
    this.loadDeployments();
    this.loadAbis();

    try {
      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
      this.relayerWallet = new ethers.Wallet(config.relayerPrivateKey, this.provider);

      if (this.addresses.TrustChainRegistry && this.abis.TrustChainRegistry) {
        this.contracts.TrustChainRegistry = new ethers.Contract(
          this.addresses.TrustChainRegistry,
          this.abis.TrustChainRegistry,
          this.relayerWallet
        );
      }

      if (this.addresses.TrustPoints && this.abis.TrustPoints) {
        this.contracts.TrustPoints = new ethers.Contract(
          this.addresses.TrustPoints,
          this.abis.TrustPoints,
          this.relayerWallet
        );
      }

      if (this.addresses.TrustChain && this.abis.TrustChain) {
        this.contracts.TrustChain = new ethers.Contract(
          this.addresses.TrustChain,
          this.abis.TrustChain,
          this.relayerWallet
        );
      }

      this.isInitialized = Boolean(this.contracts.TrustChainRegistry && this.contracts.TrustPoints);
      if (this.isInitialized) {
        console.log(`[ContractService] Relayer: ${this.relayerWallet.address}`);
        console.log(`[ContractService] TrustChainRegistry: ${this.addresses.TrustChainRegistry}`);
        console.log(`[ContractService] TrustPoints: ${this.addresses.TrustPoints}`);
      }
    } catch (err) {
      console.warn(`[ContractService Warning] Initialization deferred: ${err.message}`);
    }
  }

  getProvider() {
    return this.provider;
  }

  getRelayerWallet() {
    return this.relayerWallet;
  }

  getRegistryContract() {
    return this.contracts.TrustChainRegistry;
  }

  getTrustPointsContract() {
    return this.contracts.TrustPoints;
  }

  getContract(name) {
    return this.contracts[name];
  }

  async checkConnectivity() {
    try {
      if (!this.provider) return false;
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.relayerWallet.address);
      console.log(`[ContractService] Connected to network chainId ${network.chainId}. Relayer balance: ${ethers.formatEther(balance)} ETH`);
      return true;
    } catch (err) {
      console.warn(`[ContractService] RPC at ${config.rpcUrl} not reachable. Start hardhat node to enable on-chain execution.`);
      return false;
    }
  }
}

const contractService = new ContractService();
module.exports = contractService;
