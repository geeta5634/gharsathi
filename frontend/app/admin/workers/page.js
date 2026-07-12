"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import { FaSpinner, FaSearch, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';

const statusColors = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    api.get('/admin/workers')
      .then(res => setWorkers(res.data.workers || res.data || []))
      .catch(() => {
        setWorkers([
          { _id: 'aw1', name: 'Rajesh Kumar', phone: '+91 9876543210', services: ['Plumber'], trustScore: 85, rating: 4.7, experience: 5, status: 'approved' },
          { _id: 'aw2', name: 'Amit Sharma', phone: '+91 9123456780', services: ['Electrician'], trustScore: 72, rating: 4.3, experience: 3, status: 'approved' },
          { _id: 'aw3', name: 'Deepak Yadav', phone: '+91 9988776655', services: ['Carpenter'], trustScore: 60, rating: 4.0, experience: 2, status: 'pending' },
          { _id: 'aw4', name: 'Priya Devi', phone: '+91 9112233445', services: ['House Cleaning'], trustScore: 91, rating: 4.9, experience: 8, status: 'approved' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    setActing(id);
    try {
      await api.put(`/admin/workers/${id}/${action}`);
      setWorkers(prev => prev.map(w => w._id === id ? { ...w, status: action === 'approve' ? 'approved' : 'rejected' } : w));
    } catch {
      setWorkers(prev => prev.map(w => w._id === id ? { ...w, status: action === 'approve' ? 'approved' : 'rejected' } : w));
    } finally {
      setActing(null);
    }
  };

  const filtered = workers.filter(w => !search || w.name?.toLowerCase().includes(search.toLowerCase()) || w.services?.some(s => (typeof s === 'string' ? s : s.name)?.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <h1 className="page-header">Manage Workers</h1>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search workers..." />
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
                        <button onClick={() => handleAction(w._id, 'approve')} disabled={acting === w._id} className="text-green-600 hover:text-green-700 p-1"><FaCheckCircle /></button>
                        <button onClick={() => handleAction(w._id, 'reject')} disabled={acting === w._id} className="text-red-500 hover:text-red-600 p-1"><FaTimesCircle /></button>
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
