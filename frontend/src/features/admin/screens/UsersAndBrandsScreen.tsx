import React, { useState } from 'react';
import {
  Users,
  Building2,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Ban,
  MoreVertical,
  Check,
  UserCheck,
  UserX,
} from 'lucide-react';
import { PlatformUserEntity } from '../types';

export const UsersAndBrandsScreen: React.FC = () => {
  const [entities, setEntities] = useState<PlatformUserEntity[]>([
    {
      id: 'ent-1',
      name: 'Cipla Healthcare India Ltd',
      identifier: '27AAACC1124L1Z2 (GST)',
      role: 'Manufacturer',
      joinedDate: '12 Jan 2026',
      totalActivityCount: 4200000,
      status: 'Active',
    },
    {
      id: 'ent-2',
      name: 'Dr. Reddy’s Laboratories',
      identifier: '36AAACD2291M1Z8 (GST)',
      role: 'Manufacturer',
      joinedDate: '01 Feb 2026',
      totalActivityCount: 2800000,
      status: 'Active',
    },
    {
      id: 'ent-3',
      name: 'Apex National Logistics Hub',
      identifier: '29AABCA9918F1ZV (GST)',
      role: 'Distributor',
      joinedDate: '18 Feb 2026',
      totalActivityCount: 14200,
      status: 'Active',
    },
    {
      id: 'ent-4',
      name: 'Apollo Pharmacy Koramangala',
      identifier: '+91 80 2553 9182',
      role: 'Retailer',
      joinedDate: '02 Mar 2026',
      totalActivityCount: 8940,
      status: 'Active',
    },
    {
      id: 'ent-5',
      name: 'Gaffar Mobile Accessories Corner',
      identifier: '07AAACG5521A1Z9 (GST)',
      role: 'Retailer',
      joinedDate: '15 Mar 2026',
      totalActivityCount: 42,
      status: 'Suspended',
    },
    {
      id: 'ent-6',
      name: 'Rahul Sharma',
      identifier: '+91 98765 43210',
      role: 'Consumer',
      joinedDate: '18 May 2026',
      totalActivityCount: 48,
      status: 'Active',
    },
    {
      id: 'ent-7',
      name: 'Aakash Patel',
      identifier: '+91 99201 88412',
      role: 'Consumer',
      joinedDate: '24 Jun 2026',
      totalActivityCount: 112,
      status: 'Active',
    },
    {
      id: 'ent-8',
      name: 'Bot Account #99182 (Duplicate Spammer)',
      identifier: '+91 90000 11111',
      role: 'Consumer',
      joinedDate: '10 Sep 2026',
      totalActivityCount: 1940,
      status: 'Suspended',
    },
  ]);

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEntities = entities.filter((item) => {
    const matchesRole = roleFilter === 'All' || item.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.identifier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setEntities((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Active' ? 'Suspended' : 'Active' }
          : item
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Users and Brands Directory</h2>
          <p className="text-xs text-black/50 mt-1">
            Governance ledger for brand manufacturers, supply partners, and consumer wallets
          </p>
        </div>

        {/* Role Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Manufacturer', 'Distributor', 'Retailer', 'Consumer'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                roleFilter === role
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.02]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, GSTIN, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Active', 'Suspended'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-[#1E1A30] text-white shadow-sm'
                  : 'bg-white text-black/60 border border-black/10 hover:bg-black/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Searchable Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F5] border-b border-black/5 text-black/50 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Entity / User Name</th>
                <th className="py-4 px-6">Identifier / GST</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6">Activity Volume</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Governance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredEntities.map((entity) => {
                const isActive = entity.status === 'Active';
                return (
                  <tr key={entity.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="py-4 px-6 font-semibold text-black">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            entity.role === 'Manufacturer'
                              ? 'bg-purple-100 text-purple-800'
                              : entity.role === 'Consumer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {entity.name.charAt(0)}
                        </div>
                        <span>{entity.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-[11px] text-black/60">
                      {entity.identifier}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/5 text-black border border-black/5">
                        {entity.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-black/50">{entity.joinedDate}</td>

                    <td className="py-4 px-6 font-mono font-medium text-black">
                      {entity.totalActivityCount.toLocaleString()} {entity.role === 'Manufacturer' ? 'units' : 'scans'}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {entity.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(entity.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer ${
                          isActive
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredEntities.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-black/40 text-xs">
                    No users or brands match the specified criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersAndBrandsScreen;
