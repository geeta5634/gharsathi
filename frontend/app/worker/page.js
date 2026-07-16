"use client";

import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaUser, FaStar, FaTools, FaCheckCircle } from 'react-icons/fa';

export default function WorkerDashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Worker Dashboard</h1>
          <p className="text-gray-500 mb-8">Welcome back, {profile?.name || 'Worker'}</p>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {[
              { icon: FaCheckCircle, label: 'Completed Jobs', value: '24', color: 'text-green-600 bg-green-100' },
              { icon: FaStar, label: 'Rating', value: '4.7', color: 'text-accent-600 bg-accent-100' },
              { icon: FaTools, label: 'Services', value: '3', color: 'text-primary-600 bg-primary-100' },
              { icon: FaUser, label: 'Trust Score', value: '85%', color: 'text-blue-600 bg-blue-100' },
            ].map((stat, idx) => {
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

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Available Bookings</h2>
            <p className="text-gray-500 text-sm">No new bookings available right now. Check back later.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
