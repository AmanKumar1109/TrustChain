const User = require('../models/User');
const Brand = require('../models/Brand');
const TeamMember = require('../models/TeamMember');
const { successResponse, errorResponse } = require('../utils/response');

// =============================================================================
// 1. COMPANY PROFILE SETTINGS
// =============================================================================

/**
 * @desc Get organization / company profile
 * @route GET /api/v1/settings/company
 * @access Authenticated (Manufacturer, Partner, Admin)
 */
const getCompanyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    let brand = null;
    if (user.role === 'manufacturer') {
      brand = await Brand.findOne({ manufacturer: user._id });
    }

    return successResponse(res, {
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyName: user.companyName || user.name,
        gst: user.gst || '',
        cin: user.cin || '',
        licenseNumber: user.licenseNumber || '',
        isVerified: user.isVerified,
        brandStatus: user.brandStatus,
        legalName: user.companyProfile?.legalName || user.companyName || user.name,
        pan: user.companyProfile?.pan || '',
        website: user.companyProfile?.website || '',
        supportEmail: user.companyProfile?.supportEmail || user.email || '',
        supportPhone: user.companyProfile?.supportPhone || user.phone || '',
        address: user.companyProfile?.address || {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        },
        brandLogoUrl: user.companyProfile?.brandLogoUrl || '',
        description: user.companyProfile?.description || '',
      },
      brand: brand
        ? {
            id: brand._id,
            status: brand.status,
            rejectionReason: brand.rejectionReason,
            documentsCount: brand.documents?.length || 0,
            approvedAt: brand.approvedAt,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update organization / company profile
 * @route PATCH /api/v1/settings/company
 * @access Authenticated (Manufacturer, Partner, Admin)
 */
const updateCompanyProfile = async (req, res, next) => {
  try {
    const {
      companyName,
      legalName,
      gst,
      cin,
      pan,
      website,
      supportEmail,
      supportPhone,
      address,
      brandLogoUrl,
      description,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404, 'USER_NOT_FOUND');
    }

    // 1. Update Core User Business fields
    if (companyName) user.companyName = companyName.trim();
    if (gst !== undefined) user.gst = gst.trim().toUpperCase();
    if (cin !== undefined) user.cin = cin.trim().toUpperCase();

    // 2. Update Extended Company Profile subdocument
    user.companyProfile = user.companyProfile || {};
    if (legalName !== undefined) user.companyProfile.legalName = legalName.trim();
    if (pan !== undefined) user.companyProfile.pan = pan.trim().toUpperCase();
    if (website !== undefined) user.companyProfile.website = website.trim();
    if (supportEmail !== undefined) user.companyProfile.supportEmail = supportEmail.trim().toLowerCase();
    if (supportPhone !== undefined) user.companyProfile.supportPhone = supportPhone.trim();
    if (brandLogoUrl !== undefined) user.companyProfile.brandLogoUrl = brandLogoUrl.trim();
    if (description !== undefined) user.companyProfile.description = description.trim();

    if (address && typeof address === 'object') {
      user.companyProfile.address = {
        street: address.street !== undefined ? address.street.trim() : (user.companyProfile.address?.street || ''),
        city: address.city !== undefined ? address.city.trim() : (user.companyProfile.address?.city || ''),
        state: address.state !== undefined ? address.state.trim() : (user.companyProfile.address?.state || ''),
        pincode: address.pincode !== undefined ? address.pincode.trim() : (user.companyProfile.address?.pincode || ''),
        country: address.country !== undefined ? address.country.trim() : (user.companyProfile.address?.country || 'India'),
      };
    }

    await user.save();

    // 3. Sync changes to linked Brand document if manufacturer
    if (user.role === 'manufacturer') {
      await Brand.findOneAndUpdate(
        { manufacturer: user._id },
        {
          $set: {
            companyName: user.companyName,
            gst: user.gst,
            cin: user.cin,
          },
        }
      );
    }

    return successResponse(res, {
      message: 'Company profile updated successfully.',
      profile: {
        companyName: user.companyName,
        gst: user.gst,
        cin: user.cin,
        ...user.companyProfile.toObject(),
      },
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 2. TEAM MEMBERS MANAGEMENT
// =============================================================================

/**
 * @desc Get all team members of the organization
 * @route GET /api/v1/settings/team
 * @access Authenticated (Manufacturer, Partner, Admin)
 */
const getTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find({ organization: req.user._id })
      .populate('user', 'name email walletAddress isVerified')
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, {
      total: members.length,
      members,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Add or invite a team member to the organization
 * @route POST /api/v1/settings/team
 * @access Authenticated (Manufacturer, Partner, Admin)
 */
const inviteTeamMember = async (req, res, next) => {
  try {
    const { name, email, phone, role = 'Operator' } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Check if team member already exists in this organization
    const existing = await TeamMember.findOne({
      organization: req.user._id,
      email: cleanEmail,
    });

    if (existing) {
      return errorResponse(res, `A team member with email "${cleanEmail}" already exists in your organization.`, 400, 'MEMBER_ALREADY_EXISTS');
    }

    // Check if a registered User account matches this email
    const linkedUser = await User.findOne({ email: cleanEmail });

    const member = await TeamMember.create({
      organization: req.user._id,
      user: linkedUser ? linkedUser._id : null,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      role,
      status: 'Active',
      invitedBy: req.user._id,
      lastActiveAt: new Date(),
    });

    console.log(`[Team] Member "${member.name}" (${member.email}) added to organization as ${member.role}`);

    return successResponse(
      res,
      {
        member,
        message: `Team member "${member.name}" successfully added with role ${member.role}.`,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update a team member's role or status
 * @route PATCH /api/v1/settings/team/:memberId
 * @access Authenticated (Manufacturer, Partner, Admin)
 */
const updateTeamMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { role, status } = req.body;

    const member = await TeamMember.findOne({
      _id: memberId,
      organization: req.user._id,
    });

    if (!member) {
      return errorResponse(res, `Team member "${memberId}" was not found in your organization.`, 404, 'MEMBER_NOT_FOUND');
    }

    if (role) member.role = role;
    if (status) member.status = status;

    await member.save();

    return successResponse(res, {
      member,
      message: `Team member updated successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Remove a team member from the organization
 * @route DELETE /api/v1/settings/team/:memberId
 * @access Authenticated (Manufacturer, Partner, Admin)
 */
const removeTeamMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const result = await TeamMember.findOneAndDelete({
      _id: memberId,
      organization: req.user._id,
    });

    if (!result) {
      return errorResponse(res, `Team member "${memberId}" was not found in your organization.`, 404, 'MEMBER_NOT_FOUND');
    }

    return successResponse(res, {
      message: `Team member "${result.name}" has been removed from your organization.`,
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 3. NOTIFICATION PREFERENCES
// =============================================================================

/**
 * @desc Get user's notification & alert preferences
 * @route GET /api/v1/settings/notifications
 * @access Authenticated
 */
const getNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return successResponse(res, {
      preferences: user.notificationPreferences || {
        emailNotifications: true,
        smsNotifications: true,
        lowCreditWarning: true,
        lowCreditThreshold: 500,
        counterfeitAlerts: true,
        transferUpdates: true,
        dailyDigest: false,
        webhookUrl: '',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update user's notification & alert preferences
 * @route PATCH /api/v1/settings/notifications
 * @access Authenticated
 */
const updateNotificationPreferences = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    user.notificationPreferences = {
      ...(user.notificationPreferences ? user.notificationPreferences.toObject() : {}),
      ...updates,
    };

    await user.save();

    return successResponse(res, {
      message: 'Notification preferences updated successfully.',
      preferences: user.notificationPreferences,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getTeamMembers,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
  getNotificationPreferences,
  updateNotificationPreferences,
};
