"use client";

import StatsCard from '@/components/StatsCard';
import { useWorkerEarnings } from '@/lib/hooks';
import { StatsCardSkeleton, TableSkeleton } from '@/components/Skeletons';
import { FaMoneyBillWave, FaCalendar, FaCreditCard } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fallbackMonthlyData = [
  { month: 'Jan', earnings: 4500 }, { month: 'Feb', earnings: 5200 }, { month: 'Mar', earnings: 6800 },
  { month: 'Apr', earnings: 4900 }, { month: 'May', earnings: 7200 }, { month: 'Jun', earnings: 8100 },
];

export default function WorkerEarnings() {
  const { data: stats, isLoading: statsLoading } = useWorkerEarnings();

  return (
    <div>
      <h1 className="page-header">Earnings</h1>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatsCard icon={FaMoneyBillWave} label="Total Earnings" value={`₹${(stats?.total || 0).toLocaleString()}`} />
          <StatsCard icon={FaCalendar} label="This Month" value={`₹${(stats?.thisMonth || 0).toLocaleString()}`} />
          <StatsCard icon={FaCreditCard} label="Last Payout" value={`₹${(stats?.lastPayout || 0).toLocaleString()}`} />
        </div>
      )}

      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Earnings</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fallbackMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Payment History</h2>
        <TableSkeleton rows={4} cols={4} />
      </div>
    </div>
  );
}
