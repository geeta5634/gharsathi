"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FaHome, FaBell, FaCalendarCheck, FaMoneyBillWave, FaUser, FaBars } from 'react-icons/fa';

const links = [
  { href: '/worker', label: 'Dashboard', icon: FaHome },
  { href: '/worker/new-bookings', label: 'New Bookings', icon: FaBell },
  { href: '/worker/bookings', label: 'My Bookings', icon: FaCalendarCheck },
  { href: '/worker/earnings', label: 'Earnings', icon: FaMoneyBillWave },
  { href: '/worker/profile', label: 'Profile', icon: FaUser },
];

export default function WorkerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar links={links} title="Worker Portal" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 bg-gray-50">
        <div className="md:hidden sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <FaBars className="text-xl" />
          </button>
          <span className="font-bold text-gray-800">Worker Portal</span>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
