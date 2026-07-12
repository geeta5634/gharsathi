"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FaSpinner, FaSearch } from 'react-icons/fa';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/customers')
      .then(res => setCustomers(res.data.customers || res.data || []))
      .catch(() => {
        setCustomers([
          { _id: 'c1', name: 'Ravi Singh', phone: '+91 9876543210', email: 'ravi@email.com', totalBookings: 12, totalSpent: 2400, createdAt: '2023-06-15' },
          { _id: 'c2', name: 'Neha Gupta', phone: '+91 9123456780', email: 'neha@email.com', totalBookings: 8, totalSpent: 1600, createdAt: '2023-08-20' },
          { _id: 'c3', name: 'Arun Mehta', phone: '+91 9988776655', email: '', totalBookings: 23, totalSpent: 5200, createdAt: '2023-03-10' },
          { _id: 'c4', name: 'Sunita Devi', phone: '+91 9112233445', email: 'sunita@email.com', totalBookings: 5, totalSpent: 890, createdAt: '2023-11-01' },
          { _id: 'c5', name: 'Prakash Joshi', phone: '+91 9554433221', email: 'prakash@email.com', totalBookings: 15, totalSpent: 3800, createdAt: '2023-05-25' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="page-header">Manage Customers</h1>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search customers..." />
      </div>

      {loading ? (
        <div className="text-center py-12"><FaSpinner className="animate-spin text-2xl mx-auto text-gray-400" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Bookings</th>
                <th className="px-4 py-3 text-left">Total Spent</th>
                <th className="px-4 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email || '-'}</td>
                  <td className="px-4 py-3">{c.totalBookings || 0}</td>
                  <td className="px-4 py-3 font-bold text-green-600">₹{c.totalSpent || 0}</td>
                  <td className="px-4 py-3 text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
