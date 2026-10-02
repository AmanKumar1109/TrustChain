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
  Loader2,
  KeyRound,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

interface ConsumerProfileScreenProps {
  userPhone: string;
  onOpenMyReports: () => void;
  onLogout?: () => void;
}

export const ConsumerProfileScreen: React.FC<ConsumerProfileScreenProps> = ({
  userPhone: initialUserPhone,
  onOpenMyReports,
  onLogout,
}) => {
  const session = api.auth.getSession();
  const userPhone = session?.phone || initialUserPhone || '+91 98765 43210';
  const userName = session?.name || 'Verified Consumer';

  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Tamil' | 'Marathi'>('English');
  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    warrantyExpiry: true,
    counterfeitBounties: true,
  });

  // Export Wallet Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState<'otp' | 'revealed'>('otp');
  const [otp, setOtp] = useState('123456');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [exportedWallet, setExportedWallet] = useState<{
    walletAddress: string;
    privateKey: string;
  }>({
    walletAddress: session?.walletAddress || '0x8B7a5C29C1F82141a0cD0e3cE016aF7A93699b21',
    privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
  });
  const [copiedKey, setCopiedKey] = useState(false);

  const handleOpenExportModal = () => {
    setExportStep('otp');
    setOtp('123456');
    setShowExportModal(true);
  };

  const handleVerifyOtpForExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsVerifyingOtp(true);
    try {
      const res = await api.consumer.exportWallet(otp.trim());
      if (res.success && res.data) {
        setExportedWallet({
          walletAddress: res.data.walletAddress || session?.walletAddress || '0x8B7a5C29C1F82141a0cD0e3cE016aF7A93699b21',
          privateKey: res.data.privateKey || '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
        });
        toast.success(res.message || 'Identity re-verified! Private key decrypted.');
        setExportStep('revealed');
      } else {
        toast.error(res.message || 'Invalid OTP code. Please use demo OTP: 123456');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(exportedWallet.privateKey);
    setCopiedKey(true);
    toast.success('Private key copied to clipboard!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setExportStep('otp');
    setOtp('123456');
  };

  const handleUserLogout = () => {
    api.auth.logout();
    onLogout?.();
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
            onClick={handleOpenExportModal}
            className="w-full py-3 bg-[#F5F5F5] hover:bg-black/5 text-black border border-black/10 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-black/60" />
            Export to My Own Wallet
          </button>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleUserLogout}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out of Consumer Account
        </button>
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
                onClick={handleCloseExportModal}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {exportStep === 'otp' ? (
              <form onSubmit={handleVerifyOtpForExport} className="space-y-4">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
                  <KeyRound className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Identity Re-verification Required</span>
                    <span>For security, enter the 6-digit OTP sent to {userPhone} before exporting raw credentials.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Enter Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono tracking-widest text-center text-lg focus:outline-none focus:border-black"
                  />
                  <span className="text-[10px] text-black/40 block text-center mt-1">
                    Demo OTP code: <strong className="font-mono text-black">123456</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseExportModal}
                    className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otp.length < 4}
                    className="flex-1 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify & Export</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
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
                      {exportedWallet.walletAddress}
                    </div>
                  </div>

                  <div>
                    <span className="text-black/50 uppercase text-[10px] font-semibold block mb-1">
                      Private Key (ECDSA Secp256k1)
                    </span>
                    <div className="bg-[#F5F5F5] p-3 rounded-2xl font-mono text-[11px] break-all border border-black/5 text-black select-all">
                      {exportedWallet.privateKey}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerProfileScreen;
