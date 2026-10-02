import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  ArrowUpRight,
  Download,
  CheckCircle2,
  X,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export const BillingScreen: React.FC = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [paidSuccess, setPaidSuccess] = useState(false);

  const invoices = [
    {
      id: 'INV-2026-0901',
      date: '01 Sep 2026',
      plan: 'Growth Tier (Monthly)',
      amount: '₹19,999.00',
      status: 'Paid',
      creditsAdded: '100,000 QRs',
    },
    {
      id: 'INV-2026-0801',
      date: '01 Aug 2026',
      plan: 'Growth Tier (Monthly)',
      amount: '₹19,999.00',
      status: 'Paid',
      creditsAdded: '100,000 QRs',
    },
    {
      id: 'INV-2026-0701',
      date: '01 Jul 2026',
      plan: 'Starter Tier (Monthly)',
      amount: '₹4,999.00',
      status: 'Paid',
      creditsAdded: '10,000 QRs',
    },
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaidSuccess(true);
    setTimeout(() => {
      setPaidSuccess(false);
      setShowUpgradeModal(false);
    }, 2000);
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
            Billing & QR Credit Vault
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Flat INR billing with zero cryptocurrency gas overheads. Automated tax invoices and GST credits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUpgradeModal(true)}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Add Credits / Upgrade Plan</span>
        </button>
      </div>

      {/* Top 2 Cards: Current Plan & Credit Usage Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Plan Card (solid #2B2644) */}
        <div className="lg:col-span-5 bg-[#2B2644] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full">
                Active Subscription
              </span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-renews 01 Nov</span>
              </span>
            </div>

            <h3 className="text-3xl font-medium tracking-tight mb-1" style={{ letterSpacing: '-0.03em' }}>
              Growth Tier
            </h3>
            <div className="text-2xl font-bold text-white mb-4">
              ₹19,999 <span className="text-sm font-normal text-white/60">/ month + GST</span>
            </div>

            <p className="text-white/70 text-xs leading-relaxed mb-6">
              Includes 100,000 monthly Polygon QR identities, live counterfeit heatmap, and OTP warranty registrations.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Billed to GSTIN: 27AABCU9603R1ZX</span>
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="text-white font-medium hover:underline flex items-center gap-1"
            >
              <span>Change</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Credits Usage Meter (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-black">Monthly QR Credits Usage</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                84.2% Available
              </span>
            </div>
            <p className="text-xs text-black/50 mb-6">
              Credits reset every billing cycle. Unused credits roll over for 90 days.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-black">15,800 QRs Minted</span>
                <span className="text-black/50">100,000 QR Quota</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F5F5F5] overflow-hidden p-0.5 border border-black/5">
                <div style={{ width: '15.8%' }} className="h-full rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-[#F5F5F5] p-3.5 rounded-2xl border border-black/5">
              <div>
                <span className="text-black/50 block text-[11px]">Available Balance</span>
                <span className="font-semibold text-black">84,200 Credits</span>
              </div>
              <div>
                <span className="text-black/50 block text-[11px]">Cost per Extra Unit</span>
                <span className="font-semibold text-black">₹0.18 / QR</span>
              </div>
              <div>
                <span className="text-black/50 block text-[11px]">Polygon Gas Cost</span>
                <span className="font-semibold text-emerald-800">100% Sponsored</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="text-xs font-medium text-black hover:underline"
            >
              Top Up Emergency Credits →
            </button>
          </div>
        </div>
      </div>

      {/* Tax Invoices Table in INR */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-black">GST Tax Invoices (INR)</h3>
            <p className="text-xs text-black/50">Compliant with Indian Input Tax Credit (ITC)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Invoice Number</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Plan / Package</th>
                <th className="p-4">Credits Added</th>
                <th className="p-4">Total Amount (INR)</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-black">{inv.id}</td>
                  <td className="p-4 text-black/70">{inv.date}</td>
                  <td className="p-4 font-medium text-black">{inv.plan}</td>
                  <td className="p-4 text-black/70">{inv.creditsAdded}</td>
                  <td className="p-4 font-bold text-black">{inv.amount}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading Invoice ${inv.id}`)}
                      className="inline-flex items-center gap-1 text-black hover:text-black/60 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade / Add Credits Modal with UPI and Card Payment UI */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!paidSuccess ? (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-medium tracking-tight text-black">Add 50,000 QR Credits</h3>
                </div>
                <p className="text-xs text-black/60 mb-4">
                  Top up QR minting balance. Instant automated credit to your brand vault.
                </p>

                <div className="p-3 bg-[#F5F5F5] rounded-2xl border border-black/5 flex justify-between items-center text-xs">
                  <span className="text-black/60">Amount Payable:</span>
                  <span className="text-base font-bold text-black">₹9,000 + 18% GST (₹10,620)</span>
                </div>

                {/* Payment Method Switcher: UPI vs Card */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                    Payment Method (India)
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5F5F5] rounded-2xl border border-black/5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 text-xs font-medium rounded-xl transition-all ${
                        paymentMethod === 'upi' ? 'bg-white text-black shadow-sm' : 'text-black/50'
                      }`}
                    >
                      Instant UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 text-xs font-medium rounded-xl transition-all ${
                        paymentMethod === 'card' ? 'bg-white text-black shadow-sm' : 'text-black/50'
                      }`}
                    >
                      Corporate Card
                    </button>
                  </div>
                </div>

                {paymentMethod === 'upi' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="company@hdfcbank or 98214...@paytm"
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                      />
                    </div>
                    <p className="text-[11px] text-black/50">
                      Supports Google Pay, PhonePe, Paytm, BHIM and netbanking.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVV"
                        className="px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Pay ₹10,620 & Top Up Credits
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-medium text-black">Payment Approved</h4>
                <p className="text-xs text-black/60">
                  +50,000 QR credits have been added to your vault balance. Tax invoice dispatched.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingScreen;
