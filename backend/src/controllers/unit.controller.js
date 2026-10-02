const crypto = require('crypto');
const { ethers } = require('ethers');
const Unit = require('../models/Unit');
const Batch = require('../models/Batch');
const User = require('../models/User');
const Sale = require('../models/Sale');
const PartnerInventory = require('../models/PartnerInventory');
const blockchainService = require('../services/blockchain.service');
const walletService = require('../services/wallet.service');
const smsService = require('../services/sms.service');
const { leafHash, MerkleTreeBuilder } = require('../utils/merkle');
const { successResponse, errorResponse } = require('../utils/response');
const config = require('../config/env');
const { ROLES } = require('../constants/roles');

/**
 * @desc Retail sale of a product unit
 * @route POST /api/v1/units/sell (and POST /api/v1/sell)
 * @access Retailer, Admin
 */
const sellUnit = async (req, res, next) => {
  try {
    const rawCode = (req.body.code || req.body.unitCode || '').trim();
    const customerPhone = (req.body.customerPhone || '').trim();
    const warrantyMonths = parseInt(req.body.warrantyMonths || 12, 10);
    const price = req.body.price !== undefined ? parseFloat(req.body.price) : 0;
    const invoiceNumber = req.body.invoiceNumber || null;

    if (!rawCode) {
      return errorResponse(res, 'Product unit code is required.', 400, 'CODE_REQUIRED');
    }
    if (!customerPhone) {
      return errorResponse(res, 'Customer phone number is required.', 400, 'PHONE_REQUIRED');
    }

    const code = decodeURIComponent(rawCode);

    // 1. Resolve Unit
    let unit = await Unit.findOne({ unitCode: code }).populate('product');
    if (!unit && code.includes('#')) {
      const baseCode = code.split('#')[0];
      unit = await Unit.findOne({ unitCode: baseCode }).populate('product');
    }
    if (!unit) {
      const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      unit = await Unit.findOne({ unitCode: new RegExp(`^${escaped}(#.*)?$`, 'i') }).populate('product');
    }

    if (!unit) {
      return errorResponse(res, `Product unit code "${code}" not found in registry.`, 404, 'UNIT_NOT_FOUND');
    }

    // 2. Block Double Sale
    if (unit.soldState !== 0 || unit.status === 'sold' || unit.status === 'claimed' || unit.soldAt) {
      return errorResponse(
        res,
        `This product unit has already been sold on ${new Date(unit.soldAt || Date.now()).toLocaleDateString('en-IN')}. Double sale is strictly prohibited.`,
        400,
        'ALREADY_SOLD',
        {
          unitCode: unit.unitCode,
          soldAt: unit.soldAt,
          soldState: unit.soldState === 1 ? 'Sold' : 'Claimed',
        }
      );
    }

    // 3. Resolve Batch
    let batch = await Batch.findById(unit.batch);
    if (!batch && (unit.batchId || unit.batchNumber)) {
      batch = await Batch.findOne({
        $or: [{ batchId: unit.batchId }, { batchNumber: unit.batchNumber }],
      });
    }

    if (!batch) {
      return errorResponse(res, 'Associated product batch not found.', 404, 'BATCH_NOT_FOUND');
    }

    if (batch.isRecalled) {
      return errorResponse(
        res,
        `Cannot sell product: Batch has been recalled (${batch.recallReason || 'Manufacturer recall'}).`,
        400,
        'BATCH_RECALLED'
      );
    }

    if (new Date() > new Date(batch.expiryDate)) {
      return errorResponse(
        res,
        `Cannot sell expired product unit: Expired on ${new Date(batch.expiryDate).toLocaleDateString('en-IN')}.`,
        400,
        'BATCH_EXPIRED'
      );
    }

    // 4. Find or Create Consumer by Phone (with custodial wallet)
    let customer = await User.findOne({ phone: customerPhone });
    let isNewConsumer = false;

    if (!customer) {
      isNewConsumer = true;
      const custodialWallet = walletService.createCustodialWallet();
      customer = await User.create({
        name: `Customer ${customerPhone.slice(-4)}`,
        phone: customerPhone,
        role: ROLES.CONSUMER,
        walletAddress: custodialWallet.address,
        encryptedPrivateKey: custodialWallet.encryptedPrivateKey,
        isPhoneVerified: true,
        pointsBalance: 0,
        status: 'ACTIVE',
      });
    } else if (!customer.walletAddress) {
      const custodialWallet = walletService.createCustodialWallet();
      customer.walletAddress = custodialWallet.address;
      customer.encryptedPrivateKey = custodialWallet.encryptedPrivateKey;
      await customer.save();
    }

    // 5. Ensure cryptographic Merkle proof for unit
    let proof = unit.proof || [];
    if (!proof || proof.length === 0) {
      try {
        const allUnits = await Unit.find({ batchId: unit.batchId }).sort({ unitCode: 1 });
        if (allUnits.length > 0) {
          const tree = new MerkleTreeBuilder(allUnits.map(u => u.unitCode));
          proof = tree.getProof(unit.unitCode);
        }
      } catch (err) {
        console.warn(`[Merkle Proof Rebuild Warning] ${err.message}`);
      }
    }

    // 6. Call markUnitSold on-chain with the Merkle proof
    let txHash = null;
    try {
      const chainRes = await blockchainService.markUnitSold({
        batchId: batch.batchIdBytes32 || batch.batchId,
        unitCode: unit.unitCode,
        proof,
        retailerWallet: req.user.walletAddress,
        customerWallet: customer.walletAddress,
      });
      txHash = chainRes.txHash;
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] markUnitSold simulated for development: ${chainErr.message}`);
      txHash = ethers.id(`simulated-sale-tx-${Date.now()}`);
    }

    // 7. Generate Claim Token and Link
    const claimToken = crypto.randomBytes(24).toString('hex');
    const claimLink = `${config.frontendUrl}/claim?token=${claimToken}&code=${encodeURIComponent(unit.unitCode)}`;

    // 8. Calculate Warranty and Purchase Dates
    const purchaseDate = new Date();
    const warrantyExpiryDate = new Date(purchaseDate);
    warrantyExpiryDate.setMonth(warrantyExpiryDate.getMonth() + warrantyMonths);

    // 9. Create Sale Record in DB
    const saleId = `SALE-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const sale = await Sale.create({
      saleId,
      unit: unit._id,
      unitCode: unit.unitCode,
      batch: batch._id,
      batchId: batch.batchId,
      product: unit.product?._id || batch.product,
      productName: batch.productName,
      retailer: req.user._id,
      retailerName: req.user.companyName || req.user.name,
      retailerWallet: req.user.walletAddress,
      customer: customer._id,
      customerPhone: customer.phone,
      customerWallet: customer.walletAddress,
      purchaseDate,
      warranty: {
        durationMonths: warrantyMonths,
        startDate: purchaseDate,
        expiryDate: warrantyExpiryDate,
        status: 'Active',
      },
      claimToken,
      claimLink,
      isClaimed: false,
      txHash,
      price,
      invoiceNumber,
    });

    // 10. Mark Unit Sold in DB with Retailer and Customer
    unit.soldState = 1; // 1: Sold
    unit.status = 'sold';
    unit.retailer = req.user._id;
    unit.customer = customer._id;
    unit.currentOwnerWallet = customer.walletAddress;
    unit.soldAt = purchaseDate;
    unit.claimToken = claimToken;
    unit.warrantyExpiryDate = warrantyExpiryDate;
    unit.sale = sale._id;
    await unit.save();

    // Deduct stock from retailer PartnerInventory if tracked
    try {
      await PartnerInventory.findOneAndUpdate(
        { user: req.user._id, batchNumber: batch.batchNumber, quantity: { $gt: 0 } },
        { $inc: { quantity: -1, totalTransferredOut: 1 } }
      );
    } catch (e) {
      // non-blocking
    }

    // 11. Send Mock SMS (printed to console)
    const smsMessage = `Thank you for purchasing ${batch.productName}! Verify authenticity & claim your warranty + reward points at: ${claimLink} (Use OTP: ${config.mockOtpCode})`;
    await smsService.sendSms(customer.phone, smsMessage);

    return successResponse(
      res,
      {
        sale: {
          id: sale._id,
          saleId: sale.saleId,
          unitCode: unit.unitCode,
          batchNumber: batch.batchNumber,
          productName: batch.productName,
          customerPhone: customer.phone,
          customerWallet: customer.walletAddress,
          retailerName: sale.retailerName,
          purchaseDate: sale.purchaseDate,
          warranty: sale.warranty,
          claimToken: sale.claimToken,
          claimLink: sale.claimLink,
          txHash: sale.txHash,
          isNewConsumer,
        },
        unit: {
          id: unit._id,
          unitCode: unit.unitCode,
          status: unit.status,
          soldState: 'Sold',
          soldAt: unit.soldAt,
        },
        claimToken,
        claimLink,
        message: 'Product unit marked as sold. Claim link and mock SMS dispatched to customer.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Claim product warranty and TPTS loyalty rewards
 * @route POST /api/v1/units/claim (and POST /api/v1/claim)
 * @access Consumer, Admin
 */
const claimUnit = async (req, res, next) => {
  try {
    const { claimToken, otp, unitCode, code } = req.body;
    const targetCode = (unitCode || code || '').trim();

    // 1. Verify OTP
    if (!otp) {
      return errorResponse(res, 'Verification OTP is required to claim product warranty.', 400, 'OTP_REQUIRED');
    }

    if (!smsService.verifyOtp(otp)) {
      return errorResponse(res, `Invalid OTP code. Please enter the valid OTP (demo: ${config.mockOtpCode}).`, 400, 'INVALID_OTP');
    }

    // 2. Find Sale Record and Unit
    let sale = null;
    let unit = null;

    if (claimToken) {
      sale = await Sale.findOne({ claimToken });
      if (sale) {
        unit = await Unit.findById(sale.unit);
      } else {
        unit = await Unit.findOne({ claimToken });
        if (unit && unit.sale) {
          sale = await Sale.findById(unit.sale);
        }
      }
    }

    if (!unit && targetCode) {
      unit = await Unit.findOne({ unitCode: targetCode });
      if (unit && unit.sale) {
        sale = await Sale.findById(unit.sale);
      }
    }

    if (!unit) {
      return errorResponse(res, 'Invalid claim token or unit code. No matching sale record found.', 404, 'CLAIM_NOT_FOUND');
    }

    // 3. Block Double Claim
    if (unit.soldState === 2 || unit.status === 'claimed' || (sale && sale.isClaimed)) {
      return errorResponse(
        res,
        `This product unit has already been claimed on ${new Date(unit.claimedAt || sale?.claimedAt || Date.now()).toLocaleDateString('en-IN')}.`,
        400,
        'ALREADY_CLAIMED',
        {
          unitCode: unit.unitCode,
          claimedAt: unit.claimedAt || sale?.claimedAt,
        }
      );
    }

    // 4. Resolve Batch
    let batch = await Batch.findById(unit.batch);
    if (!batch && unit.batchId) {
      batch = await Batch.findOne({ batchId: unit.batchId });
    }

    // 5. Ensure Consumer has Custodial Wallet
    if (!req.user.walletAddress) {
      const custodialWallet = walletService.createCustodialWallet();
      req.user.walletAddress = custodialWallet.address;
      req.user.encryptedPrivateKey = custodialWallet.encryptedPrivateKey;
      await req.user.save();
    }

    // 6. Call claimUnit on-chain
    let claimTxHash = null;
    try {
      const chainRes = await blockchainService.claimUnit({
        batchId: batch?.batchIdBytes32 || unit.batchId,
        unitCode: unit.unitCode,
        customerWallet: req.user.walletAddress,
      });
      claimTxHash = chainRes.txHash;
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] claimUnit simulated for development: ${chainErr.message}`);
      claimTxHash = ethers.id(`simulated-claim-tx-${Date.now()}`);
    }

    // 7. Mint / Reward TrustPoints (TPTS)
    const rewardAmount = config.pointsPerClaim || 50;
    try {
      await blockchainService.rewardTrustPoints(
        req.user.walletAddress,
        rewardAmount,
        `PRODUCT_CLAIM_${unit.unitCode}`
      );
    } catch (ptsErr) {
      console.warn(`[Blockchain Warning] rewardTrustPoints simulated: ${ptsErr.message}`);
    }

    // 8. Mark Unit Claimed in DB
    const claimDate = new Date();
    unit.soldState = 2; // 2: Claimed
    unit.status = 'claimed';
    unit.claimedBy = req.user._id;
    unit.currentOwnerWallet = req.user.walletAddress;
    unit.claimedAt = claimDate;
    await unit.save();

    // 9. Update Sale Record
    if (sale) {
      sale.isClaimed = true;
      sale.claimedAt = claimDate;
      sale.claimedBy = req.user._id;
      sale.claimTxHash = claimTxHash;
      sale.warranty.status = 'Claimed';
      await sale.save();
    }

    // 10. Update Consumer Points Balance
    req.user.pointsBalance = (req.user.pointsBalance || 0) + rewardAmount;
    await req.user.save();

    return successResponse(res, {
      unit: {
        id: unit._id,
        unitCode: unit.unitCode,
        batchNumber: batch?.batchNumber || unit.batchNumber,
        productName: batch?.productName || unit.productName,
        status: unit.status,
        soldState: 'Claimed',
        claimedAt: unit.claimedAt,
      },
      sale: sale ? {
        saleId: sale.saleId,
        purchaseDate: sale.purchaseDate,
        warranty: sale.warranty,
        isClaimed: sale.isClaimed,
        claimedAt: sale.claimedAt,
      } : null,
      rewardPointsEarned: rewardAmount,
      totalPointsBalance: req.user.pointsBalance,
      claimTxHash,
      message: `Product successfully claimed! Warranty registered and ${rewardAmount} TrustPoints (TPTS) awarded!`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get products claimed by current logged-in consumer
 * @route GET /api/v1/units/my-products
 * @access Consumer
 */
const getMyProducts = async (req, res, next) => {
  try {
    const units = await Unit.find({ claimedBy: req.user._id })
      .populate('sale')
      .populate('product')
      .sort({ claimedAt: -1 });

    const batchIds = [...new Set(units.map(u => u.batchId))];
    const batches = await Batch.find({ batchId: { $in: batchIds } });
    const batchMap = new Map(batches.map(b => [b.batchId, b]));

    const products = units.map(u => {
      const b = batchMap.get(u.batchId);
      return {
        unitCode: u.unitCode,
        batchId: u.batchId,
        batchNumber: b?.batchNumber || u.batchNumber,
        productName: b ? b.productName : u.productName || 'Product',
        brand: b ? b.brandName : 'Brand',
        expiryDate: b ? b.expiryDate : null,
        claimedAt: u.claimedAt,
        soldAt: u.soldAt,
        warranty: u.sale?.warranty || {
          status: 'Active',
          expiryDate: u.warrantyExpiryDate,
        },
      };
    });

    return successResponse(res, {
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get retail sales history for current retailer
 * @route GET /api/v1/units/sales
 * @access Retailer, Admin
 */
const getRetailSales = async (req, res, next) => {
  try {
    const query = req.user.role === ROLES.ADMIN ? {} : { retailer: req.user._id };
    const sales = await Sale.find(query)
      .populate('product', 'name category sku images')
      .sort({ purchaseDate: -1 });

    return successResponse(res, {
      count: sales.length,
      sales,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sellUnit,
  claimUnit,
  getMyProducts,
  getRetailSales,
};
