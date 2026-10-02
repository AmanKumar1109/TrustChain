import React, { useState } from 'react';
import {
  Building2,
  Users,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Mail,
  UserPlus,
  Trash2,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [profile, setProfile] = useState({
    companyName: 'Cipla Healthcare India Ltd.',
    legalName: 'Cipla Limited',
    gstin: '27AABCU9603R1ZX',
    cin: 'L24239MH1935PLC002380',
    drugLicense: 'MH-TZ1-140284',
    registeredOffice: 'Cipla House, Peninsula Business Park, Ganpatrao Kadam Marg, Lower Parel, Mumbai 400013',
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'tm-1',
      name: 'Dr. Rajesh Varma',
      email: 'rajesh.varma@cipla.com',
      role: 'Super Admin',
      status: 'Active',
    },
    {
      id: 'tm-2',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@cipla.com',
      role: 'Supply Chain Manager',
      status: 'Active',
    },
    {
      id: 'tm-3',
      name: 'Karan Mehra',
      email: 'karan.m@cipla.com',
      role: 'Compliance & Quality Auditor',
      status: 'Active',
    },
  ]);

  const [notifications, setNotifications] = useState({
    instantFakeAlert: true,
    dailyScanDigest: true,
    partnerHandoffUpdates: true,
    creditThresholdAlert: true,
    smsSecurityOtp: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
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
          className="px-6 py-2.5 rounded-full text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          {savedSuccess ? 'Settings Saved ✓' : 'Save Changes'}
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
            onClick={() => alert('Invite team member modal')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F5F5F5] hover:bg-black/5 rounded-full text-xs font-medium text-black transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-center justify-between text-xs"
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
                  {m.status}
                </span>
              </div>
            </div>
          ))}
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
              id: 'instantFakeAlert',
              title: 'Instant Counterfeit Spike Alerts',
              desc: 'SMS and email notifications when >5 duplicate scans are detected in any single city within 1 hour.',
            },
            {
              id: 'dailyScanDigest',
              title: 'Daily Authenticity & Scan Digest',
              desc: 'Comprehensive summary of verified scans, reward claims, and inventory velocities.',
            },
            {
              id: 'partnerHandoffUpdates',
              title: 'Supply Chain Handoff Confirmations',
              desc: 'Real-time alert when a distributor or retailer accepts custody on Polygon.',
            },
            {
              id: 'creditThresholdAlert',
              title: 'Low QR Credit Alert (<15%)',
              desc: 'Advance warning before QR minting balance falls below operational threshold.',
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
                defaultChecked={true}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
