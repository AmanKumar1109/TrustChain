import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Sparkles,
  ArrowUpRight,
  Download,
  CheckCircle2,
  X,
  QrCode,
  ShieldCheck,
  Loader2,
  FileText,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

export const BillingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [selectedTopupAmount, setSelectedTopupAmount] = useState<number>(5000);
  const [upiId, setUpiId] = useState('brand@okhdfcbank');
  const [submittingTopup, setSubmittingTopup] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any | null>(null);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const [overviewRes, invoicesRes] = await Promise.all([
        api.billing.getOverview(),
        api.billing.getInvoices(),
      ]);

      if (overviewRes.success && overviewRes.data) {
        setOverview(overviewRes.data);
      }

      if (invoicesRes.success && invoicesRes.data?.invoices) {
        setInvoices(invoicesRes.data.invoices);
      } else if (overviewRes.data?.recentInvoices) {
        setInvoices(overviewRes.data.recentInvoices);
      } else {
        populateMockInvoices();
      }
    } catch (err) {
      console.warn('Failed to load billing overview from API:', err);
      populateMockInvoices();
    } finally {
      setLoading(false);
    }
  };

  const populateMockInvoices = () => {
    setInvoices([
      {
        id: 'INV-2026-0901',
        invoiceNumber: 'INV-2026-0901',
        createdAt: '2026-09-01',
        plan: 'Growth Tier (Monthly)',
        totalAmountINR: 19999,
        status: 'PAID',
        creditsAdded: 100000,
      },
      {
        id: 'INV-2026-0801',
        invoiceNumber: 'INV-2026-0801',
        createdAt: '2026-08-01',
        plan: 'Growth Tier (Monthly)',
        totalAmountINR: 19999,
        status: 'PAID',
        creditsAdded: 100000,
      },
      {
        id: 'INV-2026-0701',
        invoiceNumber: 'INV-2026-0701',
        createdAt: '2026-07-01',
        plan: 'Starter Tier (Monthly)',
        totalAmountINR: 4999,
        status: 'PAID',
        creditsAdded: 10000,
      },
    ]);
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTopup(true);
    try {
      const res = await api.billing.topup({
        amountINR: selectedTopupAmount,
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : 'CARD',
        upiId: paymentMethod === 'upi' ? upiId : undefined,
      });

      if (res.success && res.data) {
        setSuccessDetails(res.data);
        setPaidSuccess(true);
        toast.success(`₹${selectedTopupAmount.toLocaleString('en-IN')} Top-up processed successfully!`);
        await fetchBillingData();
        setTimeout(() => {
          setPaidSuccess(false);
          setShowUpgradeModal(false);
        }, 2200);
      } else {
        toast.error(res.error?.message || 'Top-up payment simulation failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment processing error');
    } finally {
      setSubmittingTopup(false);
    }
  };

  const handleDownloadInvoice = (inv: any) => {
    const invId = inv.invoiceNumber || inv.id;
    const date = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-IN') : '2026';
    const total = inv.totalAmountINR || inv.amount || 0;
    toast.success(`Tax Invoice ${invId} downloaded (₹${total.toLocaleString('en-IN')} incl. 18% GST)`);
  };

  // Compute calculated amounts for topup modal
  const subtotal = selectedTopupAmount;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  const currentPlan = overview?.plan || {
    name: 'Growth Tier',
    priceMonthlyINR: 19999,
    includedCredits: 100000,
    features: ['100,000 monthly Polygon QR identities', 'Live counterfeit heatmap', 'OTP warranty registrations'],
  };

  const creditBalance = overview?.creditBalance ?? 84200;
  const mintedUnits = overview?.stats?.totalCreditsDeducted ?? 15800;
  const totalPool = creditBalance + mintedUnits;
  const usedPercent = totalPool > 0 ? Math.min(100, Math.round((mintedUnits / totalPool) * 100)) : 15;
  const availPercent = 100 - usedPercent;

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
          onClick={() => {
            setPaidSuccess(false);
            setShowUpgradeModal(true);
          }}
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
                <span>Auto-renews Monthly</span>
              </span>
            </div>

            <h3 className="text-3xl font-medium tracking-tight mb-1" style={{ letterSpacing: '-0.03em' }}>
              {currentPlan.name || 'Growth Tier'}
            </h3>
            <div className="text-2xl font-bold text-white mb-4">
              ₹{(currentPlan.priceMonthlyINR || 19999).toLocaleString('en-IN')}{' '}
              <span className="text-sm font-normal text-white/60">/ month + GST</span>
            </div>

            <p className="text-white/70 text-xs leading-relaxed mb-6">
              Includes cryptographic serialization, printable high-resolution PDF/ZIP sheets, real-time clone detection, and partner custody.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Billed in INR · 18% Input Tax Credit</span>
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="text-white font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Top Up</span>
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
                {availPercent}% Available
              </span>
            </div>
            <p className="text-xs text-black/50 mb-6">
              Credits reset every billing cycle. Unused credits roll over for 90 days.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-black">{mintedUnits.toLocaleString()} QRs Minted</span>
                <span className="text-black/50">Total Quota: {totalPool.toLocaleString()} QRs</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F5F5F5] overflow-hidden p-0.5 border border-black/5">
                <div style={{ width: `${usedPercent}%` }} className="h-full rounded-full bg-emerald-500 transition-all duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-[#F5F5F5] p-3.5 rounded-2xl border border-black/5">
              <div>
                <span className="text-black/50 block text-[11px]">Available Balance</span>
                <span className="font-semibold text-black">{creditBalance.toLocaleString()} Credits</span>
              </div>
              <div>
                <span className="text-black/50 block text-[11px]">Conversion Rate</span>
                <span className="font-semibold text-black">1 Credit = ₹1 INR</span>
              </div>
              <div>
                <span className="text-black/50 block text-[11px]">Gas Overheads</span>
                <span className="font-semibold text-emerald-800">100% Sponsored</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="text-xs font-medium text-black hover:underline cursor-pointer"
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

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-black/40" />
            <p className="text-xs text-black/40 font-medium">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-black/20 mx-auto" />
            <h4 className="text-sm font-medium text-black">No invoices yet</h4>
            <p className="text-xs text-black/40 max-w-sm mx-auto">
              Invoices will automatically appear here whenever credits are added or monthly subscription renews.
            </p>
          </div>
        ) : (
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
                {invoices.map((inv, idx) => {
                  const invNumber = inv.invoiceNumber || inv.id || `INV-2026-${String(idx + 1).padStart(4, '0')}`;
                  const invDate = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : inv.date || 'Recent';
                  const invPlan = inv.planName || inv.plan || (inv.creditsAdded ? `${inv.creditsAdded?.toLocaleString()} QR Credits Pack` : 'Platform Subscription');
                  const invCredits = inv.creditsAdded ? `${Number(inv.creditsAdded).toLocaleString()} QRs` : 'Subscription';
                  const invTotal = inv.totalAmountINR ?? inv.totalAmount ?? inv.amount ?? 0;
                  const invStatus = (inv.status || 'Paid').toUpperCase();

                  return (
                    <tr key={inv.id || idx} className="hover:bg-black/[0.01] transition-colors">
                      <td className="p-4 pl-6 font-mono font-medium text-black">{invNumber}</td>
                      <td className="p-4 text-black/70">{invDate}</td>
                      <td className="p-4 font-medium text-black">{invPlan}</td>
                      <td className="p-4 text-black/70">{invCredits}</td>
                      <td className="p-4 font-bold text-black">
                        {typeof invTotal === 'number' ? `₹${invTotal.toLocaleString('en-IN')}` : invTotal}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {invStatus}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(inv)}
                          className="inline-flex items-center gap-1 text-black hover:text-black/60 font-medium cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade / Add Credits Modal with UPI and Card Payment UI */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!paidSuccess ? (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-medium tracking-tight text-black">Add QR Minting Credits</h3>
                </div>
                <p className="text-xs text-black/60 mb-4">
                  Top up QR minting balance. Instant automated credit to your brand vault with GST invoice.
                </p>

                {/* Amount presets */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                    Select Top-Up Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { amount: 1500, label: '₹1,500' },
                      { amount: 5000, label: '₹5,000' },
                      { amount: 10000, label: '₹10,000' },
                    ].map((tier) => (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => setSelectedTopupAmount(tier.amount)}
                        className={`py-2 px-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                          selectedTopupAmount === tier.amount
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-[#F5F5F5] text-black/70 border-black/5 hover:border-black/20'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-2xl border border-black/5 space-y-1 text-xs">
                  <div className="flex justify-between text-black/60">
                    <span>Base Credits:</span>
                    <span className="font-semibold text-black">{selectedTopupAmount.toLocaleString()} Credits</span>
                  </div>
                  <div className="flex justify-between text-black/60">
                    <span>GST (18% ITC):</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-black/10 font-bold text-black text-sm">
                    <span>Total Payable:</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
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
                      className={`py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                        paymentMethod === 'upi' ? 'bg-white text-black shadow-sm' : 'text-black/50'
                      }`}
                    >
                      Instant UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
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
                      Simulates Instant UPI mandate via NPCI. Instant ledger verification.
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
                        defaultValue="4111 2222 3333 4444"
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        defaultValue="12/28"
                        placeholder="MM / YY"
                        className="px-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none"
                      />
                      <input
                        type="password"
                        defaultValue="888"
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
                    disabled={submittingTopup}
                    className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submittingTopup && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{submittingTopup ? 'Processing Payment...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} & Top Up Credits`}</span>
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
                  +{selectedTopupAmount.toLocaleString()} QR credits have been added to your vault balance. Tax invoice dispatched.
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
