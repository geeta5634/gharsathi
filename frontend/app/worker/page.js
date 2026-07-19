"use client";

import { useAuth } from '@/lib/auth';
import { useWorkerStats } from '@/lib/hooks';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StatsCardSkeleton } from '@/components/Skeletons';
import { FaUser, FaStar, FaTools, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';

export default function WorkerDashboard() {
  const { profile } = useAuth();
  const { data: stats, isLoading } = useWorkerStats();

  const items = stats ? [
    { icon: FaCheckCircle, label: 'Completed Jobs', value: stats.completedJobs || '0', color: 'text-green-600 bg-green-100' },
    { icon: FaStar, label: 'Rating', value: stats.rating?.toFixed(1) || '0', color: 'text-accent-600 bg-accent-100' },
    { icon: FaTools, label: 'Trust Score', value: (stats.trustScore || 0) + '%', color: 'text-primary-600 bg-primary-100' },
    { icon: FaCalendarCheck, label: 'Active Bookings', value: stats.activeBookings || '0', color: 'text-blue-600 bg-blue-100' },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Worker Dashboard</h1>
          <p className="text-gray-500 mb-8">Welcome back, {profile?.name || 'Worker'}</p>

          {isLoading ? (
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              {items.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="card flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="/worker/new-bookings" className="btn-primary text-center">View Available Bookings</a>
              <a href="/worker/bookings" className="btn-accent text-center">My Bookings</a>
              <a href="/worker/earnings" className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-green-600">View Earnings</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
