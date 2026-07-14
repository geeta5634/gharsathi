"use client";

import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import { useAdminStats, useAdminBookings, useAdminPendingWorkers, useApproveRejectWorker } from '@/lib/hooks';
import { StatsCardSkeleton, TableSkeleton, DashboardSkeleton } from '@/components/Skeletons';
import { FaUserTie, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentBookings = [], isLoading: bookingsLoading } = useAdminBookings();
  const { data: pendingWorkers = [], isLoading: workersLoading } = useAdminPendingWorkers();
  const approveReject = useApproveRejectWorker();

  const statsLoadingArr = statsLoading || bookingsLoading;

  return (
    <div>
      <h1 className="page-header">Admin Dashboard</h1>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={FaUserTie} label="Total Workers" value={(stats?.workers || stats?.totalWorkers || 0).toLocaleString()} trend="+12% this month" trendUp />
          <StatsCard icon={FaUsers} label="Total Customers" value={(stats?.customers || stats?.totalCustomers || 0).toLocaleString()} trend="+8% this month" trendUp />
          <StatsCard icon={FaCalendarCheck} label="Total Bookings" value={(stats?.bookings || stats?.totalBookings || 0).toLocaleString()} trend="+15% this month" trendUp />
          <StatsCard icon={FaMoneyBillWave} label="Total Revenue" value={`₹${(stats?.revenue || stats?.totalRevenue || 0).toLocaleString()}`} trend="+20% this month" trendUp />
        </div>
      )}

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
          {bookingsLoading ? (
            <div className="py-4"><TableSkeleton rows={3} cols={5} /></div>
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

      {workersLoading ? (
        <div className="card"><TableSkeleton rows={2} cols={3} /></div>
      ) : pendingWorkers.length > 0 && (
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
                  <button onClick={() => approveReject.mutate({ id: w._id, action: 'approve' })} disabled={approveReject.isPending} className="btn-success text-sm flex items-center gap-1">
                    <FaCheckCircle /> Approve
                  </button>
                  <button onClick={() => approveReject.mutate({ id: w._id, action: 'reject' })} disabled={approveReject.isPending} className="btn-danger text-sm flex items-center gap-1">
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
