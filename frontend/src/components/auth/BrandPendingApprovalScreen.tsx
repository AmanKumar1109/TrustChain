import React, { useState } from 'react';
import {
  Clock,
  Building2,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { LogoIcon } from '../common/LogoIcon';
import { api, UserSession } from '../../services/api';
import { toast } from '../../services/toast';

interface BrandPendingApprovalScreenProps {
  session: UserSession | null;
  onStatusApproved: (session: UserSession) => void;
  onLogout: () => void;
}

export const BrandPendingApprovalScreen: React.FC<BrandPendingApprovalScreenProps> = ({
  session,
  onStatusApproved,
  onLogout,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const res = await api.auth.getMe();
      if (res.success && res.data?.user) {
        const updated = res.data.user;
        const brandStatus = updated.brandStatus || 'pending';

        if (brandStatus === 'approved') {
          toast.success('🎉 Congratulations! Your brand application has been approved.');
          api.auth.setSession(updated);
          onStatusApproved(updated);
        } else if (brandStatus === 'rejected') {
          toast.error(`Application status: Rejected. ${updated.suspensionReason || 'Please contact compliance support.'}`);
        } else if (brandStatus === 'info_requested') {
          toast.warning('Additional compliance information requested. Please check your corporate email.');
        } else {
          toast.info('Your application is still under review by our compliance team.');
        }
      } else {
        toast.info('Application is currently under review.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not refresh application status.');
    } finally {
      setIsChecking(false);
    }
  };

  const companyName = session?.companyProfile?.legalBusinessName || session?.name || 'Cipla Healthcare Ltd.';
  const gstin = session?.companyProfile?.gstin || '27AAACC1206D1ZM';
  const cin = session?.companyProfile?.cin || 'L24239MH1935PLC002380';
  const email = session?.email || 'compliance@cipla.com';

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-black font-sans selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-black/10 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">TrustChain</span>
            <span className="text-xs font-semibold uppercase tracking-wider bg-black/5 text-black/60 px-2.5 py-0.5 rounded-full ml-1">
              Brand Onboarding
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-black/60 hidden sm:inline">
              Logged in as <strong className="text-black">{session?.email || session?.name}</strong>
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-medium text-black/60 hover:text-black hover:bg-black/5 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Review Notice Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-black/5 relative overflow-hidden">
          {/* Subtle decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>KYB Compliance Application Under Review</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-medium tracking-tight text-black mb-3"
            style={{ letterSpacing: '-0.03em' }}
          >
            Welcome, {companyName}
          </h2>

          <p className="text-black/60 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Your brand verification documents, GSTIN registration, and corporate authorization are
            currently undergoing review by the TrustChain compliance team. Once approved, your
            smart contract relayer permissions and cryptographic batch serialization dashboard will unlock automatically.
          </p>

          {/* Review Progress Tracker */}
          <div className="mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-4">
              Onboarding & Compliance Workflow
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Step 1</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-emerald-950">Account Created</h4>
                </div>
                <p className="text-[11px] text-emerald-800/80 mt-2">Credentials & corporate contact saved.</p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Step 2</span>
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <h4 className="text-sm font-semibold text-amber-950">KYB Document Review</h4>
                </div>
                <p className="text-[11px] text-amber-800/80 mt-2">GSTIN & CIN validation in progress.</p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/10 text-black/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black/40">Step 3</span>
                    <ShieldCheck className="w-4 h-4 text-black/30" />
                  </div>
                  <h4 className="text-sm font-semibold text-black/70">On-Chain Role Grant</h4>
                </div>
                <p className="text-[11px] text-black/50 mt-2">Contract relayer wallet authorization.</p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/10 text-black/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black/40">Step 4</span>
                    <Building2 className="w-4 h-4 text-black/30" />
                  </div>
                  <h4 className="text-sm font-semibold text-black/70">Dashboard Unlocked</h4>
                </div>
                <p className="text-[11px] text-black/50 mt-2">Live batch serialization & QR generation.</p>
              </div>
            </div>
          </div>

          {/* Details Summary Card */}
          <div className="p-6 rounded-2xl bg-[#F5F5F5] border border-black/5 mb-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-black/50 mb-3">
              Submitted Corporate Registration Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-black/50 block mb-0.5">Legal Entity:</span>
                <span className="font-semibold text-black">{companyName}</span>
              </div>
              <div>
                <span className="text-black/50 block mb-0.5">GSTIN Number:</span>
                <span className="font-mono font-semibold text-black uppercase">{gstin}</span>
              </div>
              <div>
                <span className="text-black/50 block mb-0.5">CIN / License:</span>
                <span className="font-mono font-semibold text-black uppercase">{cin}</span>
              </div>
              <div>
                <span className="text-black/50 block mb-0.5">Official Email:</span>
                <span className="font-semibold text-black">{email}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-black/10">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking On-Chain Status...' : 'Check Approval Status'}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-6 py-3 bg-white text-black border border-black/15 text-sm font-medium rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            >
              Sign In with Another Account
            </button>
          </div>

          {/* Help & Support Footer */}
          <div className="mt-8 pt-6 border-t border-black/5 flex flex-wrap items-center justify-between text-xs text-black/50 gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-black/40" />
              <span>Need accelerated review? Contact our enterprise compliance desk:</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:compliance@trustchain.com"
                className="hover:text-black flex items-center gap-1 font-medium transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>compliance@trustchain.com</span>
              </a>
              <span className="text-black/20">•</span>
              <span className="flex items-center gap-1 font-medium text-black/70">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 22 2482 6000</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandPendingApprovalScreen;
