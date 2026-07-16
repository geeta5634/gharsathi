"use client";

import { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/lib/auth';
import { getAllUsers, getAllListings, getContactMessages } from '@/lib/supabase/listings';
import { FaUserTie, FaUsers, FaThList, FaEnvelope, FaSpinner } from 'react-icons/fa';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ workers: 0, customers: 0, listings: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [users, listings, messages] = await Promise.all([
        getAllUsers(),
        getAllListings(),
        getContactMessages(),
      ]);
      setStats({
        workers: users.filter(u => u.role === 'worker').length,
        customers: users.filter(u => u.role === 'customer').length,
        listings: listings.length,
        messages: messages.length,
      });
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-header">Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={FaUserTie} label="Total Workers" value={stats.workers.toLocaleString()} />
          <StatsCard icon={FaUsers} label="Total Customers" value={stats.customers.toLocaleString()} />
          <StatsCard icon={FaThList} label="Total Listings" value={stats.listings.toLocaleString()} />
          <StatsCard icon={FaEnvelope} label="Messages" value={stats.messages.toLocaleString()} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/workers" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <FaUserTie className="text-2xl text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Manage Workers</span>
            </a>
            <a href="/admin/customers" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <FaUsers className="text-2xl text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Manage Customers</span>
            </a>
            <a href="/admin/listings" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <FaThList className="text-2xl text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">All Listings</span>
            </a>
            <a href="/admin/messages" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 transition-colors">
              <FaEnvelope className="text-2xl text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Messages</span>
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
          <p className="text-gray-500 text-sm">Admin dashboard shows overall platform statistics. Use the sidebar to manage specific sections.</p>
        </div>
      </div>
    </div>
  );
}
