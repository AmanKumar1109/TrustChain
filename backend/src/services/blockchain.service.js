const { ethers } = require('ethers');
const contractService = require('./contract.service');
const transactionService = require('./transaction.service');

class BlockchainService {
  get registry() {
    return contractService.getRegistryContract();
  }

  get points() {
    return contractService.getTrustPointsContract();
  }

  get relayer() {
    return contractService.getRelayerWallet();
  }

  /**
   * Helper to format a string into bytes32
   */
  toBytes32(str) {
    if (str.startsWith('0x') && str.length === 66) {
      return str;
    }
    return ethers.id(str);
  }

  /**
   * Authorize a manufacturer address on-chain if not already authorized
  /**
   * Authorize a manufacturer address explicitly on-chain through TransactionService
   */
  async authorizeManufacturerOnChain(manufacturerWallet) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }
    console.log(`[Blockchain] Authorizing manufacturer on-chain: ${manufacturerWallet}`);
    return transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'authorizeManufacturer',
      args: [manufacturerWallet],
      relatedEntity: { entityType: 'User', entityId: manufacturerWallet },
    });
  }

  /**
   * Authorize a manufacturer address on-chain if not already authorized
   */
  async ensureManufacturerAuthorized(manufacturerWallet) {
    if (!this.registry) return null;
    try {
      const MANUFACTURER_ROLE = await this.registry.MANUFACTURER_ROLE();
      const isAuth = await this.registry.hasRole(MANUFACTURER_ROLE, manufacturerWallet);
      if (!isAuth) {
        await this.authorizeManufacturerOnChain(manufacturerWallet);
      }
      return true;
    } catch (err) {
      console.warn(`[Blockchain Warning] ensureManufacturerAuthorized: ${err.message}`);
      return false;
    }
  }

  /**
   * Explicitly authorize a supply chain partner address on-chain via Relayer
   */
  async authorizePartnerOnChain(partnerWallet) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }
    console.log(`[Blockchain] Authorizing partner on-chain via Relayer: ${partnerWallet}`);
    return transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'authorizePartner',
      args: [partnerWallet],
      relatedEntity: { entityType: 'Partner', entityId: partnerWallet },
    });
  }

  /**
   * Authorize a supply chain partner address on-chain if not already authorized
   */
  async ensurePartnerAuthorized(partnerWallet) {
    if (!this.registry) return null;
    try {
      const PARTNER_ROLE = await this.registry.PARTNER_ROLE();
      const isAuth = await this.registry.hasRole(PARTNER_ROLE, partnerWallet);
      if (!isAuth) {
        await this.authorizePartnerOnChain(partnerWallet);
      }
      return true;
    } catch (err) {
      console.warn(`[Blockchain Warning] ensurePartnerAuthorized: ${err.message}`);
      return false;
    }
  }

  /**
   * Register a new batch on-chain (wrapped in TransactionService)
   */
  async registerBatchOnChain({
    batchId,
    manufacturerWallet,
    merkleRoot,
    quantity,
    protectionLevel = 0,
    expiryTimestamp,
  }) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const batchIdBytes32 = this.toBytes32(batchId);
    const merkleRootBytes32 = this.toBytes32(merkleRoot);
    const protectionLevelCode = (protectionLevel === 'HighValue' || protectionLevel === 1) ? 1 : 0;

    await this.ensureManufacturerAuthorized(manufacturerWallet);

    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'registerBatch',
      args: [
        batchIdBytes32,
        manufacturerWallet,
        merkleRootBytes32,
        BigInt(quantity),
        protectionLevelCode,
        BigInt(expiryTimestamp),
      ],
      relatedEntity: { entityType: 'Batch', entityId: batchId },
    });

    return {
      txHash: result.txHash,
      receipt: result.receipt,
      batchIdBytes32,
      merkleRootBytes32,
    };
  }

  /**
   * Verify an individual unit on-chain using Merkle proof (View function)
   */
  async verifyUnitOnChain(batchId, unitCode, proof) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const batchIdBytes32 = this.toBytes32(batchId);
    const result = await this.registry.verifyUnit(batchIdBytes32, unitCode, proof);

    return {
      exists: result.exists,
      expired: result.expired,
      recalled: result.recalled,
      recallReason: result.recallReason,
      soldState: Number(result.soldState),
      currentOwner: result.currentOwner,
    };
  }

  /**
   * Initiate supply chain custody transfer on-chain
   */
  async initiateBatchTransfer({ batchId, fromWallet, toWallet, quantity }) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const batchIdBytes32 = this.toBytes32(batchId);
    await this.ensurePartnerAuthorized(toWallet);

    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'initiateBatchTransfer',
      args: [batchIdBytes32, fromWallet, toWallet, BigInt(quantity)],
      relatedEntity: { entityType: 'CustodyTransfer', entityId: batchId },
    });

    let transferId = null;
    if (result.receipt && result.receipt.logs) {
      for (const log of result.receipt.logs) {
        try {
          const parsed = this.registry.interface.parseLog(log);
          if (parsed && parsed.name === 'BatchTransferInitiated') {
            transferId = parsed.args.transferId;
            break;
          }
        } catch (e) {
          // ignore non-matching logs
        }
      }
    }

    return {
      txHash: result.txHash,
      transferId: transferId || ethers.id(`transfer-${Date.now()}`),
    };
  }

  /**
   * Respond to supply chain custody transfer on-chain (Accept or Reject)
   */
  async respondBatchTransfer(transferId, accept) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const transferIdBytes32 = this.toBytes32(transferId);
    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'respondBatchTransfer',
      args: [transferIdBytes32, accept],
      relatedEntity: { entityType: 'CustodyTransfer', entityId: transferId },
    });

    return {
      txHash: result.txHash,
      transferId,
      accepted: accept,
    };
  }

  /**
   * Mark an individual unit as sold to a customer
   */
  async markUnitSold({ batchId, unitCode, proof, retailerWallet, customerWallet }) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const batchIdBytes32 = this.toBytes32(batchId);
    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'markUnitSold',
      args: [batchIdBytes32, unitCode, proof, retailerWallet, customerWallet],
      relatedEntity: { entityType: 'Unit', entityId: unitCode },
    });

    return {
      txHash: result.txHash,
    };
  }

  /**
   * Claim a unit by the consumer
   */
  async claimUnit({ batchId, unitCode, customerWallet }) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const batchIdBytes32 = this.toBytes32(batchId);
    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'claimUnit',
      args: [batchIdBytes32, unitCode, customerWallet],
      relatedEntity: { entityType: 'Unit', entityId: unitCode },
    });

    return {
      txHash: result.txHash,
    };
  }

  /**
   * Recall a product batch on-chain
   */
  async recallBatch(batchId, reason) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const batchIdBytes32 = this.toBytes32(batchId);
    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'recallBatch',
      args: [batchIdBytes32, reason],
      relatedEntity: { entityType: 'Batch', entityId: batchId },
    });

    return {
      txHash: result.txHash,
    };
  }

  /**
   * Mint TPTS loyalty rewards to customer
   */
  async rewardTrustPoints(customerWallet, amount, reason = 'PRODUCT_AUTHENTICATION_REWARD') {
    if (!this.points) {
      throw new Error('TrustPoints smart contract is not initialized.');
    }

    const result = await transactionService.executeTransaction({
      contract: this.points,
      contractName: 'TrustPoints',
      functionName: 'mintReward',
      args: [customerWallet, BigInt(amount), reason],
      relatedEntity: { entityType: 'User', entityId: customerWallet },
    });

    return {
      txHash: result.txHash,
      amount,
    };
  }

  /**
   * Redeem / burn TPTS loyalty tokens on-chain
   */
  async redeemTrustPoints(customerWallet, amount, offerId = 'REWARD_REDEMPTION') {
    if (!this.points) {
      throw new Error('TrustPoints smart contract is not initialized.');
    }

    const result = await transactionService.executeTransaction({
      contract: this.points,
      contractName: 'TrustPoints',
      functionName: 'redeem',
      args: [customerWallet, BigInt(amount), String(offerId)],
      relatedEntity: { entityType: 'Redemption', entityId: customerWallet },
    });

    return {
      txHash: result.txHash,
      amount,
    };
  }

  /**
   * Read on-chain TPTS token balance (View function)
   */
  async getPointsBalance(walletAddress) {
    if (!this.points) return 0;
    try {
      const bal = await this.points.balanceOf(walletAddress);
      return Number(bal);
    } catch (err) {
      console.warn(`[Blockchain Warning] getPointsBalance error: ${err.message}`);
      return 0;
    }
  }

  /**
   * Read holdings of a batch for a specific wallet (View function)
   */
  async getHoldings(batchId, walletAddress) {
    if (!this.registry) return 0;
    try {
      const batchIdBytes32 = this.toBytes32(batchId);
      const holdings = await this.registry.getHoldings(batchIdBytes32, walletAddress);
      return Number(holdings);
    } catch (err) {
      console.warn(`[Blockchain Warning] getHoldings error: ${err.message}`);
      return 0;
    }
  }

  /**
   * Initiate secondary resale transfer for a single unit on-chain
   */
  async initiateUnitTransfer({ unitHash, fromWallet, toWallet }) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const unitHashBytes32 = this.toBytes32(unitHash);
    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'initiateUnitTransfer',
      args: [unitHashBytes32, fromWallet, toWallet],
      relatedEntity: { entityType: 'UnitTransfer', entityId: unitHash },
    });

    let transferId = null;
    if (result.receipt && result.receipt.logs) {
      for (const log of result.receipt.logs) {
        try {
          const parsed = this.registry.interface.parseLog(log);
          if (parsed && parsed.name === 'UnitTransferInitiated') {
            transferId = parsed.args.transferId;
            break;
          }
        } catch (e) {}
      }
    }

    return {
      txHash: result.txHash,
      transferId: transferId || ethers.id(`unit-transfer-${Date.now()}`),
    };
  }

  /**
   * Respond to secondary resale transfer on-chain (Accept or Reject)
   */
  async respondUnitTransfer(transferId, accept) {
    if (!this.registry) {
      throw new Error('Registry smart contract is not initialized.');
    }

    const transferIdBytes32 = this.toBytes32(transferId);
    const result = await transactionService.executeTransaction({
      contract: this.registry,
      contractName: 'TrustChainRegistry',
      functionName: 'respondUnitTransfer',
      args: [transferIdBytes32, accept],
      relatedEntity: { entityType: 'UnitTransfer', entityId: transferId },
    });

    return {
      txHash: result.txHash,
      transferId,
      accepted: accept,
    };
  }
}

module.exports = new BlockchainService();
