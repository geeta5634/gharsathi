"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth';
import api from '../../../lib/api';
import StatsCard from '../../../components/StatsCard';
import BookingCard from '../../../components/BookingCard';
import { FaCalendarCheck, FaMoneyBillWave, FaCrown, FaBolt, FaWrench, FaPaintRoller, FaBroom, FaHammer, FaCar } from 'react-icons/fa';

const quickServices = [
  { name: 'Plumber', icon: FaWrench, color: 'bg-blue-100 text-blue-600' },
  { name: 'Electrician', icon: FaBolt, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Carpenter', icon: FaHammer, color: 'bg-amber-100 text-amber-600' },
  { name: 'House Painter', icon: FaPaintRoller, color: 'bg-purple-100 text-purple-600' },
  { name: 'House Cleaning', icon: FaBroom, color: 'bg-green-100 text-green-600' },
  { name: 'Driver / Maid', icon: FaCar, color: 'bg-red-100 text-red-600' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, statsRes] = await Promise.all([
          api.get('/bookings?limit=5').catch(() => ({ data: { bookings: [] } })),
          api.get('/bookings/stats').catch(() => ({ data: {} })),
        ]);
        setBookings(bookingsRes.data.bookings || bookingsRes.data || []);
        setStats(statsRes.data);
      } catch {
        // API not connected - use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="page-header">Welcome back, {user?.name || 'Customer'}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={FaCalendarCheck} label="Total Bookings" value={stats.totalBookings || 0} />
        <StatsCard icon={FaMoneyBillWave} label="Total Spent" value={`₹${stats.totalSpent || 0}`} />
        <StatsCard icon={FaCrown} label="Membership" value={user?.membership || 'Basic'} />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Book a Service</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickServices.map((s) => (
            <Link key={s.name} href="/customer/book" className="card text-center hover:border-primary-300 group">
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <s.icon className="text-xl" />
              </div>
              <p className="text-sm font-semibold text-gray-700">{s.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
          <Link href="/customer/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</Link>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            <FaCalendarCheck className="text-4xl text-gray-300 mx-auto mb-3" />
            <p>No bookings yet. Book your first service!</p>
            <Link href="/customer/book" className="btn-primary inline-block mt-4">Book Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
