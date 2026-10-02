import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  Store,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  Navigation,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { AdminFakeReport } from '../types';
import { api } from '../../../services/api';

export const FakeReportsScreen: React.FC = () => {
  const [reports, setReports] = useState<AdminFakeReport[]>([
    {
      id: 'rep-1',
      reportId: 'REP-9021',
      reporterPhone: '+91 98765 43210',
      reportedDate: 'Today, 11:15 AM',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      brandName: 'Cipla Ltd',
      batchNumber: 'BATCH-2026-DEL99',
      shopName: 'Metro Life Chemist',
      location: 'Chandni Chowk, Old Delhi, Delhi 110006',
      coordinates: { lat: 28.6506, lng: 77.2301 },
      photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      comment: 'QR code had blurred printing, cap seal was previously broken, font color looks lighter than original.',
      status: 'Submitted',
      bountyPoints: 500,
    },
    {
      id: 'rep-2',
      reportId: 'REP-9044',
      reporterPhone: '+91 98112 55431',
      reportedDate: 'Yesterday, 06:40 PM',
      productName: 'Sony WH-1000XM5 Headphones',
      brandName: 'Sony India',
      batchNumber: 'SNY-BATCH-9941',
      shopName: 'Gaffar Market Electronics Stall 42',
      location: 'Karol Bagh, New Delhi 110005',
      coordinates: { lat: 28.6517, lng: 77.1906 },
      photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      comment: 'Packaging barcode was a photocopied sticker. Device paired as generic bluetooth without Sony Headphones app recognition.',
      status: 'Under review',
      bountyPoints: 500,
    },
    {
      id: 'rep-3',
      reportId: 'REP-8982',
      reporterPhone: '+91 99001 22345',
      reportedDate: '26 Sep 2026',
      productName: 'Himalaya Neem Face Wash 200ml',
      brandName: 'The Himalaya Drug Company',
      batchNumber: 'HIM-NEEM-7721',
      shopName: 'National General Store',
      location: 'Bandra West, Mumbai 400050',
      coordinates: { lat: 19.0596, lng: 72.8295 },
      photoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      comment: 'Scratch code underneath sticker was invalid and had already been registered to another user 3 months ago.',
      status: 'Valid',
      bountyPoints: 500,
    },
    {
      id: 'rep-4',
      reportId: 'REP-8819',
      reporterPhone: '+91 97410 88291',
      reportedDate: '22 Sep 2026',
      productName: 'Paracetamol 650mg Blister Pack',
      brandName: 'Micro Labs Ltd',
      batchNumber: 'DOLO-650-KA8',
      shopName: 'Sri Sai Medicals',
      location: 'Malleswaram, Bengaluru 560003',
      coordinates: { lat: 13.0031, lng: 77.5643 },
      photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
      comment: 'Box was slightly crinkled from rain, but hologram was completely authentic upon lab re-testing.',
      status: 'Invalid',
      bountyPoints: 0,
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<AdminFakeReport | null>(reports[0]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      try {
        const query: any = {};
        if (statusFilter !== 'All') {
          query.status = statusFilter === 'Under review' ? 'UnderReview' : statusFilter;
        }
        const res = await api.reports.getAdminReports(query);
        if (isMounted && res.success && res.data?.reports?.length > 0) {
          const mapped: AdminFakeReport[] = res.data.reports.map((r: any) => ({
            id: r._id,
            reportId: r.reportId,
            reporterPhone: r.guestContact?.phone || r.user?.phone || 'Anonymous',
            reportedDate: new Date(r.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            productName: r.productName || r.product?.name || 'Counterfeit Item',
            brandName: r.brandName || 'Brand Compliance',
            batchNumber: r.batchNumber || r.code || 'N/A',
            shopName: r.shopName,
            location: r.geo?.address || `${r.shopName}, ${r.geo?.city}`,
            coordinates: { lat: r.geo?.latitude || 28.6139, lng: r.geo?.longitude || 77.2090 },
            photoUrl:
              r.photos && r.photos.length > 0
                ? r.photos[0].startsWith('http')
                  ? r.photos[0]
                  : `http://localhost:5000${r.photos[0]}`
                : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
            comment: r.comment,
            status: r.status === 'UnderReview' ? 'Under review' : r.status,
            bountyPoints: r.adminReview?.pointsAwarded || 500,
          }));
          setReports(mapped);
          setSelectedReport(mapped[0]);
        }
      } catch (e) {
        console.warn('API error, using fallback:', e);
      }
    }
    loadReports();
    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const filteredReports = reports.filter((r) => {
    const matchesFilter =
      statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      r.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkValid = async (id: string) => {
    try {
      await api.reports.reviewReport(id, 'Valid', 'Investigated and confirmed counterfeit by compliance.');
    } catch (e) {
      console.warn('API review failed, updating local state:', e);
    }
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Valid', bountyPoints: 500 } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: 'Valid', bountyPoints: 500 });
    }
  };

  const handleMarkInvalid = async (id: string) => {
    try {
      await api.reports.reviewReport(id, 'Invalid', 'Dismissed by compliance.');
    } catch (e) {
      console.warn('API review failed, updating local state:', e);
    }
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Invalid', bountyPoints: 0 } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: 'Invalid', bountyPoints: 0 });
    }
  };

  const getStatusBadge = (status: AdminFakeReport['status']) => {
    switch (status) {
      case 'Valid':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Valid (+500 Pts Paid)
          </span>
        );
      case 'Under review':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" /> Under Review
          </span>
        );
      case 'Invalid':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-gray-500" /> Dismissed
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Crowdsourced Fake Incident Reports</h2>
          <p className="text-xs text-black/50 mt-1">
            Investigate physical counter-checks, geo-tagged seller locations, and disburse community bounty rewards
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Submitted', 'Under review', 'Valid', 'Invalid'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter.toLowerCase() === status.toLowerCase()
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.02]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by report ID, brand, shop name, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm"
        />
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Reports Table/List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#1E1A30] shadow-md ring-2 ring-[#1E1A30]/10'
                    : 'bg-white border-black/5 shadow-sm hover:border-black/20'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-black/5">
                  <span className="font-mono text-xs font-semibold text-black/70">
                    {report.reportId}
                  </span>
                  {getStatusBadge(report.status)}
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-black">{report.productName}</h4>
                  <span className="text-xs text-black/50 block mt-0.5">{report.brandName}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-black/50">
                  <span className="truncate max-w-[180px]">{report.shopName}</span>
                  <span className="text-[11px] text-black/40">{report.reportedDate}</span>
                </div>
              </div>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-black/5 text-xs text-black/50">
              No reports match your filters.
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Selected Report Investigation Dossier */}
        {selectedReport ? (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-black bg-black/5 px-2.5 py-0.5 rounded-full">
                    {selectedReport.reportId}
                  </span>
                  <span className="text-xs text-black/40">Filed {selectedReport.reportedDate}</span>
                </div>
                <h3 className="text-xl font-semibold text-black mt-2">{selectedReport.productName}</h3>
                <span className="text-xs text-black/60 font-medium">Brand: {selectedReport.brandName}</span>
              </div>

              {getStatusBadge(selectedReport.status)}
            </div>

            {/* Linked Product & Batch Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs">
              <div>
                <span className="text-[10px] text-black/40 uppercase font-semibold block">Batch Number</span>
                <span className="font-mono font-bold text-black mt-0.5 block">{selectedReport.batchNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-black/40 uppercase font-semibold block">Reporter Phone</span>
                <span className="font-medium text-black mt-0.5 block">{selectedReport.reporterPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-black/40 uppercase font-semibold block">Bounty Value</span>
                <span className="font-bold text-emerald-600 mt-0.5 block">500 TrustPoints</span>
              </div>
            </div>

            {/* Photo Preview & Observation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-black uppercase tracking-wider block">
                  Physical Evidence Photo
                </span>
                <div className="rounded-2xl overflow-hidden border border-black/10 aspect-video sm:aspect-square relative bg-black/5">
                  <img
                    src={selectedReport.photoUrl}
                    alt={selectedReport.productName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                    High Resolution Upload
                  </span>
                </div>
              </div>

              {/* Observation & Comments */}
              <div className="space-y-2 flex flex-col">
                <span className="text-xs font-semibold text-black uppercase tracking-wider block">
                  User Observation & Notes
                </span>
                <div className="flex-1 bg-[#F5F5F5] p-4 rounded-2xl border border-black/5 text-xs leading-relaxed text-black/80">
                  "{selectedReport.comment}"
                </div>
              </div>
            </div>

            {/* Geo Location with Visual Map Mockup */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-black uppercase tracking-wider block">
                Auto-Detected Geolocation & Retailer Coordinates
              </span>

              <div className="p-4 bg-white border border-black/10 rounded-2xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-black">{selectedReport.shopName}</h5>
                    <p className="text-xs text-black/60">{selectedReport.location}</p>
                    <span className="text-[11px] font-mono text-black/40 block mt-0.5">
                      GPS: {selectedReport.coordinates.lat.toFixed(4)}° N, {selectedReport.coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>

                {/* Visual Map Canvas Mockup */}
                <div className="h-32 bg-slate-100 rounded-xl border border-black/10 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1E1A30_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-black bg-white/90 px-2 py-0.5 rounded-full shadow-sm mt-1 border border-black/10">
                      {selectedReport.shopName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Actions Bar */}
            <div className="pt-4 border-t border-black/10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleMarkValid(selectedReport.id)}
                disabled={selectedReport.status === 'Valid'}
                className="flex-1 py-3.5 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Valid & Disburse Bounty</span>
              </button>

              <button
                type="button"
                onClick={() => handleMarkInvalid(selectedReport.id)}
                disabled={selectedReport.status === 'Invalid'}
                className="flex-1 py-3.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-full hover:bg-rose-100 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Mark as Invalid / Dismiss</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center bg-white rounded-3xl border border-black/5 text-xs text-black/50">
            Select a report from the table to inspect evidence and disburse reward bounty.
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeReportsScreen;
