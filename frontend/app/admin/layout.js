"use client";

import Sidebar from '../../components/Sidebar';
import { FaHome, FaCalendarCheck, FaUsers, FaUserTie, FaCogs, FaMoneyBillWave, FaCog } from 'react-icons/fa';

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
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 min-h-screen bg-gray-900 text-gray-300 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-lg font-bold text-white">Admin Panel</span>
          </div>
          <nav className="space-y-1">
            {links.map(link => {
              const Icon = link.icon;
              return (
                <a key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-medium text-sm">
                  <Icon className="text-lg" />
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
