"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useBookings } from '@/lib/hooks';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaPlus, FaThList, FaUser, FaEnvelope, FaSpinner } from 'react-icons/fa';

export default function CustomerDashboard() {
  const { profile } = useAuth();
  const { data: bookings = [], isLoading } = useBookings({ limit: 10 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
              <p className="text-gray-500">Welcome back, {profile?.name || 'User'}</p>
            </div>
            <Link href="/listings/new" className="btn-primary mt-4 md:mt-0 inline-flex items-center gap-2">
              <FaPlus /> Add Listing
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FaThList className="text-xl text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                <p className="text-gray-500 text-sm">My Bookings</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <FaUser className="text-xl text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{profile?.role || 'customer'}</p>
                <p className="text-gray-500 text-sm">Account Type</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaEnvelope className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate">{profile?.email || 'No email'}</p>
                <p className="text-gray-500 text-sm">Email</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">My Bookings</h2>
            {isLoading ? (
              <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-2xl text-primary-600" /></div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven&apos;t made any bookings yet.</p>
                <Link href="/customer/book" className="btn-primary inline-flex items-center gap-2"><FaPlus /> Book a Service</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map(b => (
                  <div key={b._id} className="border rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <h3 className="font-bold text-gray-800">{b.service?.name || 'Service'}</h3>
                    <p className="text-sm text-gray-500 mt-1">{b.description?.substring(0, 80)}</p>
                    <p className="text-primary-600 font-bold mt-2">₹{b.price?.total || 0}</p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full mt-2 inline-block capitalize">{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
