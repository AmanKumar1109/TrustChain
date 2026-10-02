const { ethers } = require('ethers');
const { MerkleTree } = require('merkletreejs');
const Unit = require('../models/Unit');
const Batch = require('../models/Batch');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Transfer = require('../models/Transfer');
const Scan = require('../models/Scan');
const blockchainService = require('../services/blockchain.service');
const contractService = require('../services/contract.service');
const rewardService = require('../services/reward.service');
const { leafHash, MerkleTreeBuilder } = require('../utils/merkle');
const { successResponse, errorResponse } = require('../utils/response');
const config = require('../config/env');

/**
 * Helper to extract client city for demo simulation or geo detection
 */
const resolveClientCity = (req) => {
  return (
    req.query.city ||
    req.query.simulateCity ||
    req.headers['x-simulate-city'] ||
    req.headers['x-city'] ||
    req.headers['x-forwarded-city'] ||
    req.headers['x-geo-city'] ||
    req.body?.city ||
    'Delhi'
  );
};

/**
 * Helper to format product details
 */
const formatProductDetails = (batch, unit) => {
  const prod = unit?.product || batch?.product || {};
  return {
    id: prod._id || null,
    name: prod.name || batch?.productName || 'Unknown Product',
    category: prod.category || batch?.category || 'General',
    sku: prod.sku || batch?.productSku || '',
    description: prod.description || batch?.description || '',
    images: prod.images || [],
    price: prod.price || 0,
    protectionLevel: batch?.protectionLevel || unit?.protectionLevel || 'Standard',
  };
};

/**
 * Helper to format brand details
 */
const formatBrandDetails = (batch) => {
  const brand = batch?.brand || {};
  return {
    id: brand._id || null,
    name: batch?.brandName || brand.companyName || batch?.manufacturer?.companyName || 'Authorized Brand',
    companyName: brand.companyName || batch?.brandName || 'Authorized Brand',
    gst: brand.gst || null,
    cin: brand.cin || null,
    status: brand.status || 'approved',
    verified: true,
  };
};

/**
 * Helper to construct the technical cryptographic proof
 */
const buildTechnicalProof = (batch, unit, proof, verifiedOnChain) => {
  const addresses = contractService.addresses || {};
  const registryContract = contractService.getRegistryContract();
  const contractAddress =
    addresses.TrustChainRegistry ||
    (registryContract ? registryContract.target : '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');

  return {
    txHash: batch?.txHash || null,
    contractAddress,
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: batch?.merkleRoot || null,
    leaf: unit ? leafHash(unit.unitCode) : null,
    proof: proof || [],
    verifiedOnChain: verifiedOnChain ?? true,
  };
};

/**
 * Helper to construct ownership timeline from DB models
 */
const buildOwnershipTimeline = async (batch, unit, clientCity, state, reason, reqUser) => {
  const timeline = [];

  // 1. Batch Registered / Manufactured
  if (batch) {
    timeline.push({
      stage: 'Manufactured',
      action: 'BATCH_REGISTERED',
      title: 'Batch Manufactured & Registered On-Chain',
      timestamp: batch.mfgDate || batch.createdAt,
      actor: batch.brandName || batch.manufacturer?.companyName || 'Manufacturer',
      actorRole: 'manufacturer',
      location: 'Manufacturing Plant',
      txHash: batch.txHash || null,
      notes: `Batch ${batch.batchNumber} (${batch.quantity} units, ${batch.protectionLevel} protection) registered on-chain with cryptographic Merkle root.`,
    });

    // 2. Custody Transfers from DB
    try {
      const transfers = await Transfer.find({
        $or: [{ batchId: batch.batchId }, { batchNumber: batch.batchNumber }],
        status: 'Accepted',
      }).sort({ updatedAt: 1 });

      for (const t of transfers) {
        timeline.push({
          stage: t.toRole === 'retailer' ? 'Retail Delivery' : 'Distribution',
          action: 'CUSTODY_TRANSFERRED',
          title: `Custody Transferred to ${t.toRole.charAt(0).toUpperCase() + t.toRole.slice(1)}`,
          timestamp: t.updatedAt || t.createdAt,
          actor: t.toName || t.toRole,
          actorRole: t.toRole,
          from: t.fromName,
          to: t.toName,
          txHash: t.respondTxHash || t.txHash || null,
          notes: t.notes || `Dispatched and accepted ${t.quantity} units into local inventory.`,
        });
      }
    } catch (e) {
      console.warn(`[Timeline Warning] Failed fetching transfers: ${e.message}`);
    }
  }

  // 3. Retailer stocking (if unit assigned)
  if (unit && unit.retailer) {
    timeline.push({
      stage: 'Retail Stock',
      action: 'ASSIGNED_TO_RETAILER',
      title: 'Stocked at Authorized Retail Outlet',
      timestamp: unit.updatedAt || new Date(),
      actor: unit.retailer.companyName || unit.retailer.name || 'Authorized Retailer',
      actorRole: 'retailer',
      notes: 'Product stocked on retail shelf and available for customer purchase.',
    });
  }

  // 4. Retail Sale (if marked sold)
  if (unit && (unit.soldState === 1 || unit.soldState === 2 || unit.status === 'sold' || unit.soldAt)) {
    timeline.push({
      stage: 'Retail Sale',
      action: 'PRODUCT_SOLD',
      title: 'Purchased at Retail Store',
      timestamp: unit.soldAt || unit.updatedAt || new Date(),
      actor: unit.retailer?.companyName || 'Authorized Retailer',
      actorRole: 'retailer',
      notes: 'Product unit scanned and sold at retail point-of-sale.',
    });
  }

  // 5. Warranty & Rewards Claim (if claimed by consumer)
  if (unit && (unit.soldState === 2 || unit.status === 'claimed' || unit.claimedAt || unit.claimedBy)) {
    timeline.push({
      stage: 'Consumer Ownership',
      action: 'WARRANTY_CLAIMED',
      title: 'Warranty & Rewards Claimed by Consumer',
      timestamp: unit.claimedAt || unit.updatedAt || new Date(),
      actor: unit.claimedBy?.name || 'Verified Consumer',
      actorRole: 'consumer',
      notes: 'Ownership confirmed; TrustPoints (TPTS) loyalty rewards credited.',
    });
  }

  // 6. Current Public Verification Scan
  timeline.push({
    stage: 'Verification',
    action: 'VERIFIED',
    title: `Product Scanned in ${clientCity}`,
    timestamp: new Date(),
    actor: reqUser ? reqUser.name : 'Public Consumer',
    actorRole: 'consumer',
    location: clientCity,
    notes: `Result: ${state.toUpperCase()}${reason ? ` (${reason})` : ''}`,
  });

  return timeline;
};

/**
 * @desc Public Product Verification
 *       GET /api/v1/verify/:code
 *       No login required, optional auth for rewards
 */
const verifyProduct = async (req, res, next) => {
  try {
    const rawCode = (req.params.code || req.body?.code || req.query?.code || '').trim();
    if (!rawCode) {
      return errorResponse(res, 'Product verification code is required.', 400, 'CODE_REQUIRED');
    }

    const code = decodeURIComponent(rawCode);
    const clientCity = resolveClientCity(req);
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const reqUser = req.user || null;

    // Configurable clone detection parameters
    const scanThreshold = config.cloneScanThreshold || 50;
    const windowMinutes = config.cloneWindowMinutes || 5;

    // 1. Resolve Unit and Batch
    let unit = await Unit.findOne({ unitCode: code })
      .populate('product')
      .populate('retailer', 'name companyName email phone role walletAddress')
      .populate('claimedBy', 'name email phone role walletAddress');

    // If not found and code contains secret scratch delimiter (#), check base code
    if (!unit && code.includes('#')) {
      const baseCode = code.split('#')[0];
      unit = await Unit.findOne({ unitCode: baseCode })
        .populate('product')
        .populate('retailer', 'name companyName email phone role walletAddress')
        .populate('claimedBy', 'name email phone role walletAddress');
    }

    // Also handle case where stored unitCode has secret suffix but query has base code
    if (!unit) {
      const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      unit = await Unit.findOne({ unitCode: new RegExp(`^${escaped}(#.*)?$`, 'i') })
        .populate('product')
        .populate('retailer', 'name companyName email phone role walletAddress')
        .populate('claimedBy', 'name email phone role walletAddress');
    }

    let batch = null;
    if (unit) {
      batch = await Batch.findById(unit.batch)
        .populate('brand')
        .populate('product')
        .populate('manufacturer', 'name companyName email walletAddress');

      if (!batch && (unit.batchId || unit.batchNumber)) {
        batch = await Batch.findOne({
          $or: [{ batchId: unit.batchId }, { batchNumber: unit.batchNumber }],
        })
          .populate('brand')
          .populate('product')
          .populate('manufacturer', 'name companyName email walletAddress');
      }
    }

    // 2. If Unknown -> return state 'notFound'
    if (!unit || !batch) {
      await Scan.create({
        code,
        userId: reqUser ? reqUser._id : null,
        ip: clientIp,
        city: clientCity,
        geo: { city: clientCity, country: 'India' },
        timestamp: new Date(),
        result: 'notFound',
        reason: 'Product unit code not found in TrustChain registry.',
      });

      return successResponse(res, {
        state: 'notFound',
        reason: 'This product code was not found in the TrustChain registry. It is unverified or unregistered.',
        code,
        scanCount: 1,
        productDetails: null,
        product: null,
        brand: null,
        batchNumber: null,
        mfg: null,
        expiry: null,
        mfgDate: null,
        expiryDate: null,
        ownershipTimeline: [],
        technicalProof: null,
      });
    }

    // 3. Build Merkle Proof and call on-chain verifyUnit
    let proof = unit.proof || [];
    if (!proof || proof.length === 0) {
      try {
        const allUnits = await Unit.find({ batchId: unit.batchId }).sort({ unitCode: 1 });
        if (allUnits && allUnits.length > 0) {
          const tree = new MerkleTreeBuilder(allUnits.map(u => u.unitCode));
          proof = tree.getProof(unit.unitCode);
        }
      } catch (merkleErr) {
        console.warn(`[Merkle Tree Warning] Rebuilding proof failed: ${merkleErr.message}`);
      }
    }

    let onChainResult = null;
    try {
      onChainResult = await blockchainService.verifyUnitOnChain(
        batch.batchIdBytes32 || batch.batchId,
        unit.unitCode,
        proof
      );
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] verifyUnitOnChain simulated/fallback: ${chainErr.message}`);
      // Cryptographic local verification matching TrustChainRegistry.sol
      const leaf = leafHash(unit.unitCode);
      const isProofValid = MerkleTree.verify(proof, leaf, batch.merkleRoot);
      onChainResult = {
        exists: isProofValid,
        expired: new Date() > new Date(batch.expiryDate),
        recalled: batch.isRecalled,
        recallReason: batch.recallReason || '',
        soldState: unit.soldState || 0,
        currentOwner: unit.currentOwnerWallet,
      };
    }

    const timeline = await buildOwnershipTimeline(batch, unit, clientCity, 'pending', null, reqUser);
    const productDetails = formatProductDetails(batch, unit);
    const brandDetails = formatBrandDetails(batch);

    // 4. Invalid Proof -> return state 'fake'
    if (!onChainResult || !onChainResult.exists) {
      const finalState = 'fake';
      const reason = 'Invalid cryptographic Merkle proof against registered batch root. Potential counterfeit or tampered code.';

      await Scan.create({
        code,
        userId: reqUser ? reqUser._id : null,
        unit: unit._id,
        batch: batch._id,
        batchId: batch.batchId,
        ip: clientIp,
        city: clientCity,
        geo: { city: clientCity, country: 'India' },
        timestamp: new Date(),
        result: finalState,
        reason,
      });

      return successResponse(res, {
        state: finalState,
        reason,
        productDetails,
        product: productDetails,
        brand: brandDetails,
        batchNumber: batch.batchNumber,
        mfg: batch.mfgDate,
        expiry: batch.expiryDate,
        mfgDate: batch.mfgDate,
        expiryDate: batch.expiryDate,
        scanCount: (unit.scanCount || 0) + 1,
        ownershipTimeline: timeline,
        technicalProof: buildTechnicalProof(batch, unit, proof, false),
      });
    }

    // 5. Recalled -> return state 'recalled' with the reason
    if (batch.isRecalled || onChainResult.recalled) {
      const finalState = 'recalled';
      const reason =
        batch.recallReason ||
        onChainResult.recallReason ||
        'This product batch has been recalled by the manufacturer or regulatory authorities.';

      await Scan.create({
        code,
        userId: reqUser ? reqUser._id : null,
        unit: unit._id,
        batch: batch._id,
        batchId: batch.batchId,
        ip: clientIp,
        city: clientCity,
        geo: { city: clientCity, country: 'India' },
        timestamp: new Date(),
        result: finalState,
        reason,
      });

      return successResponse(res, {
        state: finalState,
        reason,
        productDetails,
        product: productDetails,
        brand: brandDetails,
        batchNumber: batch.batchNumber,
        mfg: batch.mfgDate,
        expiry: batch.expiryDate,
        mfgDate: batch.mfgDate,
        expiryDate: batch.expiryDate,
        scanCount: (unit.scanCount || 0) + 1,
        ownershipTimeline: timeline,
        technicalProof: buildTechnicalProof(batch, unit, proof, true),
      });
    }

    // 6. Expired -> return state 'expired'
    const isExpired = new Date() > new Date(batch.expiryDate) || onChainResult.expired;
    if (isExpired) {
      const finalState = 'expired';
      const reason = `Product batch expired on ${new Date(batch.expiryDate).toLocaleDateString('en-IN')}.`;

      await Scan.create({
        code,
        userId: reqUser ? reqUser._id : null,
        unit: unit._id,
        batch: batch._id,
        batchId: batch.batchId,
        ip: clientIp,
        city: clientCity,
        geo: { city: clientCity, country: 'India' },
        timestamp: new Date(),
        result: finalState,
        reason,
      });

      return successResponse(res, {
        state: finalState,
        reason,
        productDetails,
        product: productDetails,
        brand: brandDetails,
        batchNumber: batch.batchNumber,
        mfg: batch.mfgDate,
        expiry: batch.expiryDate,
        mfgDate: batch.mfgDate,
        expiryDate: batch.expiryDate,
        scanCount: (unit.scanCount || 0) + 1,
        ownershipTimeline: timeline,
        technicalProof: buildTechnicalProof(batch, unit, proof, true),
      });
    }

    // 7. Clone Detection
    // Condition A: scan count above configurable threshold (default 50)
    // Condition B: same code scanned from two cities far apart within configurable window (default 5 minutes)
    const priorScansCount = await Scan.countDocuments({ code: unit.unitCode });
    const currentScanCount = Math.max(unit.scanCount || 0, priorScansCount) + 1;

    let isSuspicious = false;
    let suspiciousReason = null;

    if (currentScanCount > scanThreshold) {
      isSuspicious = true;
      suspiciousReason = `High scan velocity detected: Scanned ${currentScanCount} times (exceeds threshold of ${scanThreshold}).`;
    }

    if (!isSuspicious && clientCity && clientCity.toLowerCase() !== 'unknown') {
      const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
      const recentScansInWindow = await Scan.find({
        code: unit.unitCode,
        createdAt: { $gte: windowStart },
      }).sort({ createdAt: -1 });

      for (const pastScan of recentScansInWindow) {
        if (
          pastScan.city &&
          pastScan.city.toLowerCase() !== 'unknown' &&
          pastScan.city.toLowerCase() !== clientCity.toLowerCase()
        ) {
          isSuspicious = true;
          suspiciousReason = `Scanned in 2 different cities within ${windowMinutes} minutes`;
          break;
        }
      }
    }

    let finalState = 'genuine';
    let stateReason = null;

    if (isSuspicious) {
      finalState = 'suspicious';
      stateReason = suspiciousReason;
    } else {
      // 8. If unit is sold and not claimed return soldAwaitingClaim, otherwise genuine
      const isSold =
        unit.status === 'sold' || unit.soldState === 1 || onChainResult.soldState === 1 || !!unit.soldAt;
      const isClaimed =
        unit.status === 'claimed' ||
        unit.soldState === 2 ||
        onChainResult.soldState === 2 ||
        !!unit.claimedAt ||
        !!unit.claimedBy;

      if (isSold && !isClaimed) {
        finalState = 'soldAwaitingClaim';
        stateReason = 'Product has been purchased at retail and is awaiting customer loyalty / warranty claim.';
      } else {
        finalState = 'genuine';
        stateReason = 'Product authenticity cryptographically verified on-chain via Merkle proof.';
      }
    }

    // 9. Log the Scan document
    await Scan.create({
      code: unit.unitCode,
      userId: reqUser ? reqUser._id : null,
      unit: unit._id,
      batch: batch._id,
      batchId: batch.batchId,
      ip: clientIp,
      city: clientCity,
      geo: {
        city: clientCity,
        country: 'India',
      },
      timestamp: new Date(),
      result: finalState,
      reason: stateReason,
      details: {
        scanCount: currentScanCount,
        onChainResult,
        simulatedCity: clientCity,
      },
    });

    // Update unit's scan count in database
    unit.scanCount = currentScanCount;
    await unit.save();

    // 10. Hook first-scan reward into the verify flow without breaking it
    let rewardResult = null;
    if (reqUser && finalState === 'genuine') {
      try {
        rewardResult = await rewardService.processFirstScanReward({
          user: reqUser,
          unit,
          batch,
          clientCity,
        });
      } catch (rewardErr) {
        console.warn(`[Reward Hook Warning] Failed processing first-scan reward: ${rewardErr.message}`);
      }
    }

    // Re-build timeline to reflect final state and verification event
    const finalTimeline = await buildOwnershipTimeline(batch, unit, clientCity, finalState, stateReason, reqUser);

    return successResponse(res, {
      state: finalState,
      reason: stateReason,
      productDetails,
      product: productDetails, // convenient alias
      brand: brandDetails,
      batchNumber: batch.batchNumber,
      mfg: batch.mfgDate,
      expiry: batch.expiryDate,
      mfgDate: batch.mfgDate,
      expiryDate: batch.expiryDate,
      scanCount: currentScanCount,
      ownershipTimeline: finalTimeline,
      technicalProof: buildTechnicalProof(batch, unit, proof, onChainResult.exists),
      rewardsEligible: (finalState === 'soldAwaitingClaim' || finalState === 'genuine') && !unit.claimedBy,
      authenticatedUser: reqUser ? { id: reqUser._id, name: reqUser.name, role: reqUser.role } : null,
      rewardsEarned: rewardResult && rewardResult.rewarded ? {
        pointsAwarded: rewardResult.pointsAwarded,
        streakBonusAwarded: rewardResult.streakBonusAwarded,
        streakBonusPoints: rewardResult.streakBonusPoints,
        currentStreak: rewardResult.currentStreak,
        totalPointsBalance: rewardResult.totalPointsBalance,
        txHash: rewardResult.txHash,
      } : null,
      rewardInfo: rewardResult ? {
        rewarded: rewardResult.rewarded,
        reason: rewardResult.reason,
        message: rewardResult.message,
      } : null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyProduct,
};
