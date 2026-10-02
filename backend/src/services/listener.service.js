const { ethers } = require('ethers');
const contractService = require('./contract.service');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Unit = require('../models/Unit');
const Transfer = require('../models/Transfer');
const PartnerInventory = require('../models/PartnerInventory');
const Partner = require('../models/Partner');
const RewardLedger = require('../models/RewardLedger');
const Redemption = require('../models/Redemption');
const RewardOffer = require('../models/RewardOffer');

/**
 * Event Listener & Safety-Net Reconciliation Service
 *
 * Subscribes to on-chain smart contract events (Batch transfers, retail sales,
 * customer claims, emergency recalls, loyalty points) and idempotently reconciles
 * state into MongoDB. If a service already wrote the state off-chain, this reconciler
 * recognizes the consistency and never double-applies mutations.
 */
class EventListenerService {
  constructor() {
    this.isActive = false;
    this.isListening = false;
    this.startedAt = null;
    this.lastEventProcessedAt = null;
    this.lastProcessedBlock = 0;
    this.reconciledEventsCount = 0;
    this.skippedAlreadyConsistentCount = 0;
    this.eventStats = {
      batchTransfers: 0,
      sales: 0,
      claims: 0,
      recalls: 0,
      rewards: 0,
    };
    this.recentLogs = [];
    this.processedTxHashes = new Set();
    this.scanInterval = null;
  }

  logReconciliation(eventName, entityId, action, details = '') {
    const entry = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      eventName,
      entityId,
      action, // 'RECONCILED' | 'SKIPPED_ALREADY_CONSISTENT' | 'ERROR'
      details,
    };
    this.recentLogs.unshift(entry);
    if (this.recentLogs.length > 50) {
      this.recentLogs.pop();
    }
  }

  /**
   * Start listening to contract events & start background block scanner
   */
  async start() {
    if (this.isListening) {
      return;
    }

    try {
      const provider = contractService.getProvider();
      const registry = contractService.getRegistryContract();
      const points = contractService.getTrustPointsContract();

      if (!provider || !registry || !points) {
        console.warn('[EventListener] Smart contracts or provider not ready yet. Listener in standby.');
        return;
      }

      this.isActive = true;
      this.isListening = true;
      this.startedAt = new Date();

      const currentBlock = await provider.getBlockNumber().catch(() => 0);
      this.lastProcessedBlock = currentBlock;

      console.log(`[EventListener] Safety-net event listener active at block #${currentBlock}`);

      // 1. Subscribe to Live Contract Events on Registry
      this.attachRegistryListeners(registry);

      // 2. Subscribe to Live Contract Events on TrustPoints
      this.attachPointsListeners(points);

      // 3. Periodic catch-up polling scanner (every 10s)
      this.scanInterval = setInterval(async () => {
        try {
          await this.scanRecentBlocks();
        } catch (scanErr) {
          // Silent catch to prevent crash during node restarts
        }
      }, 10000);
    } catch (err) {
      console.warn(`[EventListener] Failed to initialize live listeners: ${err.message}`);
    }
  }

  /**
   * Attach live event listeners to TrustChainRegistry contract
   */
  attachRegistryListeners(registry) {
    // A. BatchRecalled
    registry.on('BatchRecalled', async (batchId, reason, event) => {
      await this.reconcileBatchRecalled(batchId, reason, event?.log?.transactionHash);
    });

    // B. BatchTransferAccepted
    registry.on('BatchTransferAccepted', async (transferId, batchId, from, to, quantity, event) => {
      await this.reconcileBatchTransfer(transferId, 'Accepted', from, to, quantity, event?.log?.transactionHash);
    });

    // C. BatchTransferRejected
    registry.on('BatchTransferRejected', async (transferId, batchId, from, to, quantity, event) => {
      await this.reconcileBatchTransfer(transferId, 'Rejected', from, to, quantity, event?.log?.transactionHash);
    });

    // D. UnitSold
    registry.on('UnitSold', async (batchId, unitCode, unitHash, retailer, customer, event) => {
      await this.reconcileUnitSold(batchId, unitCode, unitHash, retailer, customer, event?.log?.transactionHash);
    });

    // E. UnitClaimed
    registry.on('UnitClaimed', async (batchId, unitCode, unitHash, customer, event) => {
      await this.reconcileUnitClaimed(batchId, unitCode, unitHash, customer, event?.log?.transactionHash);
    });
  }

  /**
   * Attach live event listeners to TrustPoints contract
   */
  attachPointsListeners(points) {
    // A. RewardMinted
    points.on('RewardMinted', async (to, amount, reason, event) => {
      await this.reconcileRewardMinted(to, amount, reason, event?.log?.transactionHash);
    });

    // B. OfferRedeemed
    points.on('OfferRedeemed', async (from, amount, offerId, event) => {
      await this.reconcileOfferRedeemed(from, amount, offerId, event?.log?.transactionHash);
    });
  }

  /**
   * Periodic catch-up scanner: Queries event filters for the last N blocks
   */
  async scanRecentBlocks() {
    const provider = contractService.getProvider();
    const registry = contractService.getRegistryContract();
    const points = contractService.getTrustPointsContract();

    if (!provider || !registry || !points) return;

    const latestBlock = await provider.getBlockNumber().catch(() => null);
    if (!latestBlock || latestBlock <= this.lastProcessedBlock) return;

    const fromBlock = Math.max(0, this.lastProcessedBlock - 1);
    const toBlock = latestBlock;

    try {
      // Query Registry events
      const [recalledEvents, soldEvents, claimedEvents] = await Promise.all([
        registry.queryFilter(registry.filters.BatchRecalled(), fromBlock, toBlock).catch(() => []),
        registry.queryFilter(registry.filters.UnitSold(), fromBlock, toBlock).catch(() => []),
        registry.queryFilter(registry.filters.UnitClaimed(), fromBlock, toBlock).catch(() => []),
      ]);

      for (const e of recalledEvents) {
        if (!this.processedTxHashes.has(e.transactionHash)) {
          await this.reconcileBatchRecalled(e.args[0], e.args[1], e.transactionHash);
          this.processedTxHashes.add(e.transactionHash);
        }
      }

      for (const e of soldEvents) {
        if (!this.processedTxHashes.has(e.transactionHash)) {
          await this.reconcileUnitSold(e.args[0], e.args[1], e.args[2], e.args[3], e.args[4], e.transactionHash);
          this.processedTxHashes.add(e.transactionHash);
        }
      }

      for (const e of claimedEvents) {
        if (!this.processedTxHashes.has(e.transactionHash)) {
          await this.reconcileUnitClaimed(e.args[0], e.args[1], e.args[2], e.args[3], e.transactionHash);
          this.processedTxHashes.add(e.transactionHash);
        }
      }

      this.lastProcessedBlock = latestBlock;
    } catch (err) {
      // Silently ignore scan errors on local hardhat resets
    }
  }

  // ===========================================================================
  // IDEMPOTENT RECONCILIATION HANDLERS
  // ===========================================================================

  /**
   * 1. Reconcile Batch Recall
   */
  async reconcileBatchRecalled(batchIdHex, reason, txHash) {
    try {
      this.lastEventProcessedAt = new Date();
      this.eventStats.recalls++;

      const batchIdStr = String(batchIdHex);

      const batch = await Batch.findOne({
        $or: [{ batchId: batchIdStr }, { batchNumber: batchIdStr }],
      });

      if (!batch) {
        this.logReconciliation('BatchRecalled', batchIdStr, 'SKIPPED_NOT_FOUND', 'Batch not found in DB');
        return;
      }

      // IDEMPOTENCY CHECK: If already marked as recalled, skip!
      if (batch.isRecalled && batch.status === 'Recalled') {
        this.skippedAlreadyConsistentCount++;
        this.logReconciliation(
          'BatchRecalled',
          batch.batchNumber,
          'SKIPPED_ALREADY_CONSISTENT',
          `Batch "${batch.batchNumber}" is already recalled in MongoDB.`
        );
        return;
      }

      // Reconcile batch record
      batch.isRecalled = true;
      batch.recalled = true;
      batch.status = 'Recalled';
      batch.recallReason = reason || batch.recallReason || 'On-chain emergency recall';
      batch.recalledAt = batch.recalledAt || new Date();
      if (txHash) {
        batch.technicalProof = batch.technicalProof || {};
        batch.technicalProof.recallTxHash = txHash;
      }
      await batch.save();

      // Reconcile all units of this batch
      const updatedUnits = await Unit.updateMany(
        { batch: batch._id, status: { $ne: 'recalled' } },
        {
          $set: {
            status: 'recalled',
            recallReason: reason,
            recalledAt: new Date(),
          },
        }
      );

      this.reconciledEventsCount++;
      this.logReconciliation(
        'BatchRecalled',
        batch.batchNumber,
        'RECONCILED',
        `Reconciled recall for batch ${batch.batchNumber} and ${updatedUnits.modifiedCount} units.`
      );
      console.log(`[EventListener Reconciled] Batch ${batch.batchNumber} recalled via on-chain event.`);
    } catch (err) {
      this.logReconciliation('BatchRecalled', String(batchIdHex), 'ERROR', err.message);
    }
  }

  /**
   * 2. Reconcile Batch Custody Transfer
   */
  async reconcileBatchTransfer(transferIdHex, targetStatus, fromAddr, toAddr, quantity, txHash) {
    try {
      this.lastEventProcessedAt = new Date();
      this.eventStats.batchTransfers++;

      const transferIdStr = String(transferIdHex);

      const transfer = await Transfer.findOne({
        $or: [{ transferIdBytes32: transferIdStr }, { transferId: transferIdStr }],
      });

      if (!transfer) {
        this.logReconciliation('BatchTransfer', transferIdStr, 'SKIPPED_NOT_FOUND', 'Transfer not found in DB');
        return;
      }

      // IDEMPOTENCY CHECK: If status already matches, skip!
      if (transfer.status === targetStatus) {
        this.skippedAlreadyConsistentCount++;
        this.logReconciliation(
          `BatchTransfer${targetStatus}`,
          transfer.transferId,
          'SKIPPED_ALREADY_CONSISTENT',
          `Transfer status is already "${targetStatus}".`
        );
        return;
      }

      // Reconcile status and append safety timeline event
      transfer.status = targetStatus;
      transfer.timeline = transfer.timeline || [];
      transfer.timeline.push({
        status: targetStatus,
        action: targetStatus === 'Accepted' ? 'ACCEPTED' : 'REJECTED',
        timestamp: new Date(),
        actor: transfer.toUser || transfer.fromUser,
        actorName: 'On-Chain Event Listener',
        actorRole: 'System',
        note: `Reconciled from on-chain event (${txHash || 'Sync'})`,
      });
      await transfer.save();

      // If accepted, idempotently update recipient partner inventory
      if (targetStatus === 'Accepted' && transfer.toPartner) {
        await PartnerInventory.findOneAndUpdate(
          { partner: transfer.toPartner, batch: transfer.batch },
          {
            $inc: {
              inStock: Number(quantity) || transfer.quantity,
              totalReceived: Number(quantity) || transfer.quantity,
            },
            $set: {
              batchNumber: transfer.batchNumber,
              lastTransferAt: new Date(),
              status: 'In Stock',
            },
          },
          { upsert: true, new: true }
        );
      }

      this.reconciledEventsCount++;
      this.logReconciliation(
        `BatchTransfer${targetStatus}`,
        transfer.transferId,
        'RECONCILED',
        `Transfer ${transfer.transferId} status reconciled to ${targetStatus}.`
      );
      console.log(`[EventListener Reconciled] Transfer ${transfer.transferId} marked ${targetStatus}.`);
    } catch (err) {
      this.logReconciliation('BatchTransfer', String(transferIdHex), 'ERROR', err.message);
    }
  }

  /**
   * 3. Reconcile Retail Sale
   */
  async reconcileUnitSold(batchId, unitCode, unitHash, retailerAddr, customerAddr, txHash) {
    try {
      this.lastEventProcessedAt = new Date();
      this.eventStats.sales++;

      const unit = await Unit.findOne({
        $or: [{ unitCode }, { leafHash: String(unitHash) }],
      });

      if (!unit) {
        this.logReconciliation('UnitSold', unitCode, 'SKIPPED_NOT_FOUND', 'Unit not found in DB');
        return;
      }

      // IDEMPOTENCY CHECK: If already sold or claimed, skip!
      if (unit.soldState >= 1 || unit.status === 'sold' || unit.status === 'claimed') {
        this.skippedAlreadyConsistentCount++;
        this.logReconciliation(
          'UnitSold',
          unit.unitCode,
          'SKIPPED_ALREADY_CONSISTENT',
          `Unit "${unit.unitCode}" is already in sold/claimed state.`
        );
        return;
      }

      // Reconcile unit sale state
      unit.soldState = 1;
      unit.status = 'sold';
      unit.currentOwnerWallet = customerAddr;
      unit.soldAt = unit.soldAt || new Date();

      // Link customer user if exists
      if (customerAddr) {
        const customerUser = await User.findOne({
          walletAddress: new RegExp(customerAddr.trim(), 'i'),
        });
        if (customerUser) {
          unit.customer = customerUser._id;
        }
      }

      await unit.save();

      this.reconciledEventsCount++;
      this.logReconciliation(
        'UnitSold',
        unit.unitCode,
        'RECONCILED',
        `Unit "${unit.unitCode}" marked sold to ${customerAddr}.`
      );
      console.log(`[EventListener Reconciled] Unit "${unit.unitCode}" marked as sold.`);
    } catch (err) {
      this.logReconciliation('UnitSold', unitCode, 'ERROR', err.message);
    }
  }

  /**
   * 4. Reconcile Customer Ownership Claim
   */
  async reconcileUnitClaimed(batchId, unitCode, unitHash, customerAddr, txHash) {
    try {
      this.lastEventProcessedAt = new Date();
      this.eventStats.claims++;

      const unit = await Unit.findOne({
        $or: [{ unitCode }, { leafHash: String(unitHash) }],
      });

      if (!unit) {
        this.logReconciliation('UnitClaimed', unitCode, 'SKIPPED_NOT_FOUND', 'Unit not found in DB');
        return;
      }

      // IDEMPOTENCY CHECK: If already claimed, skip!
      if (unit.soldState === 2 && unit.status === 'claimed') {
        this.skippedAlreadyConsistentCount++;
        this.logReconciliation(
          'UnitClaimed',
          unit.unitCode,
          'SKIPPED_ALREADY_CONSISTENT',
          `Unit "${unit.unitCode}" is already in claimed state.`
        );
        return;
      }

      unit.soldState = 2;
      unit.status = 'claimed';
      unit.currentOwnerWallet = customerAddr;
      unit.claimedAt = unit.claimedAt || new Date();

      if (customerAddr) {
        const customerUser = await User.findOne({
          walletAddress: new RegExp(customerAddr.trim(), 'i'),
        });
        if (customerUser) {
          unit.customer = customerUser._id;
        }
      }

      await unit.save();

      this.reconciledEventsCount++;
      this.logReconciliation(
        'UnitClaimed',
        unit.unitCode,
        'RECONCILED',
        `Unit "${unit.unitCode}" ownership claimed by ${customerAddr}.`
      );
      console.log(`[EventListener Reconciled] Unit "${unit.unitCode}" claimed.`);
    } catch (err) {
      this.logReconciliation('UnitClaimed', unitCode, 'ERROR', err.message);
    }
  }

  /**
   * 5. Reconcile Reward Points Minted
   */
  async reconcileRewardMinted(toAddr, amount, reason, txHash) {
    try {
      this.lastEventProcessedAt = new Date();
      this.eventStats.rewards++;

      const user = await User.findOne({
        walletAddress: new RegExp(String(toAddr).trim(), 'i'),
      });

      if (!user) {
        this.logReconciliation('RewardMinted', String(toAddr), 'SKIPPED_NOT_FOUND', 'User wallet not registered in DB');
        return;
      }

      const pointsNumber = Number(amount) || 10;

      // IDEMPOTENCY CHECK: Check if reward ledger already recorded this recently
      const recentLedger = await RewardLedger.findOne({
        user: user._id,
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
        points: pointsNumber,
      });

      if (recentLedger) {
        this.skippedAlreadyConsistentCount++;
        this.logReconciliation(
          'RewardMinted',
          user.name,
          'SKIPPED_ALREADY_CONSISTENT',
          `Reward already logged in ledger (Ledger ID: ${recentLedger._id}).`
        );
        return;
      }

      // Reconcile points ledger
      user.pointsBalance = (user.pointsBalance || 0) + pointsNumber;
      await user.save();

      await RewardLedger.create({
        user: user._id,
        type: 'FIRST_SCAN_REWARD',
        points: pointsNumber,
        description: `On-chain reward reconciled: ${reason || 'Platform verified activity'}`,
        balanceAfter: user.pointsBalance,
      });

      this.reconciledEventsCount++;
      this.logReconciliation(
        'RewardMinted',
        user.name,
        'RECONCILED',
        `Reconciled ${pointsNumber} TrustPoints to user "${user.name}".`
      );
      console.log(`[EventListener Reconciled] Awarded ${pointsNumber} TPTS to ${user.name}.`);
    } catch (err) {
      this.logReconciliation('RewardMinted', String(toAddr), 'ERROR', err.message);
    }
  }

  /**
   * 6. Reconcile Offer Redeemed
   */
  async reconcileOfferRedeemed(fromAddr, amount, offerId, txHash) {
    try {
      this.lastEventProcessedAt = new Date();
      this.eventStats.rewards++;

      const user = await User.findOne({
        walletAddress: new RegExp(String(fromAddr).trim(), 'i'),
      });

      if (!user) return;

      const pointsBurned = Number(amount) || 0;

      // IDEMPOTENCY CHECK: Check if redemption already created
      const recentRedemption = await Redemption.findOne({
        user: user._id,
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
      });

      if (recentRedemption) {
        this.skippedAlreadyConsistentCount++;
        return;
      }

      user.pointsBalance = Math.max(0, (user.pointsBalance || 0) - pointsBurned);
      await user.save();

      this.reconciledEventsCount++;
      this.logReconciliation(
        'OfferRedeemed',
        user.name,
        'RECONCILED',
        `Redeemed ${pointsBurned} TPTS from user "${user.name}".`
      );
    } catch (err) {
      this.logReconciliation('OfferRedeemed', String(fromAddr), 'ERROR', err.message);
    }
  }

  /**
   * Get current listener health status & metrics
   */
  getStatus() {
    return {
      status: this.isListening ? 'ACTIVE' : 'STANDBY',
      isListening: this.isListening,
      startedAt: this.startedAt,
      uptimeSeconds: this.startedAt ? Math.floor((Date.now() - this.startedAt.getTime()) / 1000) : 0,
      lastEventProcessedAt: this.lastEventProcessedAt,
      lastProcessedBlock: this.lastProcessedBlock,
      reconciledEventsCount: this.reconciledEventsCount,
      skippedAlreadyConsistentCount: this.skippedAlreadyConsistentCount,
      eventStats: this.eventStats,
      subscribedEvents: [
        'BatchRecalled',
        'BatchTransferAccepted',
        'BatchTransferRejected',
        'UnitSold',
        'UnitClaimed',
        'RewardMinted',
        'OfferRedeemed',
      ],
      recentReconciliationLog: this.recentLogs.slice(0, 15),
    };
  }

  /**
   * Stop listeners (graceful shutdown)
   */
  stop() {
    this.isListening = false;
    this.isActive = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    console.log('[EventListener] Live listener stopped.');
  }
}

const listenerService = new EventListenerService();
module.exports = listenerService;
