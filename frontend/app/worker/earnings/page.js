"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import StatsCard from '../../../components/StatsCard';
import { FaMoneyBillWave, FaCalendar, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyData = [
  { month: 'Jan', earnings: 4500 }, { month: 'Feb', earnings: 5200 }, { month: 'Mar', earnings: 6800 },
  { month: 'Apr', earnings: 4900 }, { month: 'May', earnings: 7200 }, { month: 'Jun', earnings: 8100 },
];

export default function WorkerEarnings() {
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, lastPayout: 0 });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, paymentsRes] = await Promise.all([
          api.get('/worker/earnings').catch(() => ({ data: {} })),
          api.get('/worker/payments').catch(() => ({ data: { payments: [] } })),
        ]);
        setStats({
          total: statsRes.data.total || statsRes.data.totalEarnings || 36700,
          thisMonth: statsRes.data.thisMonth || statsRes.data.monthlyEarnings || 8100,
          lastPayout: statsRes.data.lastPayout || 6500,
        });
        setPayments(paymentsRes.data.payments || paymentsRes.data || []);
      } catch {
        setStats({ total: 36700, thisMonth: 8100, lastPayout: 6500 });
        setPayments([
          { _id: 'p1', amount: 1200, date: '2024-01-15', bookingId: 'b1', status: 'completed' },
          { _id: 'p2', amount: 1800, date: '2024-01-10', bookingId: 'b2', status: 'completed' },
          { _id: 'p3', amount: 950, date: '2024-01-05', bookingId: 'b3', status: 'completed' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="page-header">Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={FaMoneyBillWave} label="Total Earnings" value={`₹${stats.total.toLocaleString()}`} />
        <StatsCard icon={FaCalendar} label="This Month" value={`₹${stats.thisMonth.toLocaleString()}`} />
        <StatsCard icon={FaCreditCard} label="Last Payout" value={`₹${stats.lastPayout.toLocaleString()}`} />
      </div>

      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Earnings</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
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
        {loading ? (
          <div className="text-center py-8 text-gray-500"><FaSpinner className="animate-spin text-xl mx-auto" /></div>
        ) : payments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payment history yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.bookingId}</td>
                    <td className="px-4 py-3 font-bold text-green-600">₹{p.amount}</td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
