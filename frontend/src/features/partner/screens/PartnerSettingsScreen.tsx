import React, { useState } from 'react';
import { Store, Truck, Bell, Save } from 'lucide-react';
import { PartnerRole } from '../types';

export const PartnerSettingsScreen: React.FC<{ role: PartnerRole }> = ({ role }) => {
  const isDistributor = role === 'distributor';
  const [partnerName, setPartnerName] = useState(
    isDistributor
      ? 'National Pharma Logistics (Bhiwandi Hub)'
      : 'Apollo Pharmacy Retail Store #18 (Noida)'
  );
  const [address, setAddress] = useState(
    isDistributor
      ? 'Plot 42, Bhiwandi Logistics Industrial Park, Mumbai 421302'
      : 'Shop 14, Main Market, Sector 18, Noida 201301'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Partner Node Settings
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Manage your physical hub address, staff access, and custody alert webhooks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors shadow-sm"
        >
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              Registered Node Name
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-medium text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
              Physical Location / Dispatch Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <span className="text-black/50 text-[11px] block">
              Node Type: <strong className="text-black capitalize">{role}</strong> · GSTIN: 27AABCN8891P1Z9
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerSettingsScreen;
