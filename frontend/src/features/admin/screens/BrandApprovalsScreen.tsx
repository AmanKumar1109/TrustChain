import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  X,
  AlertCircle,
  Clock,
  Send,
} from 'lucide-react';
import { BrandApplication } from '../types';

export const BrandApprovalsScreen: React.FC = () => {
  const [applications, setApplications] = useState<BrandApplication[]>([
    {
      id: 'app-1',
      brandName: 'Cadila Healthcare Ltd (Zydus)',
      legalEntity: 'Zydus Lifesciences Limited',
      category: 'Pharmaceuticals',
      gstNumber: '24AAACZ1122K1Z9',
      cinNumber: 'L24230GJ1995PLC025878',
      contactPerson: 'Dr. Rajiv Mehta (VP Quality)',
      email: 'regulatory@zyduslife.com',
      phone: '+91 98250 11928',
      appliedDate: 'Today, 09:30 AM',
      status: 'Pending',
      documents: [
        { type: 'Certificate of Incorporation', filename: 'Zydus_ROC_Incorp_Cert.pdf', verified: true },
        { type: 'GST Registration Certificate (Form REG-06)', filename: 'GSTIN_24AAACZ1122K1Z9.pdf', verified: true },
        { type: 'Drug Manufacturing License (Form 25/28)', filename: 'Govt_FDA_License_GJ.pdf', verified: false },
        { type: 'Trademark Registry Certificate', filename: 'Zydus_Cadila_Trademark_TM01.pdf', verified: true },
      ],
      notes: 'Applying for Batch-level protection on cardiovascular medications.',
    },
    {
      id: 'app-2',
      brandName: 'Noise Audio & Wearables',
      legalEntity: 'Nexxbase Marketing Pvt Ltd',
      category: 'Consumer Electronics',
      gstNumber: '06AAACN4499M1ZF',
      cinNumber: 'U51909HR2014PTC053891',
      contactPerson: 'Gaurav Khatri (Director)',
      email: 'compliance@gonoise.com',
      phone: '+91 98110 44299',
      appliedDate: 'Yesterday, 04:15 PM',
      status: 'Pending',
      documents: [
        { type: 'Certificate of Incorporation', filename: 'Nexxbase_Incorp_Cert.pdf', verified: true },
        { type: 'GST Registration Certificate', filename: 'GST_Haryana_06AAACN.pdf', verified: true },
        { type: 'BIS Certification', filename: 'BIS_Smartwatch_Compliance.pdf', verified: true },
      ],
      notes: 'Wants unit-level scratch codes on upcoming smartwatches series.',
    },
    {
      id: 'app-3',
      brandName: 'Himalaya Wellness Company',
      legalEntity: 'The Himalaya Drug Company Ltd',
      category: 'Ayurvedic & Cosmetics',
      gstNumber: '29AAACH0091L1Z4',
      cinNumber: 'U24231KA1930PLC001420',
      contactPerson: 'Vipin Sharma (Supply Chain Head)',
      email: 'anti-counterfeit@himalayawellness.com',
      phone: '+91 98450 77123',
      appliedDate: '28 Sep 2026',
      status: 'Pending',
      documents: [
        { type: 'Certificate of Incorporation', filename: 'Himalaya_1930_Charter.pdf', verified: true },
        { type: 'GST Registration Certificate', filename: 'GST_Karnataka_REG06.pdf', verified: true },
        { type: 'AYUSH Manufacturing License', filename: 'AYUSH_Karnataka_Govt.pdf', verified: true },
      ],
      notes: 'Facing massive duplicate packaging issues in Purifying Neem Face Wash.',
    },
    {
      id: 'app-4',
      brandName: 'Glenmark Pharmaceuticals',
      legalEntity: 'Glenmark Lifesciences Ltd',
      category: 'Pharmaceuticals',
      gstNumber: '27AAACG9921B1Z2',
      cinNumber: 'L24299MH1977PLC019982',
      contactPerson: 'Anjali Deshmukh',
      email: 'quality@glenmark.com',
      phone: '+91 98200 88412',
      appliedDate: '24 Sep 2026',
      status: 'Approved',
      documents: [
        { type: 'Certificate of Incorporation', filename: 'Glenmark_ROC.pdf', verified: true },
        { type: 'GST Registration', filename: 'GSTIN_MH.pdf', verified: true },
      ],
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<BrandApplication | null>(applications[0]);
  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [requestInfoModal, setRequestInfoModal] = useState(false);
  const [requestComment, setRequestComment] = useState('');

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'All') return true;
    return app.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Approved' } : app))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: 'Approved' });
    }
  };

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Rejected' } : app))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: 'Rejected' });
    }
  };

  const handleRequestMoreInfo = () => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id
          ? { ...app, status: 'More Info Requested', notes: requestComment }
          : app
      )
    );
    setSelectedApp({
      ...selectedApp,
      status: 'More Info Requested',
      notes: requestComment,
    });
    setRequestInfoModal(false);
    setRequestComment('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Brand Onboarding Approvals</h2>
          <p className="text-xs text-black/50 mt-1">
            Validate manufacturer corporate identity, statutory licenses, and GSTIN before granting cryptographic minting access
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {['Pending', 'Approved', 'More Info Requested', 'All'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterStatus.toLowerCase() === status.toLowerCase()
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.02]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Layout: List on Left, Detail Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Applications List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredApps.map((app) => {
            const isSelected = selectedApp?.id === app.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#1E1A30] shadow-md ring-2 ring-[#1E1A30]/10'
                    : 'bg-white border-black/5 shadow-sm hover:border-black/20'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-black/5">
                  <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">
                    {app.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                      app.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : app.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : app.status === 'More Info Requested'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-semibold text-black">{app.brandName}</h3>
                  <span className="text-xs text-black/60 block">{app.legalEntity}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-black/50 font-mono">
                  <span>GST: {app.gstNumber}</span>
                  <span className="font-sans text-[11px] text-black/40">{app.appliedDate}</span>
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-black/5 text-xs text-black/50">
              No brand applications matching this filter.
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Selected Application Detail View */}
        {selectedApp ? (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Application #{selectedApp.id.toUpperCase()}
                  </span>
                  <span className="text-xs text-black/40">{selectedApp.appliedDate}</span>
                </div>
                <h3 className="text-2xl font-semibold text-black mt-2">{selectedApp.brandName}</h3>
                <span className="text-xs text-black/60 font-medium block mt-0.5">
                  Legal Entity: {selectedApp.legalEntity}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border self-start ${
                  selectedApp.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : selectedApp.status === 'Rejected'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : selectedApp.status === 'More Info Requested'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {selectedApp.status}
              </span>
            </div>

            {/* Statutory Corporate Details Card */}
            <div className="bg-[#F5F5F5] rounded-2xl p-5 border border-black/5 space-y-4 text-xs">
              <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider block">
                Statutory Identifiers (Verified via MCA & GSTN APIs)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-black/5">
                  <span className="text-black/40 block text-[10px] uppercase font-semibold">
                    GSTIN Number
                  </span>
                  <span className="font-mono text-xs font-bold text-black mt-0.5 block">
                    {selectedApp.gstNumber}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Active on GSTN
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-black/5">
                  <span className="text-black/40 block text-[10px] uppercase font-semibold">
                    Corporate Identity Number (CIN)
                  </span>
                  <span className="font-mono text-xs font-bold text-black mt-0.5 block">
                    {selectedApp.cinNumber}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Ministry of Corporate Affairs Valid
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-black/5">
                  <span className="text-black/40 block text-[10px] uppercase font-semibold">
                    Contact Person
                  </span>
                  <span className="font-semibold text-black mt-0.5 block">
                    {selectedApp.contactPerson}
                  </span>
                  <span className="text-black/50 text-[11px]">{selectedApp.phone}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-black/5">
                  <span className="text-black/40 block text-[10px] uppercase font-semibold">
                    Registered Domain / Email
                  </span>
                  <span className="font-semibold text-black mt-0.5 block truncate">
                    {selectedApp.email}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Domain Ownership Confirmed</span>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List with Preview Action */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-black uppercase tracking-wider block">
                Submitted Compliance Documents ({selectedApp.documents.length})
              </span>

              <div className="space-y-2">
                {selectedApp.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-black/10 rounded-2xl flex items-center justify-between hover:bg-black/[0.01] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-black">{doc.type}</h4>
                        <span className="text-[11px] text-black/40 font-mono block">{doc.filename}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc.filename)}
                      className="px-3 py-1.5 bg-[#F5F5F5] hover:bg-black/5 text-black text-xs font-medium rounded-full border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-black/60" />
                      <span>Preview Doc</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Actions Bar */}
            <div className="pt-4 border-t border-black/10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleApprove(selectedApp.id)}
                disabled={selectedApp.status === 'Approved'}
                className="flex-1 min-w-[140px] py-3.5 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Manufacturer</span>
              </button>

              <button
                type="button"
                onClick={() => setRequestInfoModal(true)}
                className="py-3.5 px-5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Request More Info</span>
              </button>

              <button
                type="button"
                onClick={() => handleReject(selectedApp.id)}
                disabled={selectedApp.status === 'Rejected'}
                className="py-3.5 px-5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-full hover:bg-rose-100 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center bg-white rounded-3xl border border-black/5 text-xs text-black/50">
            Select an application to inspect documentation and take approval action.
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-4 border border-black/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E1A30]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-black">
                  Statutory Document Inspector: {previewDoc}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document simulated preview container */}
            <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/10 space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-black/5 text-black/40 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-black">{previewDoc}</h4>
                <p className="text-xs text-black/50 mt-1 max-w-md mx-auto">
                  Digitally signed PDF document verified by Government of India DigiLocker / MCA portal. SHA-256 hash valid.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-black/5 font-mono text-[11px] text-black/70 max-w-md mx-auto break-all">
                Hash: 0x9a8f23c781190bcda42e9712f5a043d8912e61a8f94
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request More Info Modal */}
      {requestInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 border border-black/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-black">
                Request Clarification from {selectedApp?.brandName}
              </span>
              <button
                type="button"
                onClick={() => setRequestInfoModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-black block">
                Required Clarification or Missing Documents:
              </label>
              <textarea
                rows={4}
                value={requestComment}
                onChange={(e) => setRequestComment(e.target.value)}
                placeholder="e.g. Please provide updated Schedule M GMP compliance certificate for Goa manufacturing facility..."
                className="w-full p-3 bg-[#F5F5F5] border border-black/10 rounded-2xl text-xs text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRequestInfoModal(false)}
                className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestMoreInfo}
                disabled={!requestComment.trim()}
                className="flex-1 py-3 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Query</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandApprovalsScreen;
