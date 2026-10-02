import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { PartnerRole } from '../types';
import { api } from '../../../services/api';

interface ScoreHistoryItem {
  date: string;
  delta: string;
  reason: string;
  positive: boolean;
}

const DEFAULT_SCORE_HISTORY: ScoreHistoryItem[] = [
  {
    date: 'Today, 11:30 AM',
    delta: '+2.0%',
    reason: '100% verified POS checkouts without duplicate flags (24 consecutive sales)',
    positive: true,
  },
  {
    date: '28 Sep 2026',
    delta: '+1.5%',
    reason: 'Inbound shipment verified & signed within 2 hours of arrival',
    positive: true,
  },
  {
    date: '15 Sep 2026',
    delta: '-1.0%',
    reason: 'Carton seal discrepancy reported on Batch #BLR02',
    positive: false,
  },
];

export const ReputationScreen: React.FC<{ role: PartnerRole }> = ({ role }) => {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(98);
  const [tierBadge, setTierBadge] = useState('Tier 1 Authorized Node');
  const [summaryText, setSummaryText] = useState(
    'Exemplary track record. 0 counterfeit complaints, 100% accurate barcode custody handoffs, and fast shipment sign-offs.'
  );
  const [successRate, setSuccessRate] = useState('99.4% Success');
  const [transfersDetail, setTransfersDetail] = useState('+45 pts contribution (142 accepted handoffs)');
  const [counterfeitsText, setCounterfeitsText] = useState('0 Counterfeits');
  const [counterfeitsDetail, setCounterfeitsDetail] = useState('Zero customer or brand fraud complaints');
  const [responseTimeText] = useState('1.8 Hours Avg');
  const [responseTimeDetail] = useState('Top 5% speed in northern regional network');
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>(DEFAULT_SCORE_HISTORY);

  useEffect(() => {
    let isMounted = true;

    async function loadReputation() {
      setLoading(true);
      try {
        const session = api.auth.getSession();
        const partnerId = session?.partnerId || session?.id || 'me';

        const res = await api.partners.getReputation(partnerId);
        if (res.success && res.data) {
          const data = res.data;
          if (typeof data.score === 'number') {
            setScore(data.score);
          }

          if (data.tier || data.tierBadge) {
            const badge =
              data.tier === 'Elite Partner'
                ? 'Tier 1 Authorized Node'
                : data.tier === 'Good Standing'
                ? 'Tier 2 Verified Partner'
                : data.tier === 'Under Observation'
                ? 'Tier 3 Monitored Partner'
                : 'High Risk / Restricted';
            setTierBadge(badge);
          }

          if (data.breakdown) {
            const b = data.breakdown;
            if (b.transferSuccessRate) {
              setSuccessRate(`${b.transferSuccessRate} Success`);
            }
            if (b.acceptedTransfers !== undefined) {
              const bonus = b.transferBonus ? `${b.transferBonus} pts` : '+45 pts';
              setTransfersDetail(`${bonus} contribution (${b.acceptedTransfers} accepted handoffs)`);
            }
            if (b.validFakeReports !== undefined) {
              setCounterfeitsText(`${b.validFakeReports} Counterfeits`);
              setCounterfeitsDetail(
                b.validFakeReports === 0
                  ? 'Zero customer or brand fraud complaints'
                  : `${b.validFakeReports} validated fraud complaints recorded`
              );
            }
          }

          if (data.recentChanges && Array.isArray(data.recentChanges) && data.recentChanges.length > 0) {
            const history: ScoreHistoryItem[] = data.recentChanges.map((chg: any) => {
              const dateObj = new Date(chg.timestamp || Date.now());
              const formattedDate =
                dateObj.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }) +
                ', ' +
                dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

              const isPositive = (chg.delta ?? 0) >= 0;
              const deltaStr = isPositive ? `+${chg.delta}%` : `${chg.delta}%`;

              return {
                date: formattedDate,
                delta: deltaStr,
                reason: chg.description || chg.title || 'Score adjustment',
                positive: isPositive,
              };
            });
            setScoreHistory(history);
          }
        }
      } catch (err) {
        console.warn('Failed to load partner reputation, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReputation();

    return () => {
      isMounted = false;
    };
  }, [role]);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Partner Trust & Reputation Score
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Your reputation score determines brand credit terms, consignment priority, and consumer verification badges.
        </p>
      </div>

      {/* Trust Score Card */}
      <div className="bg-[#2B2644] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full mb-3 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{tierBadge}</span>
            {loading && <Loader2 className="w-3 h-3 animate-spin text-emerald-400/70 ml-1" />}
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="text-5xl md:text-6xl font-medium tracking-tight"
              style={{ letterSpacing: '-0.04em' }}
            >
              {score} / 100
            </span>
            <span className="text-emerald-400 font-semibold text-sm">+2.5% this month</span>
          </div>

          <p className="text-white/70 text-xs max-w-md leading-relaxed">
            {summaryText}
          </p>
        </div>

        <div className="w-24 h-24 rounded-full border-4 border-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
          <Star className="w-12 h-12 text-emerald-400 fill-emerald-400" />
        </div>
      </div>

      {/* Breakdown: What affects the score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
        <h3 className="text-base font-medium text-black pb-3 border-b border-black/5">
          Score Weighting & Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/60 font-medium">Successful Transfers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-black">{successRate}</div>
            <p className="text-[11px] text-black/50 mt-1">
              {transfersDetail}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/60 font-medium">Reports Against Store</span>
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-black">{counterfeitsText}</div>
            <p className="text-[11px] text-black/50 mt-1">
              {counterfeitsDetail}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/60 font-medium">Handoff Response Time</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-black">{responseTimeText}</div>
            <p className="text-[11px] text-black/50 mt-1">
              {responseTimeDetail}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Score Changes Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
        <h3 className="text-base font-medium text-black pb-3 border-b border-black/5 mb-4">
          Recent Score Adjustments
        </h3>

        <div className="space-y-3">
          {scoreHistory.length === 0 ? (
            <div className="p-6 text-center text-black/40 text-xs">
              No recent reputation score adjustments recorded.
            </div>
          ) : (
            scoreHistory.map((sh, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-semibold text-black block mb-0.5">{sh.reason}</span>
                  <span className="text-black/40 text-[11px]">{sh.date}</span>
                </div>
                <span
                  className={`font-mono font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    sh.positive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {sh.delta}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReputationScreen;
