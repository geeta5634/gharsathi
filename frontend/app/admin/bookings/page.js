"use client";

import { useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { useAdminBookings } from '@/lib/hooks';
import { TableSkeleton } from '@/components/Skeletons';
import { FaSearch } from 'react-icons/fa';

const statusFilters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

export default function AdminBookings() {
  const { data: bookings = [], isLoading } = useAdminBookings();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === 'All' || b.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = !search || b.serviceType?.toLowerCase().includes(search.toLowerCase()) || b.customer?.name?.toLowerCase().includes(search.toLowerCase()) || b.worker?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <h1 className="page-header">All Bookings</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search bookings..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Worker</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{b._id?.slice(-6)}</td>
                  <td className="px-4 py-3 font-medium">{b.serviceType}</td>
                  <td className="px-4 py-3 text-gray-600">{b.customer?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{b.worker?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3 font-bold">₹{b.totalAmount}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
