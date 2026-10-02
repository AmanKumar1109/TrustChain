const express = require('express');
const {
  getCompanyProfile,
  updateCompanyProfile,
  getTeamMembers,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
  getNotificationPreferences,
  updateNotificationPreferences,
} = require('../controllers/settings.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  updateCompanyProfileSchema,
  inviteTeamMemberSchema,
  updateTeamMemberSchema,
  updateNotificationPreferencesSchema,
} = require('../validators/settings.validator');

const router = express.Router();

// Apply authentication to all settings routes
router.use(authenticate);

// 1. Company Profile Settings
router.get('/company', getCompanyProfile);
router.patch('/company', validate(updateCompanyProfileSchema), updateCompanyProfile);
router.get('/profile', getCompanyProfile);
router.patch('/profile', validate(updateCompanyProfileSchema), updateCompanyProfile);

// 2. Organization Team Members Management
router.get('/team', getTeamMembers);
router.post('/team', validate(inviteTeamMemberSchema), inviteTeamMember);
router.patch('/team/:memberId', validate(updateTeamMemberSchema), updateTeamMember);
router.delete('/team/:memberId', removeTeamMember);

// 3. Notification & Alert Preferences
router.get('/notifications', getNotificationPreferences);
router.patch('/notifications', validate(updateNotificationPreferencesSchema), updateNotificationPreferences);

module.exports = router;
