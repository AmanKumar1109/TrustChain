import React, { useState } from 'react';
import {
  User,
  Phone,
  Globe,
  Bell,
  Wallet,
  Shield,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  FileText,
  LogOut,
  X,
  FileWarning,
} from 'lucide-react';

interface ConsumerProfileScreenProps {
  userPhone: string;
  onOpenMyReports: () => void;
  onLogout?: () => void;
}

export const ConsumerProfileScreen: React.FC<ConsumerProfileScreenProps> = ({
  userPhone,
  onOpenMyReports,
  onLogout,
}) => {
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Tamil' | 'Marathi'>('English');
  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    warrantyExpiry: true,
    counterfeitBounties: true,
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Mock embedded non-custodial wallet address for user
  const mockWalletAddress = '0x8B7a5C29C1F82141a0cD0e3cE016aF7A93699b21';
  const mockPrivateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(mockPrivateKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#2B2644] text-white flex items-center justify-center font-bold text-xl shadow-md">
          <User className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Verified Consumer
          </span>
          <h3 className="text-lg font-semibold text-black mt-1">{userPhone}</h3>
          <span className="text-xs text-black/50">Polygon Decentralized Identity: Active</span>
        </div>
      </div>

      {/* Quick Navigation to Reports */}
      <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm">
        <button
          type="button"
          onClick={onOpenMyReports}
          className="w-full flex items-center justify-between p-2 hover:bg-black/[0.02] rounded-2xl transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <FileWarning className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-black block">My Counterfeit Reports</span>
              <span className="text-xs text-black/50">View status & validation bounties</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-black/30 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-black/60" />
          <h3 className="text-sm font-semibold text-black">Language Preference</h3>
        </div>
        <p className="text-xs text-black/50">Select your preferred verification and SMS language.</p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {(['English', 'Hindi', 'Tamil', 'Marathi'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-medium border text-center transition-all ${
                language === lang
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-[#F5F5F5] text-black/70 border-black/5 hover:bg-black/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-black/60" />
          <h3 className="text-sm font-semibold text-black">Notification Preferences</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-medium text-black block">SMS Alerts</span>
              <span className="text-[11px] text-black/50">Instant SMS confirmation for claimed warranties</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
              className="w-4 h-4 accent-black rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer border-t border-black/5 pt-3">
            <div>
              <span className="text-xs font-medium text-black block">Warranty Expiry Reminders</span>
              <span className="text-[11px] text-black/50">Notice 30 days before manufacturer warranty expires</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.warrantyExpiry}
              onChange={(e) => setNotifications({ ...notifications, warrantyExpiry: e.target.checked })}
              className="w-4 h-4 accent-black rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer border-t border-black/5 pt-3">
            <div>
              <span className="text-xs font-medium text-black block">Bounty & Reward Credits</span>
              <span className="text-[11px] text-black/50">Updates when counterfeit reports are approved</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.counterfeitBounties}
              onChange={(e) => setNotifications({ ...notifications, counterfeitBounties: e.target.checked })}
              className="w-4 h-4 accent-black rounded"
            />
          </label>
        </div>
      </div>

      {/* Advanced: Export to my own wallet */}
      <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#2B2644]" />
          <h3 className="text-sm font-semibold text-black">Advanced Blockchain Custody</h3>
        </div>
        <p className="text-xs text-black/60 leading-relaxed">
          Your product ownership tokens and warranty NFTs are managed seamlessly in the background on Polygon PoS. You can export ownership directly to your own self-custody wallet (MetaMask, Coinbase Wallet, Phantom).
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="w-full py-3 bg-[#F5F5F5] hover:bg-black/5 text-black border border-black/10 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-black/60" />
            Export to My Own Wallet
          </button>
        </div>
      </div>

      {/* Export to Wallet Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 border border-black/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#2B2644]" /> Self-Custody Export
              </span>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Security Warning</span>
                <span>Never share your private key with anyone. TrustChain staff will never ask for your key.</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-black/50 uppercase text-[10px] font-semibold block mb-1">
                  Public Polygon Address
                </span>
                <div className="bg-[#F5F5F5] p-3 rounded-2xl font-mono text-[11px] break-all border border-black/5 text-black select-all">
                  {mockWalletAddress}
                </div>
              </div>

              <div>
                <span className="text-black/50 uppercase text-[10px] font-semibold block mb-1">
                  Private Key (ECDSA Secp256k1)
                </span>
                <div className="bg-[#F5F5F5] p-3 rounded-2xl font-mono text-[11px] break-all border border-black/5 text-black select-all">
                  {mockPrivateKey}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyKey}
                className="flex-1 py-3 bg-black text-white text-xs font-semibold rounded-full hover:bg-black/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedKey ? 'Copied to Clipboard' : 'Copy Private Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerProfileScreen;
