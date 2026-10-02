const User = require('../models/User');
const Invoice = require('../models/Invoice');
const CreditLedger = require('../models/CreditLedger');
const { successResponse, errorResponse } = require('../utils/response');

// Predefined Plan Tiers for Manufacturers
const PLAN_TIERS = {
  STARTER: {
    code: 'STARTER',
    name: 'Starter Plan',
    priceMonthlyINR: 1500,
    priceAnnualINR: 15000,
    includedCredits: 1000,
    unitRateStandard: 1.2,
    unitRateHighValue: 2.2,
    features: [
      'Up to 1,000 units/month',
      'Merkle Tree cryptographic serialization',
      'QR Code PNG ZIP downloads',
      'Basic scan verification history',
      'Community email support',
    ],
  },
  GROWTH: {
    code: 'GROWTH',
    name: 'Growth Plan',
    priceMonthlyINR: 4500,
    priceAnnualINR: 45000,
    includedCredits: 3500,
    unitRateStandard: 1.0,
    unitRateHighValue: 2.0,
    features: [
      'Up to 10,000 units/month',
      'High-Resolution QR ZIP & Printable A4 PDF sheets',
      'Real-Time Geo-Velocity Clone Detection',
      'Hotspot Heatmap & Anti-Counterfeit Reports',
      'Partner Custody & Inventory Management',
      'Priority email & phone support',
    ],
  },
  ENTERPRISE: {
    code: 'ENTERPRISE',
    name: 'Enterprise Plan',
    priceMonthlyINR: 15000,
    priceAnnualINR: 150000,
    includedCredits: 15000,
    unitRateStandard: 0.8,
    unitRateHighValue: 1.5,
    features: [
      'Unlimited serialization volume',
      'Sub-second on-chain Merkle root registration',
      'Automated batch emergency recall on-chain',
      'Custom ERP webhooks & REST API keys',
      'Unlimited organization team seats',
      'Dedicated compliance manager & 24/7 SLA',
    ],
  },
};

/**
 * @desc Get complete manufacturer billing overview:
 *       - Plan details
 *       - Current credit balance (INR)
 *       - Lifetime spent & credits summary
 *       - Recent invoices
 *       - Recent usage ledger
 * @route GET /api/v1/billing/overview
 * @access Manufacturer, Admin
 */
const getBillingOverview = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    const mfgId = user._id;

    // 1. Fetch recent 5 invoices
    const recentInvoices = await Invoice.find({ manufacturer: mfgId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 2. Fetch recent 10 credit transactions
    const recentUsage = await CreditLedger.find({ manufacturer: mfgId })
      .sort({ createdAt: -1 })
      .limit(10);

    // 3. Compute Lifetime Financial Aggregates
    const [allLedger, invoiceCount] = await Promise.all([
      CreditLedger.find({ manufacturer: mfgId }),
      Invoice.countDocuments({ manufacturer: mfgId }),
    ]);

    const totalCreditsToppedUp = allLedger
      .filter((t) => t.type === 'TOPUP')
      .reduce((sum, t) => sum + (t.credits || 0), 0);

    const totalCreditsDeducted = allLedger
      .filter((t) => t.type === 'DEDUCTION')
      .reduce((sum, t) => sum + (t.credits || 0), 0);

    const totalSpentINR = allLedger
      .filter((t) => t.type === 'DEDUCTION')
      .reduce((sum, t) => sum + (t.amountINR || 0), 0);

    const planCode = user.plan?.code || 'GROWTH';
    const planConfig = PLAN_TIERS[planCode] || PLAN_TIERS.GROWTH;

    return successResponse(res, {
      creditBalance: user.creditBalance || 0,
      currency: 'INR',
      conversionRate: '1 Credit = ₹1 INR',
      plan: {
        ...planConfig,
        billingCycle: user.plan?.billingCycle || 'monthly',
        renewalDate: user.plan?.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: user.plan?.status || 'ACTIVE',
      },
      stats: {
        totalCreditsToppedUp,
        totalCreditsDeducted,
        totalSpentINR,
        totalInvoices: invoiceCount,
      },
      recentInvoices,
      recentUsage,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get available plan tiers and current manufacturer plan
 * @route GET /api/v1/billing/plan
 * @access Manufacturer, Admin
 */
const getPlanDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const currentCode = user.plan?.code || 'GROWTH';

    return successResponse(res, {
      currentPlan: {
        code: currentCode,
        ...(PLAN_TIERS[currentCode] || PLAN_TIERS.GROWTH),
        billingCycle: user.plan?.billingCycle || 'monthly',
        renewalDate: user.plan?.renewalDate,
        status: user.plan?.status || 'ACTIVE',
      },
      availablePlans: Object.values(PLAN_TIERS),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Upgrade or switch manufacturer subscription plan
 * @route PATCH /api/v1/billing/plan
 * @access Manufacturer, Admin
 */
const updatePlan = async (req, res, next) => {
  try {
    const { planCode, billingCycle = 'monthly' } = req.body;
    const selectedTier = PLAN_TIERS[planCode];

    if (!selectedTier) {
      return errorResponse(res, `Invalid plan code "${planCode}". Choose from STARTER, GROWTH, or ENTERPRISE.`, 400, 'INVALID_PLAN');
    }

    const user = await User.findById(req.user._id);
    user.plan = {
      code: selectedTier.code,
      name: selectedTier.name,
      unitRateStandard: selectedTier.unitRateStandard,
      unitRateHighValue: selectedTier.unitRateHighValue,
      monthlyAllowance: selectedTier.includedCredits,
      billingCycle,
      renewalDate: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    };
    await user.save();

    return successResponse(res, {
      plan: user.plan,
      message: `Subscription plan successfully upgraded to ${selectedTier.name} (${billingCycle}).`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc List manufacturer invoices with pagination and search
 * @route GET /api/v1/billing/invoices
 * @access Manufacturer, Admin
 */
const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { manufacturer: req.user._id };
    if (status) {
      query.status = status.toUpperCase();
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Invoice.countDocuments(query),
    ]);

    return successResponse(res, {
      invoices,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single invoice details for receipt/printing
 * @route GET /api/v1/billing/invoices/:id
 * @access Manufacturer, Admin
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = { _id: id };
    if (req.user.role !== 'admin') {
      query.manufacturer = req.user._id;
    }

    const invoice = await Invoice.findOne(query).populate('manufacturer', 'name email companyName gst cin');
    if (!invoice) {
      return errorResponse(res, `Invoice "${id}" not found.`, 404, 'INVOICE_NOT_FOUND');
    }

    return successResponse(res, {
      invoice,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Mock top-up endpoint that simulates successful UPI or Card payment:
 *       - Adds prepaid INR credits to user balance
 *       - Creates CreditLedger record (type: 'TOPUP')
 *       - Generates full GST invoice in INR
 *       - Returns new balance, payment reference & downloadable invoice receipt
 * @route POST /api/v1/billing/topup
 * @access Manufacturer, Admin
 */
const topupCreditsWithMockPayment = async (req, res, next) => {
  try {
    const {
      amountINR,
      paymentMethod = 'UPI',
      upiId,
      cardNumber,
      cardLast4,
      cardNetwork = 'Visa',
      bankName = 'HDFC Bank',
      referenceId,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    const amount = Number(amountINR);
    if (!amount || amount < 50) {
      return errorResponse(res, 'Minimum top-up amount is ₹50 INR.', 400, 'INVALID_AMOUNT');
    }

    // 1. Calculate Tax Breakdown (18% GST)
    const subtotalINR = Math.round(amount * 100) / 100;
    const gstRate = 18;
    const gstAmountINR = Math.round(subtotalINR * (gstRate / 100) * 100) / 100;
    const totalAmountINR = Math.round((subtotalINR + gstAmountINR) * 100) / 100;

    // 2. Generate Simulated Gateway Transaction Reference
    const timestamp = Date.now();
    const randPart = Math.floor(100000 + Math.random() * 900000);
    let paymentRef = referenceId;
    let paymentDetails = {};

    if (paymentMethod === 'UPI') {
      paymentRef = paymentRef || `UPI-IN-${timestamp}-${randPart}`;
      paymentDetails = {
        upiId: upiId || `${(user.companyName || user.name).toLowerCase().replace(/\s+/g, '')}@okhdfcbank`,
        gatewayTxId: `SBIN${timestamp}`,
        mode: 'UPI_COLLECT',
      };
    } else if (paymentMethod === 'CARD') {
      const last4 = cardLast4 || (cardNumber ? cardNumber.slice(-4) : '4242');
      paymentRef = paymentRef || `CARD-AUTH-${timestamp}-${randPart}`;
      paymentDetails = {
        cardLast4: last4,
        cardNetwork: cardNetwork || 'Mastercard',
        bankName: bankName || 'ICICI Bank',
        gatewayTxId: `AUTH_${timestamp}`,
        mode: 'CARD_3DS',
      };
    } else {
      paymentRef = paymentRef || `PAY-${timestamp}-${randPart}`;
      paymentDetails = {
        bankName: bankName || 'State Bank of India',
        gatewayTxId: `NETB_${timestamp}`,
        mode: 'NET_BANKING',
      };
    }

    // 3. Add Credits to User Balance
    user.creditBalance = (user.creditBalance || 0) + subtotalINR;
    await user.save();

    // 4. Create CreditLedger Record
    const creditRecord = await CreditLedger.create({
      manufacturer: user._id,
      type: 'TOPUP',
      amountINR: subtotalINR,
      credits: subtotalINR,
      balanceAfter: user.creditBalance,
      description: `Prepaid Credit Top-up via ${paymentMethod} (${paymentRef})`,
      referenceId: paymentRef,
    });

    // 5. Generate Tax Invoice
    const count = await Invoice.countDocuments();
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(count + 1001).padStart(5, '0')}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      manufacturer: user._id,
      companyName: user.companyName || user.name,
      gst: user.gst || 'UNREGISTERED',
      cin: user.cin || '',
      billingAddress: user.companyProfile?.address || {
        street: 'Commercial Office 401',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
      },
      items: [
        {
          description: `TrustChain Prepaid Verification & Serialization Credits (${subtotalINR} units)`,
          quantity: subtotalINR,
          unitPrice: 1.0,
          amount: subtotalINR,
        },
      ],
      creditsPurchased: subtotalINR,
      subtotalINR,
      gstRate,
      gstAmountINR,
      totalAmountINR,
      currency: 'INR',
      paymentMethod,
      paymentReference: paymentRef,
      paymentDetails,
      status: 'PAID',
      paidAt: new Date(),
      notes: `Payment processed successfully via ${paymentMethod}. ₹${subtotalINR} credits are active immediately.`,
    });

    console.log(`\n💳 [BILLING TOPUP] Manufacturer: ${user.name} | Amount: ₹${subtotalINR} + 18% GST (Total: ₹${totalAmountINR})`);
    console.log(`   Payment Method: ${paymentMethod} | Reference: ${paymentRef}`);
    console.log(`   Invoice: ${invoice.invoiceNumber} | New Balance: ₹${user.creditBalance}\n`);

    return successResponse(
      res,
      {
        message: `Successfully topped up ₹${subtotalINR} credits via ${paymentMethod}!`,
        creditedINR: subtotalINR,
        newBalanceINR: user.creditBalance,
        totalBilledINR: totalAmountINR,
        invoice: {
          id: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          creditsPurchased: invoice.creditsPurchased,
          subtotalINR: invoice.subtotalINR,
          gstAmountINR: invoice.gstAmountINR,
          totalAmountINR: invoice.totalAmountINR,
          paymentMethod: invoice.paymentMethod,
          paymentReference: invoice.paymentReference,
          status: invoice.status,
          paidAt: invoice.paidAt,
        },
        creditTransactionId: creditRecord._id,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get usage history from CreditLedger with pagination
 * @route GET /api/v1/billing/usage
 * @access Manufacturer, Admin
 */
const getUsageHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = { manufacturer: req.user._id };
    if (type && ['TOPUP', 'DEDUCTION'].includes(type.toUpperCase())) {
      query.type = type.toUpperCase();
    }

    const [usage, total] = await Promise.all([
      CreditLedger.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      CreditLedger.countDocuments(query),
    ]);

    return successResponse(res, {
      usage,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBillingOverview,
  getPlanDetails,
  updatePlan,
  getInvoices,
  getInvoiceById,
  topupCreditsWithMockPayment,
  getUsageHistory,
};
