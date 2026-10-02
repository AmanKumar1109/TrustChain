import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Filter,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Flame,
  Search,
  ExternalLink,
  Info,
} from 'lucide-react';
import { HotspotReport } from '../types';
import { api } from '../../../services/api';

export const HotspotMapScreen: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('Last 30 Days');
  const [activeReport, setActiveReport] = useState<HotspotReport | null>(null);

  const hotspots: HotspotReport[] = [
    {
      id: 'hot-1',
      city: 'Delhi NCR',
      state: 'Delhi',
      area: 'Bhagirath Palace & Chandni Chowk Wholesale Hub',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      batchNumber: 'BATCH-2026-DEL99',
      reportCount: 18,
      threatLevel: 'critical',
      coordinates: { x: 44, y: 32 },
      lastReported: '14 mins ago',
      suspectedCause: 'Photocopied packaging cartons circulating without holograms.',
    },
    {
      id: 'hot-2',
      city: 'Bengaluru',
      state: 'Karnataka',
      area: 'SP Road & Majestic Market Zone',
      productName: 'boAt Rockerz 450 Pro',
      batchNumber: 'BT-8820-AUDIO',
      reportCount: 14,
      threatLevel: 'critical',
      coordinates: { x: 43, y: 74 },
      lastReported: '1 hour ago',
      suspectedCause: 'Single master QR code replicated on 14 units.',
    },
    {
      id: 'hot-3',
      city: 'Mumbai',
      state: 'Maharashtra',
      area: 'Princess Street & Crawford Market',
      productName: 'Cipla Montair-LC Tablets',
      batchNumber: 'BATCH-2026-MUM14',
      reportCount: 9,
      threatLevel: 'high',
      coordinates: { x: 33, y: 56 },
      lastReported: '4 hours ago',
      suspectedCause: 'Adulterated blister foil printing identified by consumer scan.',
    },
    {
      id: 'hot-4',
      city: 'Jaipur',
      state: 'Rajasthan',
      area: 'Indra Bazar & Tripolia Wholesale',
      productName: 'Cipla Foracort 400',
      batchNumber: 'BATCH-2026-BLR02',
      reportCount: 6,
      threatLevel: 'medium',
      coordinates: { x: 38, y: 37 },
      lastReported: 'Yesterday',
      suspectedCause: 'Unregistered serial code scan from retail kiosk.',
    },
    {
      id: 'hot-5',
      city: 'Kolkata',
      state: 'West Bengal',
      area: 'Burrabazar Medicine District',
      productName: 'Cipla Asthalin Inhaler',
      batchNumber: 'BATCH-2026-DEL99',
      reportCount: 5,
      threatLevel: 'medium',
      coordinates: { x: 74, y: 46 },
      lastReported: '2 days ago',
      suspectedCause: 'Consumer reported altered expiry date overprint.',
    },
  ];

  const [liveTopAreas, setLiveTopAreas] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState<{ totalIncidents: number; highRiskCitiesCount: number; citiesMonitored: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchHotspots() {
      try {
        const query: any = {};
        if (selectedCity !== 'All') query.city = selectedCity;
        if (selectedProduct !== 'All') query.product = selectedProduct;
        const res = await api.reports.getHotspots(query);
        if (isMounted && res.success && res.data) {
          if (res.data.topAreas?.length > 0) {
            setLiveTopAreas(res.data.topAreas);
          }
          if (res.data.summary) {
            setSummaryStats(res.data.summary);
          }
        }
      } catch (err) {
        console.warn('Live hotspots fetch error, using mockup data:', err);
      }
    }
    fetchHotspots();
    return () => {
      isMounted = false;
    };
  }, [selectedCity, selectedProduct, selectedDateRange]);

  const filteredHotspots = hotspots.filter((h) => {
    const cityMatch = selectedCity === 'All' || h.city === selectedCity;
    const prodMatch = selectedProduct === 'All' || h.productName.includes(selectedProduct);
    return cityMatch && prodMatch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Counterfeit Hotspot Intelligence Map
          </h2>
          <p className="text-black/60 text-xs mt-0.5">
            Real-time crowdsourced reports feeding anti-counterfeit enforcement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-black/50">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#F5F5F5] border border-black/5 font-medium text-black text-xs focus:outline-none"
            >
              <option value="All">All Regions</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-black/50">Window:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#F5F5F5] border border-black/5 font-medium text-black text-xs focus:outline-none"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Layout: Interactive Map + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Side: Interactive Stylized Map View (8 cols) */}
        <div className="lg:col-span-8 bg-[#2B2644] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md">
          {/* Map Controls Overlay */}
          <div className="relative z-10 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Live Heatmap Layer Active
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Critical Risk (&gt;10)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Medium Risk</span>
              </span>
            </div>
          </div>

          {/* SVG Map Canvas with Heatmap Pins */}
          <div className="relative w-full h-[460px] my-auto flex items-center justify-center">
            {/* Ambient India Outline Silhouette SVG */}
            <svg
              viewBox="0 0 800 650"
              className="w-full h-full opacity-30 stroke-white/20 fill-white/5"
            >
              {/* Simplified India Landmass Path */}
              <path
                d="M 350 40 Q 380 90, 420 120 Q 480 140, 520 180 Q 560 220, 600 240 Q 640 260, 680 280 L 620 320 Q 580 340, 540 370 Q 500 420, 460 480 Q 430 540, 400 600 Q 380 550, 360 490 Q 320 430, 280 380 Q 240 330, 220 280 Q 240 230, 280 180 Q 310 120, 350 40 Z"
                strokeWidth="2"
              />
            </svg>

            {/* Glowing Hotspot Markers */}
            {filteredHotspots.map((spot) => {
              const isSelected = activeReport?.id === spot.id;
              const isCritical = spot.threatLevel === 'critical';

              return (
                <div
                  key={spot.id}
                  onClick={() => setActiveReport(spot)}
                  style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Outer pulse ring */}
                  <span
                    className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                      isCritical ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />

                  {/* Marker Pin */}
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                      isSelected
                        ? 'bg-white text-black ring-4 ring-rose-400'
                        : isCritical
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  >
                    {spot.reportCount}
                  </div>

                  {/* Label tooltip */}
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    {spot.city} · {spot.reportCount} Reports
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
            <span>Click any hotspot node to inspect suspicious batch reports</span>
            <span>Total Hotspots Active: {filteredHotspots.length}</span>
          </div>
        </div>

        {/* Right Side: Side Panel Listing Top Areas & Report Details (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <h3 className="text-base font-medium text-black">Top Counterfeit Clusters</h3>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                High Risk
              </span>
            </div>

            {/* List of Hotspots */}
            <div className="space-y-3 mb-6 max-h-[340px] overflow-y-auto pr-1">
              {filteredHotspots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => setActiveReport(spot)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    activeReport?.id === spot.id
                      ? 'border-black bg-black/[0.03]'
                      : 'border-black/5 bg-[#F5F5F5] hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-black text-xs">{spot.city}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        spot.threatLevel === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {spot.reportCount} Reports
                    </span>
                  </div>
                  <p className="text-[11px] text-black/60 line-clamp-1">{spot.area}</p>
                  <span className="text-[10px] font-mono text-black/40 mt-1 block">
                    {spot.batchNumber}
                  </span>
                </div>
              ))}
            </div>

            {/* Detailed Selected Report Card */}
            {activeReport ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-900">{activeReport.area}</span>
                  <span className="text-[10px] text-rose-700">{activeReport.lastReported}</span>
                </div>
                <div className="text-rose-950 leading-relaxed text-[11px]">
                  <strong>Suspected Modus Operandi:</strong> {activeReport.suspectedCause}
                </div>
                <div className="pt-2 flex justify-between items-center text-[10px] text-rose-800 border-t border-rose-200">
                  <span>Product: {activeReport.productName}</span>
                  <span className="font-mono">{activeReport.batchNumber}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#F5F5F5] rounded-2xl text-center text-xs text-black/50">
                Select a cluster on the map or list to inspect counterfeit intelligence details.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-black/5">
            <button
              type="button"
              onClick={() => alert('Exporting Legal Anti-Counterfeit Dossier (PDF)...')}
              className="w-full py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Export Police / Legal Enforcement Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotMapScreen;
