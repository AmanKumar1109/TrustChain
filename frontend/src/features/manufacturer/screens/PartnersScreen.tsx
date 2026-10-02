import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Star,
  MapPin,
  X,
  Copy,
  CheckCircle2,
  ExternalLink,
  Building2,
  Clock,
} from 'lucide-react';
import { PartnerItem } from '../types';

export const PartnersScreen: React.FC = () => {
  const [partners, setPartners] = useState<PartnerItem[]>([
    {
      id: 'pt-1',
      name: 'National Pharma Logistics Hub',
      role: 'Distributor',
      location: 'Bhiwandi Central Hub, Mumbai',
      status: 'active',
      reputationScore: 98,
      totalTransfers: 142,
      joinedDate: 'Jan 2026',
      gstin: '27AABCN8891P1Z9',
    },
    {
      id: 'pt-2',
      name: 'Apex Health Distribution North',
      role: 'Distributor',
      location: 'Okhla Phase 2, New Delhi',
      status: 'active',
      reputationScore: 95,
      totalTransfers: 98,
      joinedDate: 'Feb 2026',
      gstin: '07AAACG5521A1Z5',
    },
    {
      id: 'pt-3',
      name: 'QuickMeds South Wholesale',
      role: 'Wholesaler',
      location: 'Indiranagar, Bengaluru',
      status: 'active',
      reputationScore: 92,
      totalTransfers: 54,
      joinedDate: 'Mar 2026',
      gstin: '29AABCP1142K1Z3',
    },
    {
      id: 'pt-4',
      name: 'MedPlus Retail Franchise Network',
      role: 'Retailer',
      location: 'Hyderabad, Telangana',
      status: 'active',
      reputationScore: 99,
      totalTransfers: 210,
      joinedDate: 'Dec 2025',
      gstin: '36AABCM3301L1Z8',
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<PartnerItem | null>(null);

  // Invite Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Distributor' | 'Wholesaler' | 'Retailer'>('Distributor');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://trustchain.network/invite/TC-PARTNER-8891');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Supply Chain Partners
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Authorize distributors, wholesalers, and retail pharmacies with on-chain reputation scoring.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Partner</span>
        </button>
      </div>

      {/* Partner List Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Partner Organization</th>
                <th className="p-4">Role</th>
                <th className="p-4">Primary Location</th>
                <th className="p-4">Reputation Score</th>
                <th className="p-4">Transfers Completed</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-medium text-black block">{p.name}</span>
                    <span className="text-[10px] text-black/50 font-mono">GSTIN: {p.gstin}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F5] text-black/70 font-medium">
                      {p.role}
                    </span>
                  </td>
                  <td className="p-4 text-black/60">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-black/40" />
                      <span>{p.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      <span>{p.reputationScore}%</span>
                    </span>
                  </td>
                  <td className="p-4 font-medium text-black">{p.totalTransfers} batches</td>
                  <td className="p-4">
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedPartnerDetail(p)}
                      className="px-3 py-1.5 bg-[#F5F5F5] hover:bg-black/5 text-black rounded-xl font-medium transition-colors cursor-pointer"
                    >
                      View Drawer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Partner Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              Invite Authorized Partner
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Generate a fast-track invitation link for verified supply custody.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Partner Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value as 'Distributor' | 'Wholesaler' | 'Retailer')
                  }
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                >
                  <option value="Distributor">Primary Logistics Distributor</option>
                  <option value="Wholesaler">Regional Stockist / Wholesaler</option>
                  <option value="Retailer">Retail Pharmacy / Authorized Dealer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Partner Contact Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="logistics@partnerhub.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Instant Invitation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://trustchain.network/invite/TC-PARTNER-8891"
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleCopyInvite}
                    className="px-4 py-2.5 bg-black text-white rounded-2xl text-xs font-medium hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Detail Drawer (Slide-over on right) */}
      {selectedPartnerDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50">
                    Partner Node Profile
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-black">
                    {selectedPartnerDetail.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPartnerDetail(null)}
                  className="p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-900 block">
                      Reputation Rating
                    </span>
                    <span className="text-2xl font-medium text-emerald-900">
                      {selectedPartnerDetail.reputationScore}%
                    </span>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-emerald-700" />
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-black/50">GSTIN:</span>
                    <span className="font-mono font-medium text-black">{selectedPartnerDetail.gstin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Partner Role:</span>
                    <span className="font-medium text-black">{selectedPartnerDetail.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Hub Location:</span>
                    <span className="font-medium text-black">{selectedPartnerDetail.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Onboarding Date:</span>
                    <span className="font-medium text-black">{selectedPartnerDetail.joinedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Transfers Logged:</span>
                    <span className="font-medium text-black">{selectedPartnerDetail.totalTransfers} completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/5">
              <button
                type="button"
                onClick={() => setSelectedPartnerDetail(null)}
                className="w-full py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersScreen;
