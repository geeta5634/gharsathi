"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';

const statusFilters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/bookings')
      .then(res => setBookings(res.data.bookings || res.data || []))
      .catch(() => {
        setBookings([
          { _id: 'ab1', serviceType: 'Plumber', status: 'completed', totalAmount: 299, customer: { name: 'Ravi Singh' }, worker: { name: 'Rajesh K.' }, createdAt: '2024-01-18', address: '123 MG Road' },
          { _id: 'ab2', serviceType: 'Electrician', status: 'pending', totalAmount: 179, customer: { name: 'Neha Gupta' }, worker: { name: 'Amit S.' }, createdAt: '2024-01-18', address: '45 Nehru Nagar' },
          { _id: 'ab3', serviceType: 'House Cleaning', status: 'active', totalAmount: 149, customer: { name: 'Arun M.' }, worker: null, createdAt: '2024-01-17', address: '78 Gandhi Street' },
          { _id: 'ab4', serviceType: 'Carpenter', status: 'cancelled', totalAmount: 249, customer: { name: 'Sunita D.' }, worker: { name: 'Vikram R.' }, createdAt: '2024-01-16', address: '90 Lake View' },
          { _id: 'ab5', serviceType: 'House Painter', status: 'completed', totalAmount: 599, customer: { name: 'Prakash J.' }, worker: { name: 'Suresh P.' }, createdAt: '2024-01-15', address: '23 Park Lane' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="text-center py-12"><FaSpinner className="animate-spin text-2xl mx-auto text-gray-400" /></div>
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
