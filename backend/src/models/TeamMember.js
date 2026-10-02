const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Operator', 'Viewer', 'Compliance'],
      default: 'Operator',
    },
    status: {
      type: String,
      enum: ['Active', 'Invited', 'Suspended'],
      default: 'Active',
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique email per organization
teamMemberSchema.index({ organization: 1, email: 1 }, { unique: true });

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
