"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import { FaUserTie, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const bookingsData = [
  { day: 'Mon', count: 12 }, { day: 'Tue', count: 19 }, { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 }, { day: 'Fri', count: 28 }, { day: 'Sat', count: 35 }, { day: 'Sun', count: 18 },
];

const revenueData = [
  { service: 'Plumbing', revenue: 12000 }, { service: 'Electrical', revenue: 9500 }, { service: 'Carpentry', revenue: 8200 },
  { service: 'Painting', revenue: 15000 }, { service: 'Cleaning', revenue: 7800 }, { service: 'Driver/Maid', revenue: 11000 },
];

const statusData = [
  { name: 'Completed', value: 450, color: '#22c55e' },
  { name: 'Active', value: 85, color: '#3b82f6' },
  { name: 'Pending', value: 45, color: '#eab308' },
  { name: 'Cancelled', value: 30, color: '#ef4444' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ workers: 0, customers: 0, bookings: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingWorker, setActingWorker] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes, workersRes] = await Promise.all([
          api.get('/admin/stats').catch(() => ({ data: {} })),
          api.get('/admin/bookings?limit=5').catch(() => ({ data: { bookings: [] } })),
          api.get('/admin/workers/pending').catch(() => ({ data: { workers: [] } })),
        ]);
        setStats({
          workers: statsRes.data.totalWorkers || 0,
          customers: statsRes.data.totalCustomers || 0,
          bookings: statsRes.data.totalBookings || 0,
          revenue: statsRes.data.totalRevenue || 0,
        });
        setRecentBookings(bookingsRes.data.bookings || bookingsRes.data || []);
        setPendingWorkers(workersRes.data.workers || workersRes.data || []);
      } catch {
        setStats({ workers: 523, customers: 10245, bookings: 24680, revenue: 1875000 });
        setRecentBookings([
          { _id: 'ab1', serviceType: 'Plumber', status: 'completed', totalAmount: 299, customer: { name: 'Ravi Singh' }, worker: { name: 'Rajesh K.' }, createdAt: '2024-01-18' },
          { _id: 'ab2', serviceType: 'Electrician', status: 'pending', totalAmount: 179, customer: { name: 'Neha Gupta' }, worker: { name: 'Amit S.' }, createdAt: '2024-01-18' },
          { _id: 'ab3', serviceType: 'House Cleaning', status: 'active', totalAmount: 149, customer: { name: 'Arun M.' }, worker: { name: 'Priya D.' }, createdAt: '2024-01-17' },
        ]);
        setPendingWorkers([
          { _id: 'pw1', name: 'Mohit Verma', phone: '+91 9876543211', services: ['Plumber'], experience: 3 },
          { _id: 'pw2', name: 'Deepak Yadav', phone: '+91 9123456781', services: ['Electrician'], experience: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWorkerAction = async (id, action) => {
    setActingWorker(id);
    try {
      await api.put(`/admin/workers/${id}/${action}`);
      setPendingWorkers(prev => prev.filter(w => w._id !== id));
    } catch {
      setPendingWorkers(prev => prev.filter(w => w._id !== id));
    } finally {
      setActingWorker(null);
    }
  };

  return (
    <div>
      <h1 className="page-header">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={FaUserTie} label="Total Workers" value={stats.workers.toLocaleString()} trend="+12% this month" trendUp />
        <StatsCard icon={FaUsers} label="Total Customers" value={stats.customers.toLocaleString()} trend="+8% this month" trendUp />
        <StatsCard icon={FaCalendarCheck} label="Total Bookings" value={stats.bookings.toLocaleString()} trend="+15% this month" trendUp />
        <StatsCard icon={FaMoneyBillWave} label="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} trend="+20% this month" trendUp />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Bookings This Week</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Revenue by Service</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="service" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Bookings by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h2>
          {loading ? (
            <div className="text-center py-8"><FaSpinner className="animate-spin text-xl mx-auto text-gray-400" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="px-3 py-2 text-left">Service</th>
                    <th className="px-3 py-2 text-left">Customer</th>
                    <th className="px-3 py-2 text-left">Worker</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b._id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{b.serviceType}</td>
                      <td className="px-3 py-2 text-gray-600">{b.customer?.name || 'N/A'}</td>
                      <td className="px-3 py-2 text-gray-600">{b.worker?.name || 'N/A'}</td>
                      <td className="px-3 py-2 font-bold">₹{b.totalAmount}</td>
                      <td className="px-3 py-2"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {pendingWorkers.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Workers Pending Approval</h2>
          <div className="space-y-3">
            {pendingWorkers.map(w => (
              <div key={w._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-800">{w.name}</p>
                  <p className="text-sm text-gray-500">📱 {w.phone} | 🛠 {w.services?.join(', ')} | {w.experience}yr exp</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleWorkerAction(w._id, 'approve')} disabled={actingWorker === w._id} className="btn-success text-sm flex items-center gap-1">
                    <FaCheckCircle /> Approve
                  </button>
                  <button onClick={() => handleWorkerAction(w._id, 'reject')} disabled={actingWorker === w._id} className="btn-danger text-sm flex items-center gap-1">
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
