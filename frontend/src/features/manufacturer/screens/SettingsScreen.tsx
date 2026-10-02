import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Mail,
  UserPlus,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

export const SettingsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    companyName: 'Cipla Healthcare India Ltd.',
    legalName: 'Cipla Limited',
    gstin: '27AABCU9603R1ZX',
    cin: 'L24239MH1935PLC002380',
    drugLicense: 'MH-TZ1-140284',
    registeredOffice: 'Cipla House, Peninsula Business Park, Lower Parel, Mumbai 400013',
  });

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<any[]>([
    {
      id: 'tm-1',
      name: 'Dr. Rajesh Varma',
      email: 'rajesh.varma@cipla.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 'tm-2',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@cipla.com',
      role: 'Manager',
      status: 'Active',
    },
    {
      id: 'tm-3',
      name: 'Karan Mehra',
      email: 'karan.m@cipla.com',
      role: 'Compliance',
      status: 'Active',
    },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    counterfeitAlerts: true,
    dailyDigest: true,
    transferUpdates: true,
    lowCreditWarning: true,
    smsNotifications: true,
  });

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Admin' | 'Manager' | 'Operator' | 'Compliance'>('Operator');
  const [submittingMember, setSubmittingMember] = useState(false);

  // Fetch initial profile, team, and notification preferences
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [profileRes, teamRes, notifRes] = await Promise.all([
        api.settings.getCompanyProfile(),
        api.settings.getTeamMembers(),
        api.settings.getNotificationPreferences(),
      ]);

      if (profileRes.success && profileRes.data?.profile) {
        const p = profileRes.data.profile;
        let regOffice = profile.registeredOffice;
        if (p.address) {
          if (typeof p.address === 'object') {
            regOffice = [p.address.street, p.address.city, p.address.state, p.address.pincode].filter(Boolean).join(', ') || regOffice;
          } else {
            regOffice = p.address;
          }
        }

        setProfile({
          companyName: p.companyName || p.name || profile.companyName,
          legalName: p.legalName || p.companyName || profile.legalName,
          gstin: p.gst || profile.gstin,
          cin: p.cin || profile.cin,
          drugLicense: p.licenseNumber || profile.drugLicense,
          registeredOffice: regOffice,
        });
      }

      if (teamRes.success && teamRes.data?.members && teamRes.data.members.length > 0) {
        setTeamMembers(teamRes.data.members);
      }

      if (notifRes.success && notifRes.data?.preferences) {
        const pref = notifRes.data.preferences;
        setNotifications({
          counterfeitAlerts: pref.counterfeitAlerts ?? true,
          dailyDigest: pref.dailyDigest ?? true,
          transferUpdates: pref.transferUpdates ?? true,
          lowCreditWarning: pref.lowCreditWarning ?? true,
          smsNotifications: pref.smsNotifications ?? true,
        });
      }
    } catch (err) {
      console.warn('Could not load settings from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const [profileRes, notifRes] = await Promise.all([
        api.settings.updateCompanyProfile({
          companyName: profile.companyName,
          legalName: profile.legalName,
          gst: profile.gstin,
          cin: profile.cin,
          address: {
            street: profile.registeredOffice,
          },
        }),
        api.settings.updateNotificationPreferences(notifications),
      ]);

      if (profileRes.success || notifRes.success) {
        setSavedSuccess(true);
        toast.success('Organization profile & notification preferences saved!');
        setTimeout(() => setSavedSuccess(false), 2200);
      } else {
        toast.error(profileRes.error?.message || notifRes.error?.message || 'Failed to save settings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      toast.error('Please provide name and email for the team member.');
      return;
    }

    setSubmittingMember(true);
    try {
      const res = await api.settings.inviteTeamMember({
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: newMemberRole,
      });

      if (res.success) {
        toast.success(`Team member ${newMemberName} added as ${newMemberRole}!`);
        setShowAddMemberModal(false);
        setNewMemberName('');
        setNewMemberEmail('');
        // Refresh team members list
        const teamRes = await api.settings.getTeamMembers();
        if (teamRes.success && teamRes.data?.members) {
          setTeamMembers(teamRes.data.members);
        }
      } else {
        toast.error(res.error?.message || 'Failed to invite team member');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error inviting member');
    } finally {
      setSubmittingMember(false);
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your organization?`)) return;

    try {
      const res = await api.settings.removeTeamMember(id);
      if (res.success) {
        toast.success(`Removed ${name} from organization.`);
        setTeamMembers((prev) => prev.filter((m) => (m._id || m.id) !== id));
      } else {
        toast.error(res.error?.message || 'Could not remove member');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error removing team member');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Organization Settings
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Manage company compliance profile, access roles, and automated security notification triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-full text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{saving ? 'Saving...' : savedSuccess ? 'Settings Saved ✓' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 1. Company Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 mb-4">
          <Building2 className="w-5 h-5 text-black" />
          <h3 className="text-base font-medium text-black">Company & Regulatory Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              Brand Display Name
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              Legal Registered Name
            </label>
            <input
              type="text"
              value={profile.legalName}
              onChange={(e) => setProfile({ ...profile, legalName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              GSTIN
            </label>
            <input
              type="text"
              value={profile.gstin}
              onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono text-sm uppercase focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              CIN / Manufacturing License
            </label>
            <input
              type="text"
              value={profile.cin}
              onChange={(e) => setProfile({ ...profile, cin: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono text-sm uppercase focus:outline-none focus:border-black"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              Corporate Headquarters Address
            </label>
            <input
              type="text"
              value={profile.registeredOffice}
              onChange={(e) => setProfile({ ...profile, registeredOffice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* 2. Team Members & Roles Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-black" />
            <h3 className="text-base font-medium text-black">Team Members & Access Control</h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMemberModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F5F5F5] hover:bg-black/5 rounded-full text-xs font-medium text-black transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((m) => {
            const memberId = m._id || m.id;
            return (
              <div
                key={memberId}
                className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-center justify-between text-xs hover:border-black/10 transition-colors"
              >
                <div>
                  <span className="font-semibold text-black block">{m.name}</span>
                  <span className="text-black/50 text-[11px]">{m.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-black/70 font-medium border border-black/5">
                    {m.role}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                    {m.status || 'Active'}
                  </span>
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(memberId, m.name)}
                      title="Remove member"
                      className="p-1 text-black/40 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-black/5 mb-4">
          <Bell className="w-5 h-5 text-black" />
          <h3 className="text-base font-medium text-black">Automated Security & Operations Alerts</h3>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              id: 'counterfeitAlerts' as const,
              title: 'Instant Counterfeit Spike Alerts',
              desc: 'SMS and email notifications when duplicate or suspicious scans are flagged by consumer verifications.',
            },
            {
              id: 'dailyDigest' as const,
              title: 'Daily Authenticity & Scan Digest',
              desc: 'Comprehensive summary of verified scans, reward claims, and inventory velocities.',
            },
            {
              id: 'transferUpdates' as const,
              title: 'Supply Chain Handoff Confirmations',
              desc: 'Real-time alert when a distributor or retailer accepts custody in the ledger.',
            },
            {
              id: 'lowCreditWarning' as const,
              title: 'Low QR Credit Alert (<15%)',
              desc: 'Advance warning before QR minting balance falls below operational threshold.',
            },
            {
              id: 'smsNotifications' as const,
              title: 'SMS Security Broadcasts',
              desc: 'Dispatch emergency recall notices and urgent compliance alerts to registered management phones.',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5"
            >
              <div className="max-w-xl">
                <span className="font-semibold text-black block mb-0.5">{item.title}</span>
                <span className="text-black/60 text-[11px] leading-relaxed">{item.desc}</span>
              </div>

              <input
                type="checkbox"
                checked={notifications[item.id]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [item.id]: e.target.checked })
                }
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              Add Team Member
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Grant dashboard and operational permissions to authorized colleagues.
            </p>

            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Dr. Priya Nair"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="priya.nair@company.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Assigned Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                >
                  <option value="Operator">Operator (Batch creation & scanning)</option>
                  <option value="Manager">Manager (Transfers & inventory)</option>
                  <option value="Compliance">Compliance (Recalls & counterfeit audit)</option>
                  <option value="Admin">Admin (Full administrative privileges)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingMember}
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submittingMember && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submittingMember ? 'Adding Member...' : 'Authorize & Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
