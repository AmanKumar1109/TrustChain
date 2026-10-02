import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Wallet,
  Server,
  Zap,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RotateCw,
  Plus,
} from 'lucide-react';
import { SystemServiceStatus, NetworkTransaction } from '../types';

export const SystemHealthScreen: React.FC = () => {
  // Gas sponsorship balance in plain INR
  const [networkCreditsBalance, setNetworkCreditsBalance] = useState<number>(142850);
  const lowBalanceThreshold = 25000;

  const [services] = useState<SystemServiceStatus[]>([
    {
      name: 'Polygon PoS Gas Relayer (Biconomy Meta-Tx)',
      type: 'Blockchain Sponsorship Pool',
      status: 'Operational',
      latency: '34ms',
      uptime: '99.98%',
    },
    {
      name: 'Anti-Clone Fraud Detection Engine',
      type: 'Real-time Geo/Time Analysis',
      status: 'Operational',
      latency: '18ms',
      uptime: '99.99%',
    },
    {
      name: 'Decentralized IPFS Pinning Cluster',
      type: 'Metadata & Product Proofs',
      status: 'Operational',
      latency: '62ms',
      uptime: '99.95%',
    },
    {
      name: 'SMS OTP & Carrier Delivery Gateway',
      type: 'Twilio / Gupshup SMS',
      status: 'Operational',
      latency: '110ms',
      uptime: '99.91%',
    },
    {
      name: 'MongoDB Enterprise Sharded Cluster',
      type: 'Inventory & Query Cache',
      status: 'Operational',
      latency: '8ms',
      uptime: '100%',
    },
  ]);

  const [transactions, setTransactions] = useState<NetworkTransaction[]>([
    {
      hash: '0x8f3c...991a',
      type: 'Batch Identity Mint (100k Units)',
      brandOrUser: 'Cipla Healthcare Ltd',
      timestamp: 'Just now',
      gasCostInr: '₹14.20',
      status: 'Pending',
    },
    {
      hash: '0x3a1b...882c',
      type: 'Ownership Custody Transfer',
      brandOrUser: 'Distributor → Apollo Pharmacy',
      timestamp: '3m ago',
      gasCostInr: '₹0.85',
      status: 'Pending',
    },
    {
      hash: '0x7e29...1104',
      type: 'Consumer Warranty Activation',
      brandOrUser: 'Consumer (+91 98765...)',
      timestamp: '14m ago',
      gasCostInr: '₹0.92',
      status: 'Failed',
      failureReason: 'Polygon RPC Mempool Timeout under brief spike',
    },
    {
      hash: '0x1c94...5531',
      type: 'Scratch Code Hash Anchor',
      brandOrUser: 'Sony Electronics India',
      timestamp: '22m ago',
      gasCostInr: '₹4.50',
      status: 'Failed',
      failureReason: 'Gas Price cap exceeded max priority fee',
    },
    {
      hash: '0x992b...4412',
      type: 'Counterfeit Flag Quarantine',
      brandOrUser: 'Admin Bot (System Automated)',
      timestamp: '45m ago',
      gasCostInr: '₹1.10',
      status: 'Success',
    },
  ]);

  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  const handleRetryTransaction = (hash: string) => {
    setIsRetrying(hash);
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.hash === hash
            ? { ...tx, status: 'Success', failureReason: undefined }
            : tx
        )
      );
      setIsRetrying(null);
    }, 1200);
  };

  const handleTopupCredits = () => {
    setNetworkCreditsBalance((prev) => prev + 50000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Infrastructure & Network Health</h2>
          <p className="text-xs text-black/50 mt-1">
            Zero-gas sponsorship relayers, live blockchain transaction queue, and service uptime monitor
          </p>
        </div>

        <button
          type="button"
          onClick={handleTopupCredits}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Top Up Network Credits</span>
        </button>
      </div>

      {/* Gas-Sponsorship Wallet Balance Banner */}
      <div className="bg-[#1E1A30] text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                Zero-Crypto Gas Sponsorship Pool (Polygon Relayer)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight font-mono">
                  ₹{networkCreditsBalance.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Network Credits Available</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-white/60 block">Sponsorship Rate</span>
              <span className="font-semibold text-white">~₹0.42 per scan</span>
            </div>
            <button
              type="button"
              onClick={handleTopupCredits}
              className="px-4 py-2 bg-white text-[#1E1A30] text-xs font-bold rounded-full hover:bg-white/90 transition-colors shadow-sm cursor-pointer"
            >
              Add ₹50,000 Pool
            </button>
          </div>
        </div>

        {/* Low balance condition alert */}
        {networkCreditsBalance < lowBalanceThreshold ? (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Low Balance Warning: Less than ₹{lowBalanceThreshold.toLocaleString()} remaining in gas relayer. Transactions may be throttled.
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
            <span>Pool funds ~340,000 more consumer verifications & manufacturer mints.</span>
            <span className="text-emerald-400 font-medium">Automatic Refill Configured via Razorpay Auto-Debit</span>
          </div>
        )}
      </div>

      {/* Service Status List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div>
            <h3 className="text-base font-semibold text-black">Microservices & Infrastructure Telemetry</h3>
            <p className="text-xs text-black/50">Decentralized protocols & high-availability cluster status</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            All Systems Normal
          </span>
        </div>

        <div className="divide-y divide-black/5">
          {services.map((service, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-black">{service.name}</h4>
                  <span className="text-[11px] text-black/40">{service.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <span className="text-black/40 text-[10px] block">Latency</span>
                  <span className="font-semibold text-black">{service.latency}</span>
                </div>
                <div>
                  <span className="text-black/40 text-[10px] block">Uptime</span>
                  <span className="font-semibold text-emerald-600">{service.uptime}</span>
                </div>
                <div>
                  <span className="text-black/40 text-[10px] block">Health</span>
                  <span className="font-semibold text-emerald-700">{service.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Queue: Pending & Failed with Retry */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div>
            <h3 className="text-base font-semibold text-black">Transaction Relay Queue</h3>
            <p className="text-xs text-black/50">Real-time mempool transactions sponsored on behalf of brands & consumers</p>
          </div>
          <span className="text-xs font-semibold text-black/60">
            {transactions.filter((t) => t.status === 'Pending').length} Pending • {transactions.filter((t) => t.status === 'Failed').length} Failed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F5] text-black/50 uppercase font-semibold text-[10px] tracking-wider border-b border-black/5">
              <tr>
                <th className="py-3 px-4">Tx Hash</th>
                <th className="py-3 px-4">Operation Type</th>
                <th className="py-3 px-4">Initiator / Entity</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Gas Cost (INR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {transactions.map((tx) => {
                const isPending = tx.status === 'Pending';
                const isFailed = tx.status === 'Failed';
                return (
                  <tr key={tx.hash} className="hover:bg-black/[0.01]">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">
                      {tx.hash}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-black">
                      {tx.type}
                    </td>

                    <td className="py-3.5 px-4 text-black/60">
                      {tx.brandOrUser}
                    </td>

                    <td className="py-3.5 px-4 text-black/40">{tx.timestamp}</td>

                    <td className="py-3.5 px-4 font-mono font-medium text-black">
                      {tx.gasCostInr}
                    </td>

                    <td className="py-3.5 px-4">
                      {isPending ? (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" /> Pending
                        </span>
                      ) : isFailed ? (
                        <div>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                            Failed
                          </span>
                          {tx.failureReason && (
                            <span className="text-[10px] text-rose-600 block mt-0.5 max-w-[200px] truncate" title={tx.failureReason}>
                              {tx.failureReason}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isFailed ? (
                        <button
                          type="button"
                          onClick={() => handleRetryTransaction(tx.hash)}
                          disabled={isRetrying === tx.hash}
                          className="px-3 py-1 bg-black text-white text-[11px] font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCw className={`w-3 h-3 ${isRetrying === tx.hash ? 'animate-spin' : ''}`} />
                          <span>{isRetrying === tx.hash ? 'Retrying...' : 'Retry Tx'}</span>
                        </button>
                      ) : (
                        <span className="text-black/30 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthScreen;
