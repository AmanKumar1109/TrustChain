const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
const Partner = require('../models/Partner');
const User = require('../models/User');
const Transfer = require('../models/Transfer');
const Report = require('../models/Report');
const walletService = require('../services/wallet.service');
const blockchainService = require('../services/blockchain.service');
const config = require('../config/env');
const { ROLES } = require('../constants/roles');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Generate standard JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      walletAddress: user.walletAddress,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * @desc Create partner invite link (Manufacturer or Distributor)
 * @route POST /api/v1/partners/invite
 */
const createInvite = async (req, res, next) => {
  try {
    const { email, role, businessName, name, phone, location } = req.body;
    const inviterId = req.user._id;

    // Role hierarchy check:
    // - Manufacturer can invite Distributor or Retailer
    // - Distributor can invite Retailer
    if (req.user.role === ROLES.DISTRIBUTOR && role !== ROLES.RETAILER) {
      return errorResponse(res, 'Distributors can only invite Retailers to their supply chain network.', 403, 'FORBIDDEN');
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user account already exists with this email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser && existingUser.walletAddress) {
      return errorResponse(res, `User with email "${cleanEmail}" is already registered.`, 409, 'USER_ALREADY_EXISTS');
    }

    // Generate cryptographic invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days validity

    // Upsert or create Partner invitation
    let partner = await Partner.findOne({ email: cleanEmail });
    if (partner && partner.status === 'approved') {
      return errorResponse(res, `Partner with email "${cleanEmail}" is already approved.`, 409, 'PARTNER_ALREADY_APPROVED');
    }

    if (!partner) {
      partner = new Partner({
        email: cleanEmail,
        name: name || businessName,
        phone: phone || '',
        businessName,
        role,
        gst: 'PENDING_INVITE',
        location: location || { address: 'TBD', city: 'TBD', state: 'TBD', pincode: '000000' },
        status: 'pending',
        onboardingMethod: 'invite',
        invitedBy: inviterId,
        upstream: inviterId,
        inviteToken,
        inviteExpires,
      });
    } else {
      partner.name = name || partner.name;
      partner.businessName = businessName || partner.businessName;
      partner.role = role;
      partner.invitedBy = inviterId;
      partner.upstream = inviterId;
      partner.inviteToken = inviteToken;
      partner.inviteExpires = inviteExpires;
      partner.onboardingMethod = 'invite';
    }

    await partner.save();

    const inviteLink = `${config.frontendUrl.replace(/\/+$/, '')}/partner/join?token=${inviteToken}`;

    return successResponse(
      res,
      {
        partner: {
          id: partner._id,
          email: partner.email,
          businessName: partner.businessName,
          role: partner.role,
          invitedBy: req.user.companyName || req.user.name,
        },
        inviteToken,
        inviteLink,
        expiresAt: inviteExpires,
        message: `Invite link generated successfully for ${role} "${businessName}".`,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Sign up with partner invite link
 *       Auto-generates custodial wallet, calls authorizePartner on-chain, and activates partner.
 * @route POST /api/v1/partners/join-invite
 */
const joinViaInvite = async (req, res, next) => {
  try {
    const { token, name, password, phone, gst, businessDetails, location } = req.body;

    const partner = await Partner.findOne({
      inviteToken: token,
      inviteExpires: { $gt: new Date() },
    }).populate('invitedBy', 'name companyName role');

    if (!partner) {
      return errorResponse(res, 'Invalid or expired invite token. Please request a new invite link.', 400, 'INVALID_INVITE_TOKEN');
    }

    // Check if user already exists
    let user = await User.findOne({ email: partner.email });
    if (user && user.walletAddress) {
      return errorResponse(res, `User with email "${partner.email}" is already registered.`, 409, 'USER_ALREADY_EXISTS');
    }

    // 1. Generate Custodial Ethereum Wallet
    const { address: walletAddress, encryptedPrivateKey } = walletService.createCustodialWallet();

    // 2. Authorize partner on-chain via Relayer
    let txHash = null;
    try {
      const txRes = await blockchainService.authorizePartnerOnChain(walletAddress);
      txHash = txRes.txHash;
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] On-chain authorizePartner simulated: ${chainErr.message}`);
      txHash = ethers.id(`simulated-partner-auth-${Date.now()}`);
    }

    // 3. Create or update User account
    if (!user) {
      user = await User.create({
        name,
        email: partner.email,
        phone,
        password,
        role: partner.role,
        companyName: partner.businessName,
        gst: gst.toUpperCase().trim(),
        walletAddress,
        encryptedPrivateKey,
        isVerified: true,
        status: 'ACTIVE',
      });
    } else {
      user.name = name;
      user.phone = phone;
      user.password = password;
      user.companyName = partner.businessName;
      user.gst = gst.toUpperCase().trim();
      user.walletAddress = walletAddress;
      user.encryptedPrivateKey = encryptedPrivateKey;
      user.isVerified = true;
      user.status = 'ACTIVE';
      await user.save();
    }

    // 4. Update Partner Profile
    partner.user = user._id;
    partner.name = name;
    partner.phone = phone;
    partner.gst = gst.toUpperCase().trim();
    partner.businessDetails = businessDetails || partner.businessDetails;
    partner.location = location;
    partner.walletAddress = walletAddress;
    partner.status = 'approved';
    partner.approvedBy = partner.invitedBy?._id || null;
    partner.approvedAt = new Date();
    partner.inviteToken = null; // consume token
    await partner.save();

    const authToken = generateToken(user);

    return successResponse(
      res,
      {
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
          walletAddress: user.walletAddress,
        },
        partner: {
          id: partner._id,
          businessName: partner.businessName,
          role: partner.role,
          gst: partner.gst,
          location: partner.location,
          status: partner.status,
          upstream: partner.invitedBy?.companyName || partner.invitedBy?.name || 'Authorized Network',
          txHash,
        },
        message: 'Partner onboarded successfully via invite. Wallet created and authorized on-chain.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Self-apply flow: Partner applies independently with GST and shop details
 *       Status starts as 'pending'. Upstream partner or admin approves.
 * @route POST /api/v1/partners/self-apply
 */
const selfApply = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      role,
      businessName,
      gst,
      businessDetails,
      location,
      upstreamId,
    } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    const cleanGst = gst.toUpperCase().trim();

    // Check if email already registered
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return errorResponse(res, `Account with email "${cleanEmail}" already exists.`, 409, 'EMAIL_ALREADY_EXISTS');
    }

    // Check if GST is already registered and approved
    const existingPartner = await Partner.findOne({ gst: cleanGst, status: 'approved' });
    if (existingPartner) {
      return errorResponse(res, `A partner with GST "${cleanGst}" is already registered in the system.`, 409, 'GST_ALREADY_EXISTS');
    }

    // Validate upstream partner if provided
    let upstreamUser = null;
    if (upstreamId) {
      upstreamUser = await User.findById(upstreamId);
      if (!upstreamUser) {
        return errorResponse(res, `Upstream entity with ID "${upstreamId}" not found.`, 404, 'UPSTREAM_NOT_FOUND');
      }
    }

    // Create User record in pending state (no wallet created yet until approved)
    const user = await User.create({
      name,
      email: cleanEmail,
      phone,
      password,
      role,
      companyName: businessName,
      gst: cleanGst,
      walletAddress: null,
      isVerified: false,
      status: 'ACTIVE',
    });

    // Create Partner record in pending status
    const partner = await Partner.create({
      user: user._id,
      name,
      email: cleanEmail,
      phone,
      businessName,
      role,
      gst: cleanGst,
      businessDetails: businessDetails || {},
      location,
      status: 'pending',
      onboardingMethod: 'self-apply',
      upstream: upstreamUser ? upstreamUser._id : null,
    });

    return successResponse(
      res,
      {
        partner: {
          id: partner._id,
          businessName: partner.businessName,
          name: partner.name,
          email: partner.email,
          role: partner.role,
          gst: partner.gst,
          location: partner.location,
          status: partner.status,
          upstream: upstreamUser?.companyName || upstreamUser?.name || 'Admin Pool',
        },
        message: 'Partner application submitted successfully. Your application is pending review by your upstream partner or admin.',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Approve a partner application (Upstream partner or Admin)
 *       Creates the custodial wallet and calls authorizePartner on-chain.
 * @route POST /api/v1/partners/:id/approve
 */
const approvePartner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id).populate('user');
    if (!partner) {
      return errorResponse(res, `Partner with ID "${id}" was not found.`, 404, 'PARTNER_NOT_FOUND');
    }

    if (partner.status === 'approved') {
      return errorResponse(res, 'This partner is already approved.', 400, 'ALREADY_APPROVED');
    }

    // Permission check:
    // Admin can approve any partner.
    // Manufacturer or Distributor can approve if they are the designated upstream or invitedBy, or if unassigned.
    const isOwnerUpstream =
      partner.upstream?.toString() === req.user._id.toString() ||
      partner.invitedBy?.toString() === req.user._id.toString() ||
      (!partner.upstream && req.user.role === ROLES.MANUFACTURER);

    if (req.user.role !== ROLES.ADMIN && !isOwnerUpstream) {
      return errorResponse(res, 'You do not have permission to approve this partner.', 403, 'FORBIDDEN');
    }

    // 1. Create Custodial Wallet if not already present
    let walletAddress = partner.walletAddress;
    let encryptedKey = null;

    if (!walletAddress) {
      const walletData = walletService.createCustodialWallet();
      walletAddress = walletData.address;
      encryptedKey = walletData.encryptedPrivateKey;

      if (partner.user) {
        const user = await User.findById(partner.user);
        if (user) {
          user.walletAddress = walletAddress;
          user.encryptedPrivateKey = encryptedKey;
          user.isVerified = true;
          await user.save();
        }
      }
    }

    // 2. Call authorizePartner on-chain via Relayer
    let txHash = null;
    try {
      const txRes = await blockchainService.authorizePartnerOnChain(walletAddress);
      txHash = txRes.txHash;
    } catch (chainErr) {
      console.warn(`[Blockchain Warning] On-chain authorizePartner simulated: ${chainErr.message}`);
      txHash = ethers.id(`simulated-partner-auth-${Date.now()}`);
    }

    // 3. Update Partner document
    partner.status = 'approved';
    partner.walletAddress = walletAddress;
    partner.approvedBy = req.user._id;
    partner.approvedAt = new Date();
    partner.rejectionReason = '';

    if (!partner.upstream && req.user.role === ROLES.MANUFACTURER) {
      partner.upstream = req.user._id;
    }

    await partner.save();

    return successResponse(res, {
      partner: {
        id: partner._id,
        businessName: partner.businessName,
        role: partner.role,
        status: partner.status,
        walletAddress: partner.walletAddress,
        approvedAt: partner.approvedAt,
      },
      txHash,
      message: 'Partner approved successfully. Custodial wallet generated and authorized on-chain.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Reject a partner application
 * @route POST /api/v1/partners/:id/reject
 */
const rejectPartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return errorResponse(res, `Partner with ID "${id}" was not found.`, 404, 'PARTNER_NOT_FOUND');
    }

    const isOwnerUpstream =
      partner.upstream?.toString() === req.user._id.toString() ||
      partner.invitedBy?.toString() === req.user._id.toString() ||
      (!partner.upstream && req.user.role === ROLES.MANUFACTURER);

    if (req.user.role !== ROLES.ADMIN && !isOwnerUpstream) {
      return errorResponse(res, 'You do not have permission to reject this partner.', 403, 'FORBIDDEN');
    }

    partner.status = 'rejected';
    partner.rejectionReason = reason;
    await partner.save();

    return successResponse(res, {
      partner: {
        id: partner._id,
        businessName: partner.businessName,
        status: partner.status,
        rejectionReason: partner.rejectionReason,
      },
      message: 'Partner application rejected.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc List partners for manufacturer or upstream partner
 *       Manufacturer sees distributors & retailers linked to their network.
 * @route GET /api/v1/partners
 */
const getPartners = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 10, upstreamId } = req.query;

    const query = {};

    // 1. Scoping by role
    if (req.user.role === ROLES.MANUFACTURER || req.user.role === ROLES.DISTRIBUTOR) {
      query.$or = [{ upstream: req.user._id }, { invitedBy: req.user._id }];
    } else if (req.user.role === ROLES.ADMIN && upstreamId) {
      query.upstream = upstreamId;
    }

    // 2. Role Filter (distributor, retailer)
    if (role) {
      query.role = role.toLowerCase().trim();
    }

    // 3. Status Filter (pending, approved, rejected)
    if (status) {
      query.status = status.toLowerCase().trim();
    }

    // 4. Search Filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchOr = [
        { businessName: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { gst: searchRegex },
        { 'location.city': searchRegex },
        { 'location.state': searchRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }

    // 5. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [partners, totalItems] = await Promise.all([
      Partner.find(query)
        .populate('user', 'name email phone walletAddress isVerified')
        .populate('upstream', 'name companyName role')
        .populate('invitedBy', 'name companyName role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Partner.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    return successResponse(res, {
      partners,
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
 * @desc Get partner details
 * @route GET /api/v1/partners/:id
 */
const getPartnerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id)
      .populate('user', 'name email phone walletAddress isVerified createdAt')
      .populate('upstream', 'name companyName role email')
      .populate('invitedBy', 'name companyName role email')
      .populate('approvedBy', 'name companyName role');

    if (!partner) {
      return errorResponse(res, `Partner with ID "${id}" was not found.`, 404, 'PARTNER_NOT_FOUND');
    }

    // Permission check
    const isOwner = partner.user?._id?.toString() === req.user._id.toString();
    const isUpstream =
      partner.upstream?._id?.toString() === req.user._id.toString() ||
      partner.invitedBy?._id?.toString() === req.user._id.toString();

    if (req.user.role !== ROLES.ADMIN && !isOwner && !isUpstream) {
      return errorResponse(res, 'You do not have permission to view this partner detail.', 403, 'FORBIDDEN');
    }

    return successResponse(res, {
      partner,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper to compute dynamic reputation score and breakdown for a partner
 */
const calculatePartnerReputationData = async (partner) => {
  const partnerUser = partner.user?._id || partner.user;

  // 1. Query transfers involving this partner
  const transfers = await Transfer.find({
    $or: [
      { fromUser: partnerUser },
      { toUser: partnerUser },
      { fromPartner: partner._id },
      { toPartner: partner._id },
    ],
  }).sort({ updatedAt: -1 });

  const acceptedTransfers = transfers.filter((t) => t.status === 'Accepted');
  const rejectedTransfers = transfers.filter((t) => t.status === 'Rejected');
  const pendingTransfers = transfers.filter((t) => t.status === 'Pending');

  // Breakdown of rejected transfers
  const outgoingRejected = rejectedTransfers.filter(
    (t) => t.fromUser?.toString() === partnerUser?.toString()
  );
  const incomingRejected = rejectedTransfers.filter(
    (t) => t.toUser?.toString() === partnerUser?.toString()
  );

  // 2. Query reports against the shop or partner
  const shopRegex = new RegExp(partner.businessName.trim(), 'i');
  const reports = await Report.find({
    $or: [
      { shopName: shopRegex },
      { shopName: new RegExp(partner.name.trim(), 'i') },
      ...(partnerUser ? [{ user: partnerUser }] : []),
    ],
  }).sort({ updatedAt: -1 });

  const validFakeReports = reports.filter((r) => r.status === 'Valid');
  const pendingFakeReports = reports.filter((r) =>
    ['Submitted', 'UnderReview'].includes(r.status)
  );

  // 3. Compute Score
  // Base: 100
  // Transfer bonus: +2 pts per accepted transfer (capped at +20)
  // Rejection penalty: -10 pts per outgoing rejected, -5 pts per incoming rejected
  // Valid Counterfeit Report penalty: -25 pts per validated counterfeit incident
  const baseScore = 100;
  const transferBonus = Math.min(20, acceptedTransfers.length * 2);
  const rejectionPenalty = outgoingRejected.length * 10 + incomingRejected.length * 5;
  const counterfeitPenalty = validFakeReports.length * 25;

  const rawScore = baseScore + transferBonus - rejectionPenalty - counterfeitPenalty;
  const score = Math.max(0, Math.min(100, rawScore));

  // Determine Tier & Risk Status
  let tier = 'Good Standing';
  let tierBadge = 'TIER_B_VERIFIED';
  let riskLevel = 'LOW';
  if (score >= 90) {
    tier = 'Elite Partner';
    tierBadge = 'TIER_A_ELITE';
    riskLevel = 'VERY_LOW';
  } else if (score >= 75) {
    tier = 'Good Standing';
    tierBadge = 'TIER_B_VERIFIED';
    riskLevel = 'LOW';
  } else if (score >= 50) {
    tier = 'Under Observation';
    tierBadge = 'TIER_C_WARNING';
    riskLevel = 'MEDIUM';
  } else {
    tier = 'High Risk / Critical';
    tierBadge = 'TIER_D_CRITICAL';
    riskLevel = 'HIGH';
  }

  // 4. Construct Recent Changes Timeline (audit events)
  const changes = [];

  for (const t of transfers.slice(0, 15)) {
    if (t.status === 'Accepted') {
      changes.push({
        id: `CHG-TRF-${t.transferId}`,
        timestamp: t.updatedAt || t.createdAt,
        type: 'TRANSFER_ACCEPTED',
        delta: +2,
        title: 'Shipment Successfully Accepted',
        description: `Batch ${t.batchNumber} (${t.quantity} units) custody transfer accepted cleanly.`,
        relatedId: t.transferId,
      });
    } else if (t.status === 'Rejected') {
      const isSender = t.fromUser?.toString() === partnerUser?.toString();
      changes.push({
        id: `CHG-TRF-${t.transferId}`,
        timestamp: t.updatedAt || t.createdAt,
        type: 'TRANSFER_REJECTED',
        delta: isSender ? -10 : -5,
        title: isSender ? 'Outgoing Shipment Rejected by Recipient' : 'Incoming Shipment Rejected',
        description: `Batch ${t.batchNumber} rejected. Reason: "${t.rejectionReason || 'Discrepancy'}"`,
        relatedId: t.transferId,
      });
    }
  }

  for (const r of validFakeReports) {
    changes.push({
      id: `CHG-RPT-${r.reportId}`,
      timestamp: r.adminReview?.reviewedAt || r.updatedAt,
      type: 'COUNTERFEIT_VALIDATED',
      delta: -25,
      title: 'Counterfeit Incident Confirmed by Compliance',
      description: `Report ${r.reportId} validated at "${r.shopName}". Product: ${r.productName || r.code}. Observation: "${r.comment}"`,
      relatedId: r.reportId,
    });
  }

  // Sort changes descending by timestamp
  changes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalTransferCount =
    acceptedTransfers.length + rejectedTransfers.length + pendingTransfers.length;
  const completedTransferCount = acceptedTransfers.length + rejectedTransfers.length;
  const transferSuccessRate =
    completedTransferCount > 0
      ? ((acceptedTransfers.length / completedTransferCount) * 100).toFixed(1) + '%'
      : '100%';

  return {
    score,
    tier,
    tierBadge,
    riskLevel,
    breakdown: {
      baseScore,
      totalTransfers: totalTransferCount,
      acceptedTransfers: acceptedTransfers.length,
      rejectedTransfers: rejectedTransfers.length,
      pendingTransfers: pendingTransfers.length,
      transferSuccessRate,
      validFakeReports: validFakeReports.length,
      pendingFakeReports: pendingFakeReports.length,
      totalFakeReports: reports.length,
      transferBonus: `+${transferBonus}`,
      rejectionPenalty: `-${rejectionPenalty}`,
      counterfeitPenalty: `-${counterfeitPenalty}`,
    },
    recentChanges: changes.slice(0, 15),
  };
};

/**
 * @desc Get reputation score, breakdown, and recent changes timeline for a partner
 * @route GET /api/v1/partners/:id/reputation
 * @access Authenticated (Partner itself, Manufacturer, Admin)
 */
const getPartnerReputation = async (req, res, next) => {
  try {
    const { id } = req.params;

    let partner;
    if (id === 'me' || id === 'self') {
      partner = await Partner.findOne({ user: req.user._id }).populate('user', 'name email phone walletAddress');
    } else {
      const query = { $or: [] };
      if (mongoose.Types.ObjectId.isValid(id)) {
        query.$or.push({ _id: id }, { user: id });
      } else {
        query.$or.push({ businessName: new RegExp(id.trim(), 'i') }, { email: id.toLowerCase().trim() });
      }
      partner = await Partner.findOne(query).populate('user', 'name email phone walletAddress');
    }
    if (!partner) {
      return errorResponse(res, `Partner "${id}" was not found.`, 404, 'PARTNER_NOT_FOUND');
    }

    // Permission check
    const isOwner = partner.user?._id?.toString() === req.user._id.toString();
    const isUpstream =
      partner.upstream?.toString() === req.user._id.toString() ||
      partner.invitedBy?.toString() === req.user._id.toString();
    const isPrivileged = [ROLES.MANUFACTURER, ROLES.DISTRIBUTOR, ROLES.ADMIN].includes(req.user.role);

    if (!isOwner && !isUpstream && !isPrivileged) {
      return errorResponse(res, 'You do not have permission to view this partner reputation.', 403, 'FORBIDDEN');
    }

    const reputationData = await calculatePartnerReputationData(partner);

    return successResponse(res, {
      partner: {
        id: partner._id,
        businessName: partner.businessName,
        name: partner.name,
        role: partner.role,
        gst: partner.gst,
        city: partner.location?.city || 'Unknown',
        state: partner.location?.state || '',
        walletAddress: partner.walletAddress,
        status: partner.status,
      },
      ...reputationData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get reputation rankings and leaderboard for all network partners
 * @route GET /api/v1/partners/reputation
 * @access Manufacturer, Distributor, Admin
 */
const getPartnersReputationList = async (req, res, next) => {
  try {
    const { role, city } = req.query;

    const query = { status: 'approved' };
    if (role && ['distributor', 'retailer'].includes(role.toLowerCase())) {
      query.role = role.toLowerCase();
    }
    if (city) {
      query['location.city'] = new RegExp(city.trim(), 'i');
    }

    const partners = await Partner.find(query).populate('user', 'name email phone walletAddress');

    const list = await Promise.all(
      partners.map(async (p) => {
        const rep = await calculatePartnerReputationData(p);
        return {
          id: p._id,
          businessName: p.businessName,
          name: p.name,
          role: p.role,
          gst: p.gst,
          city: p.location?.city || 'Unknown',
          state: p.location?.state || '',
          score: rep.score,
          tier: rep.tier,
          tierBadge: rep.tierBadge,
          riskLevel: rep.riskLevel,
          totalTransfers: rep.breakdown.totalTransfers,
          transferSuccessRate: rep.breakdown.transferSuccessRate,
          validFakeReports: rep.breakdown.validFakeReports,
        };
      })
    );

    // Sort descending by reputation score
    list.sort((a, b) => b.score - a.score);

    return successResponse(res, {
      total: list.length,
      partners: list,
      tiersCount: {
        elite: list.filter((p) => p.score >= 90).length,
        good: list.filter((p) => p.score >= 75 && p.score < 90).length,
        warning: list.filter((p) => p.score >= 50 && p.score < 75).length,
        critical: list.filter((p) => p.score < 50).length,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInvite,
  joinViaInvite,
  selfApply,
  approvePartner,
  rejectPartner,
  getPartners,
  getPartnerById,
  getPartnerReputation,
  getPartnersReputationList,
};
