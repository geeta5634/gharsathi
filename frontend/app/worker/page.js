"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import StatsCard from '@/components/StatsCard';
import BookingCard from '@/components/BookingCard';
import TrustScoreBadge from '@/components/TrustScoreBadge';
import { useWorkerStats, useBookings } from '@/lib/hooks';
import { StatsCardSkeleton, BookingCardSkeleton, DashboardSkeleton } from '@/components/Skeletons';
import { FaCalendarCheck, FaMoneyBillWave, FaStar, FaBell } from 'react-icons/fa';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useWorkerStats();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings({ limit: 5 });

  return (
    <div>
      <h1 className="page-header">Welcome, {user?.name || 'Worker'}!</h1>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={FaCalendarCheck} label="Total Jobs" value={stats?.totalJobs || 0} />
          <StatsCard icon={FaMoneyBillWave} label="Earnings This Month" value={`₹${stats?.earnings?.thisMonth || stats?.earnings || 0}`} />
          <StatsCard icon={FaStar} label="Rating" value={(stats?.rating || user?.rating || 4.5).toFixed(1)} />
          <div className="stat-card">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center"><FaStar className="text-2xl text-primary-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Trust Score</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.trustScore || user?.trustScore || 75}</p>
              <TrustScoreBadge score={stats?.trustScore || user?.trustScore || 75} />
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h2>
          {bookingsLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)}</div>
          ) : bookings.length === 0 ? (
            <div className="card text-center py-8 text-gray-500">No bookings yet</div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map(b => <BookingCard key={b._id} booking={b} />)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/worker/new-bookings" className="card flex items-center gap-4 hover:border-primary-300">
              <FaBell className="text-2xl text-accent-500" />
              <div>
                <p className="font-bold text-gray-800">New Bookings</p>
                <p className="text-sm text-gray-500">Check and accept new service requests</p>
              </div>
            </Link>
            <Link href="/worker/earnings" className="card flex items-center gap-4 hover:border-primary-300">
              <FaMoneyBillWave className="text-2xl text-green-500" />
              <div>
                <p className="font-bold text-gray-800">View Earnings</p>
                <p className="text-sm text-gray-500">Check your earnings and payout history</p>
              </div>
            </Link>
            <Link href="/worker/profile" className="card flex items-center gap-4 hover:border-primary-300">
              <FaStar className="text-2xl text-yellow-500" />
              <div>
                <p className="font-bold text-gray-800">Update Profile</p>
                <p className="text-sm text-gray-500">Keep your profile and availability updated</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
