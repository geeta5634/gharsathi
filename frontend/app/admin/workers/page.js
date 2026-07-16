"use client";

import { useState, useEffect } from 'react';
import { FaUserTie, FaStar, FaShieldAlt, FaSpinner, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getAllUsers } from '@/lib/supabase/listings';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const users = await getAllUsers();
      setWorkers(users.filter(u => u.role === 'worker') || []);
    } catch (e) {
      console.error('Failed to load workers', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = workers.filter(w =>
    w.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.email?.toLowerCase().includes(search.toLowerCase()) ||
    w.phone?.includes(search)
  );

  return (
    <div>
      <h1 className="page-header">Workers</h1>

      <div className="relative max-w-md mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search workers..." />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-600" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No workers found.</p>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(w => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUserTie className="text-primary-600 text-sm" />
                      </div>
                      {w.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{w.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{w.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(w.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
