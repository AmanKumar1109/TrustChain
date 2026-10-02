import React, { useState } from 'react';
import {
  X,
  User,
  Building2,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Mail,
  FileText,
  Upload,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { api, UserSession } from '../../services/api';
import { toast } from '../../services/toast';

export type RoleType = 'consumer' | 'manufacturer' | 'partner' | 'admin';
export type AuthMode = 'signup' | 'login';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: RoleType;
  initialMode?: AuthMode;
  onSuccess?: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole,
  initialMode = 'signup',
  onSuccess,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(initialRole || null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);

  // Consumer flow states
  const [consumerName, setConsumerName] = useState('Rahul Sharma');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');
  const [consumerSuccess, setConsumerSuccess] = useState(false);

  // Manufacturer flow states
  const [mfgForm, setMfgForm] = useState({
    companyName: 'Cipla Quality Healthcare Ltd.',
    workEmail: 'compliance@cipla.com',
    password: 'Password123!',
    gstNumber: '27AAACC1206D1ZM',
    cinLicense: 'L24239MH1935PLC002380',
    docUploaded: false,
    selectedFile: null as File | null,
  });
  const [mfgSubmitted, setMfgSubmitted] = useState(false);

  // Partner flow states
  const [partnerMode, setPartnerMode] = useState<'invite' | 'apply'>('invite');
  const [inviteCode, setInviteCode] = useState('TC-INVITE-8821');
  const [partnerForm, setPartnerForm] = useState({
    contactName: 'Rajesh Malhotra',
    businessName: 'Apex Logistics & Cold Chain Hub',
    email: 'partner@apexlogistics.com',
    password: 'Password123!',
    phone: '9876500002',
    role: 'distributor' as 'distributor' | 'retailer',
    gst: '07AAACA1234F1Z8',
    shopAddress: 'Plot 45, Okhla Industrial Area Phase III',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110020',
  });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('admin@trustchain.com');
  const [loginPassword, setLoginPassword] = useState('Password123!');

  // Reset state when closing or switching
  const handleReset = () => {
    setSelectedRole(null);
    setOtpSent(false);
    setOtpValue('123456');
    setConsumerSuccess(false);
    setMfgSubmitted(false);
    setPartnerSubmitted(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // ---------------------------------------------------------------------------
  // 1. CONSUMER OTP & SIGNUP / LOGIN
  // ---------------------------------------------------------------------------
  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const res = await api.auth.consumerRequestOtp(formatted);
      if (res.success) {
        setOtpSent(true);
        toast.success(`OTP sent to +91 ${phoneNumber} (Test Code: 123456)`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsumerVerify = async () => {
    if (!otpValue || otpValue.length < 4) {
      toast.error('Please enter the 4 or 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      // In signup mode, call consumerSignup; in login mode, call consumerLogin
      const res =
        authMode === 'signup'
          ? await api.auth.consumerSignup(consumerName || 'Consumer User', formatted, otpValue)
          : await api.auth.consumerLogin(formatted, otpValue);

      if (res.success && res.data?.user) {
        setActiveSession(res.data.user);
        setConsumerSuccess(true);
        toast.success(`Welcome, ${res.data.user.name || 'Verified Consumer'}!`);
        if (onSuccess) {
          onSuccess(res.data.user);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification failed. Please check OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 2. MANUFACTURER SIGNUP & KYB ONBOARDING
  // ---------------------------------------------------------------------------
  const handleMfgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfgForm.companyName || !mfgForm.workEmail || !mfgForm.gstNumber) {
      toast.error('Please fill in all required company registration details.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create Manufacturer user account
      const res = await api.auth.register({
        name: mfgForm.companyName,
        email: mfgForm.workEmail,
        password: mfgForm.password,
        role: 'manufacturer',
        companyName: mfgForm.companyName,
        gst: mfgForm.gstNumber,
        cin: mfgForm.cinLicense,
      });

      if (res.success && res.data?.user) {
        const user = res.data.user;

        // 2. Update KYB Details
        await api.brand.updateKybDetails({
          companyName: mfgForm.companyName,
          gst: mfgForm.gstNumber,
          cin: mfgForm.cinLicense,
        }).catch(() => {});

        // 3. Optional Document Upload
        if (mfgForm.selectedFile) {
          const fd = new FormData();
          fd.append('documents', mfgForm.selectedFile);
          fd.append('documentType', 'GST_CERTIFICATE');
          await api.brand.uploadDocuments(fd).catch(() => {});
        }

        const session = { ...user, brandStatus: 'pending' as const };
        setActiveSession(session);
        api.auth.setSession(session);
        setMfgSubmitted(true);
        toast.success('Brand registration submitted for admin compliance review!');

        if (onSuccess) {
          onSuccess(session);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Brand registration failed. Please review fields.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. PARTNER SIGNUP (Invite Token vs Self-Apply)
  // ---------------------------------------------------------------------------
  const handlePartnerSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      if (partnerMode === 'invite') {
        const res = await api.partners.joinInvite({
          token: inviteCode.trim(),
          name: partnerForm.contactName,
          password: partnerForm.password,
          phone: partnerForm.phone,
          gst: partnerForm.gst,
          location: {
            address: partnerForm.shopAddress,
            city: partnerForm.city,
            state: partnerForm.state,
            pincode: partnerForm.pincode,
          },
        });

        if (res.success && res.data?.user) {
          setActiveSession(res.data.user);
          setPartnerSubmitted(true);
          toast.success('Joined partner network successfully!');
          if (onSuccess) onSuccess(res.data.user);
        }
      } else {
        const res = await api.partners.selfApply({
          email: partnerForm.email,
          password: partnerForm.password,
          name: partnerForm.contactName,
          phone: partnerForm.phone,
          role: partnerForm.role,
          businessName: partnerForm.businessName,
          gst: partnerForm.gst,
          location: {
            address: partnerForm.shopAddress,
            city: partnerForm.city,
            state: partnerForm.state,
            pincode: partnerForm.pincode,
          },
        });

        if (res.success && res.data?.user) {
          setActiveSession(res.data.user);
          setPartnerSubmitted(true);
          toast.success('Partner application submitted for upstream review!');
          if (onSuccess) onSuccess(res.data.user);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Partner registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 4. ENTERPRISE & ADMIN LOGIN
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      toast.error('Please enter your credentials.');
      return;
    }

    setIsLoading(true);
    try {
      // If consumer phone number entered
      if (/^\+?[0-9]{10,13}$/.test(loginIdentifier.replace(/[\s-]/g, ''))) {
        const cleanedPhone = loginIdentifier.startsWith('+') ? loginIdentifier : `+91${loginIdentifier}`;
        const res = await api.auth.consumerLogin(cleanedPhone, loginPassword);
        if (res.success && res.data?.user) {
          toast.success(`Welcome back, ${res.data.user.name || 'Consumer'}!`);
          if (onSuccess) onSuccess(res.data.user);
          handleClose();
        }
      } else {
        // Standard Email + Password Login (Admin, Manufacturer, Distributor, Retailer)
        const res = await api.auth.login(loginIdentifier.trim(), loginPassword);
        if (res.success && res.data?.user) {
          const user = res.data.user;
          toast.success(`Welcome back, ${user.name}!`);
          if (onSuccess) onSuccess(user);
          handleClose();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Logins Helper
  const setDemoCredential = (email: string, pass: string = 'Password123!') => {
    setLoginIdentifier(email);
    setLoginPassword(pass);
    toast.info(`Populated ${email} credentials.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-black/5 text-black my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close Auth Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header & Tab Switcher (Signup vs Login) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
              TrustChain Access Portal
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div>
              <h3
                className="text-2xl sm:text-3xl font-medium tracking-tight text-black"
                style={{ letterSpacing: '-0.03em' }}
              >
                {authMode === 'signup' ? 'Create your Account' : 'Welcome Back'}
              </h3>
              <p className="text-black/60 text-sm mt-1">
                {authMode === 'signup'
                  ? 'Select your role to get started with verified authenticity.'
                  : 'Log in to access your role-specific dashboard.'}
              </p>
            </div>

            {/* Toggle Mode */}
            <div className="inline-flex p-1 bg-[#F5F5F5] rounded-full border border-black/5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  handleReset();
                }}
                className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  handleReset();
                }}
                className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SIGNUP STEP 1: Choose Role                           */}
        {/* ---------------------------------------------------- */}
        {authMode === 'signup' && !selectedRole && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-4">
              Step 1: Choose Your Role
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Role 1: Consumer */}
              <div
                onClick={() => setSelectedRole('consumer')}
                className="group p-5 rounded-2xl border border-black/10 hover:border-black bg-white hover:bg-black/[0.02] cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black/5 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Instant OTP
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-black mb-1.5">Consumer</h4>
                  <p className="text-black/60 text-xs leading-relaxed">
                    Verify products with 1-click, earn TrustPoints, and manage digital warranties.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-black">
                  <span>Phone + OTP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black/40 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Role 2: Manufacturer / Brand */}
              <div
                onClick={() => setSelectedRole('manufacturer')}
                className="group p-5 rounded-2xl border border-black/10 hover:border-black bg-white hover:bg-black/[0.02] cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black/5 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide bg-[#2B2644]/10 text-[#2B2644] px-2.5 py-0.5 rounded-full">
                      Verified Brand
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-black mb-1.5">Manufacturer</h4>
                  <p className="text-black/60 text-xs leading-relaxed">
                    Register product batches, generate high-res QRs, and monitor counterfeit hotspots.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-black">
                  <span>GST & License</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black/40 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Role 3: Supply Partner */}
              <div
                onClick={() => setSelectedRole('partner')}
                className="group p-5 rounded-2xl border border-black/10 hover:border-black bg-white hover:bg-black/[0.02] cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black/5 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      Distributor / Retail
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-black mb-1.5">Supply Partner</h4>
                  <p className="text-black/60 text-xs leading-relaxed">
                    Log chain-of-custody handoffs and verify batch shipments before retail dispatch.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-black">
                  <span>Invite or Apply</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black/40 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* CONSUMER SIGNUP: Phone + OTP                         */}
        {/* ---------------------------------------------------- */}
        {authMode === 'signup' && selectedRole === 'consumer' && (
          <div className="animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="text-xs text-black/50 hover:text-black flex items-center gap-1 mb-4 font-medium cursor-pointer"
            >
              ← Back to role selection
            </button>

            {!consumerSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    <strong>Zero Friction:</strong> Your secure vault is automatically created for you
                    in the background with zero setup fees.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 font-medium text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-medium text-sm">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 font-medium text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                      Enter Verification OTP
                    </label>
                    <input
                      type="text"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 font-mono tracking-widest text-center text-lg focus:outline-none focus:border-black"
                    />
                    <p className="text-[11px] text-black/50 mt-1.5 text-center">
                      OTP sent to +91 {phoneNumber} • Test Code: <span className="font-bold text-black">123456</span>
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={phoneNumber.length < 10 || isLoading}
                      className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      <span>Send Verification OTP</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConsumerVerify}
                      disabled={otpValue.length < 4 || isLoading}
                      className="w-full py-3.5 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      <span>Verify & Create Account</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Consumer Success Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-2xl font-medium text-black">Consumer Account Ready</h4>
                  <p className="text-sm text-black/60 mt-1 max-w-sm mx-auto">
                    Your secure identity vault has been initialized automatically.
                  </p>
                </div>

                <div className="bg-[#F5F5F5] p-4 rounded-2xl border border-black/5 text-xs text-black/70 max-w-md mx-auto space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-black/50">Linked Phone:</span>
                    <span className="font-medium text-black">{activeSession?.phone || `+91 ${phoneNumber}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Vault ID:</span>
                    <span className="font-mono text-emerald-700">
                      {activeSession?.walletAddress ? `${activeSession.walletAddress.slice(0, 10)}...${activeSession.walletAddress.slice(-6)}` : 'Provisioned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Welcome Balance:</span>
                    <span className="font-medium text-amber-700">
                      {activeSession?.pointsBalance !== undefined ? activeSession.pointsBalance : 100} TrustPoints
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  Start Scanning Products
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MANUFACTURER SIGNUP: GST, CIN, Document Upload       */}
        {/* ---------------------------------------------------- */}
        {authMode === 'signup' && selectedRole === 'manufacturer' && (
          <div className="animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="text-xs text-black/50 hover:text-black flex items-center gap-1 mb-4 font-medium cursor-pointer"
            >
              ← Back to role selection
            </button>

            {!mfgSubmitted ? (
              <form onSubmit={handleMfgSubmit} className="space-y-4">
                <div className="p-3.5 bg-[#2B2644]/5 border border-[#2B2644]/15 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#2B2644] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#2B2644] leading-relaxed">
                    <strong>Enterprise Prepaid Credits:</strong> No crypto wallet required. Brand
                    identities undergo compliance verification before serialization activates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={mfgForm.companyName}
                      onChange={(e) => setMfgForm({ ...mfgForm, companyName: e.target.value })}
                      placeholder="e.g. Cipla Healthcare Ltd."
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      Corporate Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={mfgForm.workEmail}
                      onChange={(e) => setMfgForm({ ...mfgForm, workEmail: e.target.value })}
                      placeholder="compliance@brand.com"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      Account Password
                    </label>
                    <input
                      type="password"
                      required
                      value={mfgForm.password}
                      onChange={(e) => setMfgForm({ ...mfgForm, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      GSTIN Number
                    </label>
                    <input
                      type="text"
                      required
                      value={mfgForm.gstNumber}
                      onChange={(e) => setMfgForm({ ...mfgForm, gstNumber: e.target.value })}
                      placeholder="27AABCU9603R1ZX"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 text-sm font-mono focus:outline-none focus:border-black uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      CIN / Drug License
                    </label>
                    <input
                      type="text"
                      required
                      value={mfgForm.cinLicense}
                      onChange={(e) => setMfgForm({ ...mfgForm, cinLicense: e.target.value })}
                      placeholder="L24239MH1935PLC002380"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 text-sm font-mono focus:outline-none focus:border-black uppercase"
                    />
                  </div>
                </div>

                {/* Document Upload Area */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Verification Documents (GST / Certificate of Incorporation)
                  </label>
                  <label
                    className={`block border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
                      mfgForm.docUploaded
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-black/15 hover:border-black/30 bg-[#F5F5F5]'
                    }`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          setMfgForm({ ...mfgForm, docUploaded: true, selectedFile: file });
                        }
                      }}
                    />
                    <Upload className="w-5 h-5 mx-auto mb-1.5 text-black/50" />
                    {mfgForm.docUploaded ? (
                      <span className="text-xs font-medium text-emerald-800">
                        ✓ {mfgForm.selectedFile?.name || 'corporate_incorporation_cert.pdf'} attached
                      </span>
                    ) : (
                      <span className="text-xs text-black/60 font-medium">
                        Click to upload GST certificate or Certificate of Incorporation (PDF/JPG)
                      </span>
                    )}
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Submit Brand for Compliance Approval</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Manufacturer Pending Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Clock className="w-9 h-9" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full mb-2">
                    Status: Pending Approval
                  </div>
                  <h4 className="text-2xl font-medium text-black">Application Received</h4>
                  <p className="text-sm text-black/60 mt-1 max-w-md mx-auto">
                    Your brand registration has been submitted. Once approved by the TrustChain compliance
                    team, your batch serialization dashboard will unlock automatically.
                  </p>
                </div>

                <div className="bg-[#F5F5F5] p-4 rounded-2xl border border-black/5 text-xs text-black/70 max-w-md mx-auto space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-black/50">Company:</span>
                    <span className="font-medium text-black">{mfgForm.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">GSTIN:</span>
                    <span className="font-mono text-black">{mfgForm.gstNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Estimated Review:</span>
                    <span className="text-emerald-700 font-medium">Within 24 Hours</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  View Application Status
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SUPPLY PARTNER: Invite Link or Self-Apply            */}
        {/* ---------------------------------------------------- */}
        {authMode === 'signup' && selectedRole === 'partner' && (
          <div className="animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="text-xs text-black/50 hover:text-black flex items-center gap-1 mb-4 font-medium cursor-pointer"
            >
              ← Back to role selection
            </button>

            {!partnerSubmitted ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5F5F5] rounded-2xl border border-black/5 mb-2">
                  <button
                    type="button"
                    onClick={() => setPartnerMode('invite')}
                    className={`py-2 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      partnerMode === 'invite'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-black/50 hover:text-black'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Have Invite Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPartnerMode('apply')}
                    className={`py-2 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      partnerMode === 'apply'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-black/50 hover:text-black'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Self-Apply (GST)</span>
                  </button>
                </div>

                {partnerMode === 'invite' ? (
                  <form onSubmit={handlePartnerSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                        Brand Invitation Token / Code
                      </label>
                      <input
                        type="text"
                        required
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="e.g. TC-INVITE-8821"
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono text-sm uppercase focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.contactName}
                          onChange={(e) => setPartnerForm({ ...partnerForm, contactName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Account Password
                        </label>
                        <input
                          type="password"
                          required
                          value={partnerForm.password}
                          onChange={(e) => setPartnerForm({ ...partnerForm, password: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={partnerForm.phone}
                          onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          GST Number
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.gst}
                          onChange={(e) => setPartnerForm({ ...partnerForm, gst: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono uppercase focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      <span>Join as Verified Partner</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePartnerSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Business / Shop Name
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.businessName}
                          onChange={(e) => setPartnerForm({ ...partnerForm, businessName: e.target.value })}
                          className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Partner Role
                        </label>
                        <select
                          value={partnerForm.role}
                          onChange={(e) => setPartnerForm({ ...partnerForm, role: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        >
                          <option value="distributor">Distributor / Cold Chain Hub</option>
                          <option value="retailer">Retail Pharmacy / Store</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Work Email
                        </label>
                        <input
                          type="email"
                          required
                          value={partnerForm.email}
                          onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={partnerForm.password}
                          onChange={(e) => setPartnerForm({ ...partnerForm, password: e.target.value })}
                          className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          GSTIN Number
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.gst}
                          onChange={(e) => setPartnerForm({ ...partnerForm, gst: e.target.value })}
                          className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono uppercase focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={partnerForm.phone}
                          onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                          className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      <span>Submit Partner Application</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-2xl font-medium text-black">
                    {partnerMode === 'invite' ? 'Partner Network Activated' : 'Application Under Review'}
                  </h4>
                  <p className="text-sm text-black/60 mt-1 max-w-sm mx-auto">
                    {partnerMode === 'invite'
                      ? 'You are now ready to receive batch transfers and log custody handoffs.'
                      : 'The upstream brand administrator will approve your warehouse node shortly.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* LOGIN MODE: Consumer Phone OTP or Enterprise Login    */}
        {/* ---------------------------------------------------- */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                Mobile Number or Corporate Email
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Enter email or 10-digit mobile"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 font-medium text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-black/60">
                  Password or OTP
                </label>
                <span className="text-xs text-black/40 font-medium">Default: Password123!</span>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password or OTP"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 font-medium text-sm focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Log In to Dashboard</span>
            </button>

            {/* Quick Demo Credentials Bar */}
            <div className="p-3 bg-[#F5F5F5] rounded-2xl border border-black/5 mt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-black/50 block mb-2">
                Quick Demo Logins (Click to Autofill):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDemoCredential('admin@trustchain.com')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-[11px] font-medium hover:border-black transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredential('mfg@cipla.com')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-[11px] font-medium hover:border-black transition-colors"
                >
                  Manufacturer
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredential('distributor@apexlogistics.com')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-[11px] font-medium hover:border-black transition-colors"
                >
                  Distributor
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredential('retailer@metrolife.com')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-[11px] font-medium hover:border-black transition-colors"
                >
                  Retailer
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredential('+919876543210', '123456')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-[11px] font-medium hover:border-black transition-colors"
                >
                  Consumer (OTP)
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-black/50">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    handleReset();
                  }}
                  className="font-medium text-black hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
