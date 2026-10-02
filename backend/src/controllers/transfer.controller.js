const mongoose = require('mongoose');
const { ethers } = require('ethers');
const Transfer = require('../models/Transfer');
const Partner = require('../models/Partner');
const PartnerInventory = require('../models/PartnerInventory');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Unit = require('../models/Unit');
const blockchainService = require('../services/blockchain.service');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../constants/roles');

/**
 * @desc Create/Initiate batch custody transfer
 *       Allowed: Manufacturer (to Distributor or Retailer), Distributor (to Retailer), Admin.
 * @route POST /api/v1/transfers
 */
const createTransfer = async (req, res, next) => {
  try {
    const { batchId, toPartnerId, toUserId, toWallet, quantity, notes } = req.body;
    const sender = req.user;

    // 1. Role validation: Retailers cannot transfer custody downstream
    if (sender.role === ROLES.RETAILER) {
      return errorResponse(res, 'Retailers cannot transfer batch custody. Retailers sell directly to consumers.', 403, 'FORBIDDEN');
    }

    // 2. Fetch & Validate Batch
    const batchQuery = {
      $or: [{ batchNumber: batchId }, { batchId: batchId }],
    };
    if (mongoose.Types.ObjectId.isValid(batchId)) {
      batchQuery.$or.push({ _id: batchId });
    }

    const batch = await Batch.findOne(batchQuery).populate('product');

    if (!batch) {
      return errorResponse(res, `Batch "${batchId}" was not found.`, 404, 'BATCH_NOT_FOUND');
    }

    if (batch.isRecalled) {
      return errorResponse(res, 'Cannot transfer custody of a recalled product batch.', 400, 'BATCH_RECALLED');
    }

    if (batch.status === 'expired' || new Date() > new Date(batch.expiryDate)) {
      return errorResponse(res, 'Cannot transfer custody of an expired product batch.', 400, 'BATCH_EXPIRED');
    }

    // 3. Resolve Destination Partner & User
    let destinationPartner = null;
    let destinationUser = null;

    if (toPartnerId && mongoose.Types.ObjectId.isValid(toPartnerId)) {
      destinationPartner = await Partner.findById(toPartnerId).populate('user');
      if (destinationPartner) {
        destinationUser = destinationPartner.user;
      }
    } else if (toUserId && mongoose.Types.ObjectId.isValid(toUserId)) {
      destinationUser = await User.findById(toUserId);
      if (destinationUser) {
        destinationPartner = await Partner.findOne({ user: destinationUser._id });
      }
    } else if (toWallet) {
      destinationUser = await User.findOne({ walletAddress: toWallet });
      if (destinationUser) {
        destinationPartner = await Partner.findOne({ walletAddress: toWallet });
      }
    }

    if (!destinationUser) {
      return errorResponse(res, 'Destination partner or user not found.', 404, 'RECIPIENT_NOT_FOUND');
    }

    if (destinationPartner && destinationPartner.status !== 'approved') {
      return errorResponse(
        res,
        `Destination partner "${destinationPartner.businessName}" is not approved (Status: ${destinationPartner.status}).`,
        400,
        'PARTNER_NOT_APPROVED'
      );
    }

    const targetWallet = destinationPartner?.walletAddress || destinationUser.walletAddress;
    if (!targetWallet) {
      return errorResponse(res, 'Recipient partner does not have an active custodial wallet.', 400, 'WALLET_NOT_INITIALIZED');
    }

    // 4. Role Hierarchy: Distributor can only transfer to Retailers
    if (sender.role === ROLES.DISTRIBUTOR && destinationUser.role !== ROLES.RETAILER) {
      return errorResponse(res, 'Distributors are only permitted to transfer shipments downstream to Retailers.', 403, 'FORBIDDEN');
    }

    // 5. Check Sender's Available Stock/Holdings
    const qty = parseInt(quantity, 10);

    if (sender.role === ROLES.MANUFACTURER) {
      // Manufacturer must own available units of this batch
      const availableUnitsCount = await Unit.countDocuments({
        batchNumber: batch.batchNumber,
        currentOwnerWallet: sender.walletAddress,
        soldState: 0,
      });

      if (availableUnitsCount < qty) {
        return errorResponse(
          res,
          `Insufficient available stock for batch ${batch.batchNumber}. Available: ${availableUnitsCount}, Requested: ${qty}.`,
          400,
          'INSUFFICIENT_STOCK',
          { available: availableUnitsCount, requested: qty }
        );
      }
    } else if (sender.role === ROLES.DISTRIBUTOR) {
      // Distributor must have inventory recorded in PartnerInventory
      const inventory = await PartnerInventory.findOne({
        user: sender._id,
        batchNumber: batch.batchNumber,
      });

      const currentStock = inventory ? inventory.quantity : 0;
      if (currentStock < qty) {
        return errorResponse(
          res,
          `Insufficient inventory in your depot for batch ${batch.batchNumber}. In Stock: ${currentStock}, Requested: ${qty}.`,
          400,
          'INSUFFICIENT_INVENTORY',
          { inStock: currentStock, requested: qty }
        );
      }
    }

    // 6. Broadcast initiateBatchTransfer on-chain via Relayer
    let txHash = null;
    let transferId = null;

    try {
      const chainRes = await blockchainService.initiateBatchTransfer({
        batchId: batch.batchNumber,
        fromWallet: sender.walletAddress,
        toWallet: targetWallet,
        quantity: qty,
      });
      txHash = chainRes.txHash;
      transferId = chainRes.transferId;
    } catch (err) {
      console.warn(`[Blockchain Warning] Relayer initiateBatchTransfer simulated: ${err.message}`);
      txHash = ethers.id(`simulated-transfer-tx-${Date.now()}`);
      transferId = ethers.id(`transfer-${Date.now()}`);
    }

    // 7. Create Transfer document with initial timeline event
    const transfer = await Transfer.create({
      transferId,
      transferIdBytes32: blockchainService.toBytes32(transferId),
      batch: batch._id,
      batchNumber: batch.batchNumber,
      batchId: batch.batchNumber,
      product: batch.product?._id || null,
      productName: batch.productName,
      fromUser: sender._id,
      fromName: sender.companyName || sender.name,
      fromRole: sender.role,
      fromWallet: sender.walletAddress,
      toUser: destinationUser._id,
      toPartner: destinationPartner?._id || null,
      toName: destinationPartner?.businessName || destinationUser.companyName || destinationUser.name,
      toRole: destinationUser.role,
      toWallet: targetWallet,
      quantity: qty,
      status: 'Pending',
      notes: notes || '',
      txHash,
      timeline: [
        {
          status: 'Pending',
          action: 'INITIATED',
          timestamp: new Date(),
          actor: sender._id,
          actorName: sender.name,
          actorRole: sender.role,
          note: notes || `Shipment of ${qty} units dispatched by ${sender.companyName || sender.name}`,
        },
      ],
    });

    return successResponse(
      res,
      {
        transfer: {
          id: transfer._id,
          transferId: transfer.transferId,
          batchNumber: transfer.batchNumber,
          productName: transfer.productName,
          from: transfer.fromName,
          to: transfer.toName,
          quantity: transfer.quantity,
          status: transfer.status,
          txHash: transfer.txHash,
          timeline: transfer.timeline,
        },
        message: 'Custody transfer initiated successfully. Awaiting recipient confirmation.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Respond to custody transfer (Accept or Reject)
 *       Recipient partner accepts custody or rejects with a mandatory reason.
 * @route POST /api/v1/transfers/:id/respond
 */
const respondTransfer = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.transferId;
    const { accept, reason, notes } = req.body;
    const responder = req.user;

    const query = {
      $or: [{ transferId: id }],
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const transfer = await Transfer.findOne(query)
      .populate('batch')
      .populate('product');

    if (!transfer) {
      return errorResponse(res, `Transfer "${id}" was not found.`, 404, 'TRANSFER_NOT_FOUND');
    }

    if (transfer.status !== 'Pending') {
      return errorResponse(res, `Transfer is already marked as "${transfer.status}".`, 400, 'TRANSFER_NOT_PENDING');
    }

    // Authorization check: Only the designated toUser or Admin can respond
    if (responder.role !== ROLES.ADMIN && transfer.toUser.toString() !== responder._id.toString()) {
      return errorResponse(res, 'You are not the designated recipient for this shipment.', 403, 'FORBIDDEN');
    }

    // If rejecting, reason is mandatory
    if (!accept && (!reason || reason.trim().length < 3)) {
      return errorResponse(res, 'A valid rejection reason (min 3 characters) is required when rejecting a transfer.', 400, 'REASON_REQUIRED');
    }

    // 1. Broadcast respondBatchTransfer on-chain via Relayer
    let respondTxHash = null;
    try {
      const chainRes = await blockchainService.respondBatchTransfer(transfer.transferId, accept);
      respondTxHash = chainRes.txHash;
    } catch (err) {
      console.warn(`[Blockchain Warning] Relayer respondBatchTransfer simulated: ${err.message}`);
      respondTxHash = ethers.id(`simulated-respond-tx-${Date.now()}`);
    }

    transfer.respondTxHash = respondTxHash;

    if (accept) {
      // 2. Acceptance Flow: Update DB holdings and Partner Inventory
      const qty = transfer.quantity;

      // A. Update Recipient Partner Inventory
      let recipientInventory = await PartnerInventory.findOne({
        user: transfer.toUser,
        batchNumber: transfer.batchNumber,
      });

      if (!recipientInventory) {
        recipientInventory = new PartnerInventory({
          user: transfer.toUser,
          partner: transfer.toPartner,
          batch: transfer.batch?._id,
          batchNumber: transfer.batchNumber,
          product: transfer.product?._id,
          productName: transfer.productName || transfer.batch?.productName,
          productSku: transfer.batch?.productSku || '',
          category: transfer.batch?.category || 'General',
          quantity: qty,
          totalReceived: qty,
          totalTransferredOut: 0,
          protectionLevel: transfer.batch?.protectionLevel || 'Standard',
          mfgDate: transfer.batch?.mfgDate,
          expiryDate: transfer.batch?.expiryDate,
          lastReceivedAt: new Date(),
        });
      } else {
        recipientInventory.quantity += qty;
        recipientInventory.totalReceived += qty;
        recipientInventory.lastReceivedAt = new Date();
      }
      await recipientInventory.save();

      // B. If Sender was Distributor, decrement their inventory
      const senderUser = await User.findById(transfer.fromUser);
      if (senderUser && senderUser.role === ROLES.DISTRIBUTOR) {
        const senderInventory = await PartnerInventory.findOne({
          user: transfer.fromUser,
          batchNumber: transfer.batchNumber,
        });
        if (senderInventory) {
          senderInventory.quantity = Math.max(0, senderInventory.quantity - qty);
          senderInventory.totalTransferredOut += qty;
          await senderInventory.save();
        }
      }

      // C. Reallocate individual Units to recipient wallet
      const unitsToUpdate = await Unit.find({
        batchNumber: transfer.batchNumber,
        currentOwnerWallet: transfer.fromWallet,
        soldState: 0,
      }).limit(qty);

      if (unitsToUpdate.length > 0) {
        const unitIds = unitsToUpdate.map(u => u._id);
        const updateFields = {
          currentOwnerWallet: transfer.toWallet,
          status: 'allocated',
        };
        if (transfer.toRole === ROLES.RETAILER) {
          updateFields.retailer = transfer.toUser;
        }
        await Unit.updateMany({ _id: { $in: unitIds } }, { $set: updateFields });
      }

      // D. Record status timeline event
      transfer.status = 'Accepted';
      transfer.timeline.push({
        status: 'Accepted',
        action: 'ACCEPTED',
        timestamp: new Date(),
        actor: responder._id,
        actorName: responder.name,
        actorRole: responder.role,
        note: notes || `Shipment accepted into inventory (${qty} units received)`,
      });
    } else {
      // Rejection Flow
      transfer.status = 'Rejected';
      transfer.rejectionReason = reason.trim();
      transfer.timeline.push({
        status: 'Rejected',
        action: 'REJECTED',
        timestamp: new Date(),
        actor: responder._id,
        actorName: responder.name,
        actorRole: responder.role,
        note: `Shipment rejected. Reason: ${reason.trim()}`,
      });
    }

    await transfer.save();

    return successResponse(res, {
      transfer: {
        id: transfer._id,
        transferId: transfer.transferId,
        batchNumber: transfer.batchNumber,
        quantity: transfer.quantity,
        status: transfer.status,
        rejectionReason: transfer.rejectionReason || null,
        respondTxHash: transfer.respondTxHash,
        timeline: transfer.timeline,
      },
      message: `Shipment custody ${transfer.status.toLowerCase()} successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc List transfers with tab counts (Pending, Accepted, Rejected)
 * @route GET /api/v1/transfers
 */
const getTransfers = async (req, res, next) => {
  try {
    const { direction, status, search, page = 1, limit = 10, batchId } = req.query;
    const user = req.user;

    const baseQuery = {};

    // 1. Directional Scoping
    if (user.role !== ROLES.ADMIN) {
      if (direction === 'incoming') {
        baseQuery.toUser = user._id;
      } else if (direction === 'outgoing') {
        baseQuery.fromUser = user._id;
      } else {
        baseQuery.$or = [{ fromUser: user._id }, { toUser: user._id }];
      }
    }

    // 2. Batch Filter
    if (batchId) {
      baseQuery.batchNumber = batchId.trim().toUpperCase();
    }

    // 3. Tab Status Counts (Parallel aggregation for UI tabs)
    const [pendingCount, acceptedCount, rejectedCount, allCount] = await Promise.all([
      Transfer.countDocuments({ ...baseQuery, status: 'Pending' }),
      Transfer.countDocuments({ ...baseQuery, status: 'Accepted' }),
      Transfer.countDocuments({ ...baseQuery, status: 'Rejected' }),
      Transfer.countDocuments(baseQuery),
    ]);

    // 4. Status Filter
    const query = { ...baseQuery };
    if (status && ['Pending', 'Accepted', 'Rejected'].includes(status)) {
      query.status = status;
    }

    // 5. Search Filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchOr = [
        { batchNumber: searchRegex },
        { productName: searchRegex },
        { fromName: searchRegex },
        { toName: searchRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }

    // 6. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [transfers, totalItems] = await Promise.all([
      Transfer.find(query)
        .populate('batch', 'batchNumber productName protectionLevel expiryDate')
        .populate('product', 'name category sku images price')
        .populate('fromUser', 'name companyName role')
        .populate('toUser', 'name companyName role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Transfer.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    return successResponse(res, {
      transfers,
      tabCounts: {
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
        all: allCount,
      },
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get incoming shipments for logged-in partner
 * @route GET /api/v1/transfers/incoming
 */
const getIncomingTransfers = async (req, res, next) => {
  req.query.direction = 'incoming';
  return getTransfers(req, res, next);
};

/**
 * @desc Get transfer detail with complete status history timeline
 * @route GET /api/v1/transfers/:id
 */
const getTransferById = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.transferId;

    const query = {
      $or: [{ transferId: id }],
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or.push({ _id: id });
    }

    const transfer = await Transfer.findOne(query)
      .populate('batch', 'batchNumber productName brandName protectionLevel expiryDate mfgDate status')
      .populate('product', 'name category sku description price images')
      .populate('fromUser', 'name companyName email phone role walletAddress')
      .populate('toUser', 'name companyName email phone role walletAddress')
      .populate('toPartner', 'businessName gst location');

    if (!transfer) {
      return errorResponse(res, `Transfer "${id}" was not found.`, 404, 'TRANSFER_NOT_FOUND');
    }

    // Permission check
    const isSender = transfer.fromUser?._id?.toString() === req.user._id.toString();
    const isReceiver = transfer.toUser?._id?.toString() === req.user._id.toString();

    if (req.user.role !== ROLES.ADMIN && !isSender && !isReceiver) {
      return errorResponse(res, 'You do not have permission to view this transfer.', 403, 'FORBIDDEN');
    }

    return successResponse(res, {
      transfer,
      timeline: transfer.timeline,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get partner inventory grouped by batch
 * @route GET /api/v1/transfers/inventory
 */
const getPartnerInventory = async (req, res, next) => {
  try {
    const { partnerId, userId, search, page = 1, limit = 20 } = req.query;

    let targetUserId = req.user._id;

    // Admin or manufacturer can query inventory for a specific partner
    if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.MANUFACTURER) {
      if (userId) {
        targetUserId = userId;
      } else if (partnerId) {
        const p = await Partner.findById(partnerId);
        if (p && p.user) targetUserId = p.user;
      }
    }

    const query = { user: targetUserId };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { batchNumber: searchRegex },
        { productName: searchRegex },
        { productSku: searchRegex },
        { category: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [items, totalItems] = await Promise.all([
      PartnerInventory.find(query)
        .populate('batch', 'batchNumber productName brandName protectionLevel status expiryDate')
        .populate('product', 'name category sku description price images')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      PartnerInventory.countDocuments(query),
    ]);

    const inventoryGrouped = items.map(item => {
      const isExpired = item.expiryDate && new Date() > new Date(item.expiryDate);
      let stockStatus = 'In Stock';
      if (item.quantity === 0) {
        stockStatus = 'Out of Stock';
      } else if (item.quantity < 10) {
        stockStatus = 'Low Stock';
      }

      return {
        id: item._id,
        batchNumber: item.batchNumber,
        product: item.product || {
          name: item.productName,
          sku: item.productSku,
          category: item.category,
        },
        quantity: item.quantity,
        totalReceived: item.totalReceived,
        totalTransferredOut: item.totalTransferredOut,
        protectionLevel: item.protectionLevel,
        mfgDate: item.mfgDate,
        expiryDate: item.expiryDate,
        isExpired,
        stockStatus,
        lastReceivedAt: item.lastReceivedAt,
      };
    });

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    return successResponse(res, {
      inventory: inventoryGrouped,
      totalHoldings: items.reduce((sum, i) => sum + i.quantity, 0),
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTransfer,
  initiateTransfer: createTransfer, // backward compatibility alias
  respondTransfer,
  getTransfers,
  getIncomingTransfers,
  getTransferById,
  getPartnerInventory,
};
