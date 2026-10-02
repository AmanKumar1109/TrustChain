import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MapPin,
  Store,
  Calendar,
  X,
  Plus,
  Coins,
} from 'lucide-react';
import { UserReport } from '../types';

interface MyReportsScreenProps {
  reports: UserReport[];
  onOpenReportForm: () => void;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({
  reports,
  onOpenReportForm,
}) => {
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status: UserReport['status']) => {
    switch (status) {
      case 'Valid':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Valid (+Bounty)
          </span>
        );
      case 'Under review':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'Invalid':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Dismissed
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-black tracking-tight">Counterfeit Reports</h2>
          <p className="text-xs text-black/50">Track crowdsourced alerts and investigation bounties</p>
        </div>
        <button
          type="button"
          onClick={onOpenReportForm}
          className="text-xs font-medium text-white bg-black hover:bg-black/90 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Report Fake
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Submitted', 'Under review', 'Valid', 'Invalid'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterStatus.toLowerCase() === status.toLowerCase()
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.03]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="p-4 bg-white rounded-3xl border border-black/5 shadow-sm hover:border-black/15 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/5">
              <span className="font-mono text-[11px] font-semibold text-black/60">
                {report.reportId}
              </span>
              {getStatusBadge(report.status)}
            </div>

            <div className="mt-3 flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-black">{report.productName}</h4>
                <div className="flex items-center gap-1.5 text-xs text-black/60 mt-1">
                  <Store className="w-3.5 h-3.5 text-black/40" />
                  <span>{report.shopName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-black/40 mt-0.5">
                  <MapPin className="w-3 h-3 text-black/30" />
                  <span>{report.location}</span>
                </div>
              </div>

              {report.bonusPointsEarned && (
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 block">
                    +{report.bonusPointsEarned} Pts
                  </span>
                  <span className="text-[10px] text-emerald-700/80">Bounty Awarded</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-black/5">
            <ShieldAlert className="w-8 h-8 text-black/30 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-black">No reports in this category</h4>
            <p className="text-xs text-black/50 mt-1">
              Help protect your community by flagging suspicious or counterfeit products.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F5F5F5] w-full max-w-md rounded-3xl border border-black/10 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                Report Dossier {selectedReport.reportId}
              </span>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              {getStatusBadge(selectedReport.status)}
              <span className="text-xs text-black/40">Filed {selectedReport.reportedDate}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 space-y-3">
              <div>
                <span className="text-[10px] font-semibold uppercase text-black/40">Product Flagged</span>
                <h3 className="text-base font-semibold text-black">{selectedReport.productName}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-black/5">
                <div>
                  <span className="text-black/40 block text-[10px] uppercase">Vendor / Store</span>
                  <span className="font-medium text-black">{selectedReport.shopName}</span>
                </div>
                <div>
                  <span className="text-black/40 block text-[10px] uppercase">Geo Location</span>
                  <span className="font-medium text-black">{selectedReport.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5">
                <span className="text-black/40 block text-[10px] uppercase mb-1">Your Observation</span>
                <p className="text-xs text-black/70 bg-black/[0.02] p-2.5 rounded-xl leading-relaxed">
                  "{selectedReport.comment}"
                </p>
              </div>
            </div>

            {selectedReport.status === 'Valid' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <Coins className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-emerald-950 block">Investigation Validated!</span>
                  <span className="text-emerald-800 text-[11px]">
                    Brand manufacturer confirmed batch anomaly. {selectedReport.bonusPointsEarned || 500} TrustPoints have been credited to your balance.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-2xl border border-black/5 text-xs text-black/60">
                Brand security team reviews reports within 24-48 hours. Valid claims earn up to 500 TrustPoints.
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="w-full py-3 bg-black text-white text-xs font-semibold rounded-full hover:bg-black/90 transition-colors shadow-sm"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReportsScreen;
