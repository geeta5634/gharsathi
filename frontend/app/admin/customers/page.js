"use client";

import { useState } from 'react';
import { useAdminCustomers } from '@/lib/hooks';
import { TableSkeleton } from '@/components/Skeletons';
import { FaSearch } from 'react-icons/fa';

export default function AdminCustomers() {
  const { data: customers = [], isLoading } = useAdminCustomers();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="page-header">Manage Customers</h1>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search customers..." />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
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
