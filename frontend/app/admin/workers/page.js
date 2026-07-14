"use client";

import { useState } from 'react';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import { useAdminAllWorkers, useApproveRejectWorker } from '@/lib/hooks';
import { TableSkeleton } from '@/components/Skeletons';
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const statusColors = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

export default function AdminWorkers() {
  const { data: workers = [], isLoading } = useAdminAllWorkers();
  const [search, setSearch] = useState('');
  const approveReject = useApproveRejectWorker();

  const filtered = workers.filter(w => !search || w.name?.toLowerCase().includes(search.toLowerCase()) || w.services?.some(s => (typeof s === 'string' ? s : s.name)?.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <h1 className="page-header">Manage Workers</h1>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search workers..." />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Services</th>
                <th className="px-4 py-3 text-left">Trust Score</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Experience</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{w.name}</td>
                  <td className="px-4 py-3 text-gray-600">{w.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{w.services?.map(s => typeof s === 'string' ? s : s.name).join(', ')}</td>
                  <td className="px-4 py-3"><TrustScoreBadge score={w.trustScore || 0} /></td>
                  <td className="px-4 py-3">{w.rating?.toFixed(1)} ⭐</td>
                  <td className="px-4 py-3">{w.experience}yr</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[w.status] || 'bg-gray-100 text-gray-600'}`}>{w.status}</span></td>
                  <td className="px-4 py-3">
                    {w.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => approveReject.mutate({ id: w._id, action: 'approve' })} disabled={approveReject.isPending} className="text-green-600 hover:text-green-700 p-1"><FaCheckCircle /></button>
                        <button onClick={() => approveReject.mutate({ id: w._id, action: 'reject' })} disabled={approveReject.isPending} className="text-red-500 hover:text-red-600 p-1"><FaTimesCircle /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
