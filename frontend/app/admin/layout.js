"use client";

import { useState } from 'react';
import { FaHome, FaCalendarCheck, FaUsers, FaUserTie, FaCogs, FaMoneyBillWave, FaCog, FaBars, FaTimes } from 'react-icons/fa';

const links = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/bookings', label: 'Bookings', icon: FaCalendarCheck },
  { href: '/admin/workers', label: 'Workers', icon: FaUserTie },
  { href: '/admin/customers', label: 'Customers', icon: FaUsers },
  { href: '/admin/services', label: 'Services', icon: FaCogs },
  { href: '/admin/revenue', label: 'Revenue', icon: FaMoneyBillWave },
  { href: '/admin/settings', label: 'Settings', icon: FaCog },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 min-h-screen bg-gray-900 text-gray-300 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-lg font-bold text-white">Admin Panel</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <nav className="space-y-1">
            {links.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-medium text-sm"
                >
                  <Icon className="text-lg" />
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-30 bg-gray-900 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300">
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="font-bold text-white">Admin Panel</span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
