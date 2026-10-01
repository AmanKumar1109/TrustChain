import React, { useState } from 'react';
import { X, Building2, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'brand' }) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0e1015] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand vs Consumer Selector */}
        <div className="flex p-1 bg-white/[0.04] border border-white/10 rounded-2xl mb-6">
          <button
            onClick={() => { setRole('brand'); setSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              role === 'brand' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Brand Portal</span>
          </button>
          <button
            onClick={() => { setRole('consumer'); setSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              role === 'consumer' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Consumer / Shopper</span>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Welcome to Paradox Protocol</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Magic link and onboarding instructions sent to <span className="text-zinc-200 font-mono">{email}</span>. No password needed!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
              {role === 'brand' ? 'Register Your Brand' : 'Sign in to Paradox'}
            </h3>
            <p className="text-zinc-400 text-xs mb-6">
              {role === 'brand'
                ? 'Join 180+ leading manufacturers eliminating counterfeit copies on-chain.'
                : 'Track your authentic warranties and redeem earned rewards.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'brand' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Brand / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. SonicAura Labs Pvt Ltd"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    className="w-full bg-[#14161f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/35 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {role === 'brand' ? 'Work Email' : 'Phone Number or Email'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'brand' ? 'founder@brand.com' : 'Mobile number or email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#14161f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/35 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.12)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{role === 'brand' ? 'Create Brand Account' : 'Get One-Time OTP'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <p className="text-[11px] text-zinc-500 text-center mt-4">
              Protected by ERC-4337 Account Abstraction. Zero crypto fees.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
