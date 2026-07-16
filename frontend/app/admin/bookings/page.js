"use client";

import { useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { FaSearch } from 'react-icons/fa';

const sampleBookings = [
  { _id: 'b1', serviceType: 'Plumber', customer: { name: 'Ravi Singh' }, worker: { name: 'Rajesh K.' }, totalAmount: 299, createdAt: '2024-06-15', status: 'completed' },
  { _id: 'b2', serviceType: 'Electrician', customer: { name: 'Neha Gupta' }, worker: { name: 'Amit S.' }, totalAmount: 179, createdAt: '2024-06-14', status: 'pending' },
  { _id: 'b3', serviceType: 'House Cleaning', customer: { name: 'Arun M.' }, worker: null, totalAmount: 149, createdAt: '2024-06-13', status: 'active' },
  { _id: 'b4', serviceType: 'Carpenter', customer: { name: 'Priya S.' }, worker: { name: 'Suresh P.' }, totalAmount: 249, createdAt: '2024-06-12', status: 'completed' },
  { _id: 'b5', serviceType: 'Painting', customer: { name: 'Amit P.' }, worker: null, totalAmount: 399, createdAt: '2024-06-11', status: 'cancelled' },
];

const statusFilters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

export default function AdminBookings() {
  const [bookings] = useState(sampleBookings);
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

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Worker</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
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
    </div>
  );
}
